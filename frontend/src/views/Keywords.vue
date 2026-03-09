<template>
  <div class="keywords-container">
    <el-card>
      <div class="header">
        <h2>关键词管理</h2>
        <div>
          <el-button type="primary" @click="showDialog()">添加关键词</el-button>
          <el-button @click="handleLogout">退出</el-button>
        </div>
      </div>

      <el-table :data="keywords" style="width: 100%">
        <el-table-column prop="trigger" label="触发词" width="150" />
        <el-table-column prop="matchType" label="匹配类型" width="100">
          <template #default="{ row }">
            {{ matchTypeMap[row.matchType] }}
          </template>
        </el-table-column>
        <el-table-column prop="replyText" label="回复内容" show-overflow-tooltip />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="showDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑关键词' : '添加关键词'" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="触发词">
          <el-input v-model="form.trigger" />
        </el-form-item>
        <el-form-item label="匹配类型">
          <el-select v-model="form.matchType">
            <el-option label="精确匹配" value="exact" />
            <el-option label="包含匹配" value="contains" />
            <el-option label="正则匹配" value="regex" />
          </el-select>
        </el-form-item>
        <el-form-item label="回复文本">
          <div class="toolbar">
            <el-button size="small" @click="insertTag('b')">加粗</el-button>
            <el-button size="small" @click="insertTag('i')">斜体</el-button>
            <el-button size="small" @click="insertTag('u')">下划线</el-button>
            <el-button size="small" @click="insertTag('s')">删除线</el-button>
            <el-button size="small" @click="insertTag('code')">等宽</el-button>
            <el-button size="small" @click="insertTag('spoiler')">剧透</el-button>
            <el-button size="small" @click="insertLink">链接</el-button>
          </div>
          <el-input ref="textareaRef" v-model="form.replyText" type="textarea" :rows="6" />
          <div class="hint">支持 HTML 格式：&lt;b&gt;粗体&lt;/b&gt; &lt;i&gt;斜体&lt;/i&gt; &lt;a href="url"&gt;链接&lt;/a&gt;</div>
        </el-form-item>
        <el-form-item label="回复图片">
          <el-upload :auto-upload="false" :on-change="handleImageChange" :show-file-list="false">
            <el-button size="small">选择图片</el-button>
          </el-upload>
          <div v-if="form.replyImageFileId">文件ID: {{ form.replyImageFileId }}</div>
        </el-form-item>
        <el-form-item label="禁用链接预览">
          <el-switch v-model="form.disableWebPagePreview" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { keywordApi, uploadApi } from '../api/services';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const keywords = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const matchTypeMap: any = { exact: '精确', contains: '包含', regex: '正则' };
const textareaRef = ref();

const form = ref({
  trigger: '',
  matchType: 'exact',
  replyText: '',
  replyImageFileId: '',
  parseMode: 'HTML',
  disableWebPagePreview: false,
  enabled: true
});

const loadKeywords = async () => {
  const { data } = await keywordApi.getAll();
  keywords.value = data;
};

const showDialog = (row?: any) => {
  if (row) {
    isEdit.value = true;
    form.value = { ...row };
  } else {
    isEdit.value = false;
    form.value = {
      trigger: '',
      matchType: 'exact',
      replyText: '',
      replyImageFileId: '',
      parseMode: 'HTML',
      disableWebPagePreview: false,
      enabled: true
    };
  }
  dialogVisible.value = true;
};

const handleImageChange = async (file: any) => {
  try {
    const { data } = await uploadApi.uploadImage(file.raw);
    form.value.replyImageFileId = data.fileId;
    ElMessage.success('图片上传成功');
  } catch {
    ElMessage.error('图片上传失败');
  }
};

const insertTag = (tag: string) => {
  const textarea = textareaRef.value?.textarea;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = form.value.replyText.substring(start, end) || '文本';
  const before = form.value.replyText.substring(0, start);
  const after = form.value.replyText.substring(end);

  form.value.replyText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
};

const insertLink = () => {
  const url = prompt('请输入链接地址：', 'https://');
  if (!url) return;

  const textarea = textareaRef.value?.textarea;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = form.value.replyText.substring(start, end) || '链接文本';
  const before = form.value.replyText.substring(0, start);
  const after = form.value.replyText.substring(end);

  form.value.replyText = `${before}<a href="${url}">${selectedText}</a>${after}`;
};

const handleSave = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      await keywordApi.update(form.value.id, form.value);
    } else {
      await keywordApi.create(form.value);
    }
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadKeywords();
  } catch {
    ElMessage.error('保存失败');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' });
    await keywordApi.delete(id);
    ElMessage.success('删除成功');
    loadKeywords();
  } catch {}
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  loadKeywords();
});
</script>

<style scoped>
.keywords-container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.toolbar {
  margin-bottom: 8px;
}
.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
