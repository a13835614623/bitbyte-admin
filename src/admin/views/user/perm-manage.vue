<template>
  <div>
    <Card style="margin:0;">
      <h2 style="margin-bottom:24px;">权限列表</h2>
      <!-- 搜索框 -->
      <Row :gutter="16">
        <Col span="8">
          <Input
            v-model="searchPerm.permStr"
            placeholder="权限表达式"
            clearable
          />
        </Col>
        <Col span="8">
          <Input
            v-model="searchPerm.permDesc"
            placeholder="权限描述"
            clearable
          />
        </Col>
        <Col span="8">
          <Button
            type="primary"
            @click="firstSearch"
            icon="ios-search"
            style="margin-right:5px;"
            >搜索</Button
          >
          <Button type="success" @click="add" icon="ios-add">添加权限</Button>
        </Col>
      </Row>
      <!-- 表格 -->
      <Table
        style="margin:24px 0;"
        border
        :columns="columns"
        :data="curPermList"
      >
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            icon="ios-create"
            style="margin-right: 5px"
            @click="edit(row)"
            >编辑</Button
          >
          <Button
            type="error"
            icon="ios-trash"
            size="small"
            @click="remove(row)"
            >删除</Button
          >
        </template>
      </Table>
      <!-- 分页 -->
      <Divider
        ><Page
          :current="curPage"
          :total="total"
          :page-size="pageSize"
          show-total
          @on-change="pageChange"
      /></Divider>
    </Card>
    <!-- 修改对话框 -->
    <Modal v-model="showEdit" title="编辑权限" footer-hide loading>
      <Form
        :model="editPerm"
        :rules="ruleValidate"
        :label-width="80"
        ref="edit-form"
      >
        <template v-for="(label, key) in PERM_PROP_MAP">
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="editPerm[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="updatePerm"
          >
            <span v-if="!loading">提交</span>
            <span v-else>正在提交...</span>
          </Button>
          <Button @click="showEdit = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 新增权限 -->
    <Modal v-model="showAdd" title="新增权限" footer-hide loading>
      <Form
        :model="addedPerm"
        :rules="ruleValidate"
        :label-width="80"
        ref="add-form"
      >
        <template v-for="(label, key) in PERM_PROP_MAP">
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="addedPerm[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="addPerm"
          >
            <span v-if="!loading">提交</span>
            <span v-else>正在提交...</span>
          </Button>
          <Button @click="showAdd = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { PERM_PROP_MAP } from "@/utils/util";
import {
  DO_ADD_PERM,
  GET_PERM_LIST,
  DO_UPDATE_PERM,
  DO_DELETE_PERM
} from "@/api/perm";
export default {
  name: "user-manage",
  data() {
    let columns = Object.keys(PERM_PROP_MAP).map(key => {
      return {
        title: PERM_PROP_MAP[key],
        key
      };
    });
    columns.unshift({
      title: "#",
      key: "index"
    });
    columns.push({
      title: "操作",
      slot: "action"
    });
    return {
      searchPerm: {
        permDesc: "",
        permStr: ""
      },
      columns,
      curPermList: [],
      total: 0,
      pageSize: 10,
      curPage: 1, //当前页码,
      showEdit: false,
      editPerm: {},
      PERM_PROP_MAP,
      ruleValidate: {
        permStr: [
          {
            required: true,
            message: "表达式不能为空",
            type: "string",
            min: 1,
            trigger: "blur"
          }
        ],
        permDesc: [
          {
            required: true,
            type: "string",
            min: 1,
            message: "描述不能为空",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      showAdd: false,
      addedPerm: {}
    };
  },
  created() {
    this.search();
  },
  computed: {
    start() {
      return this.pageSize * (this.curPage - 1);
    }
  },
  methods: {
    firstSearch() {
      this.curPage = 1;
      this.search();
    },
    // 搜索
    async search(start = this.start) {
      let { data, more } = await GET_PERM_LIST({
        perm: this.searchPerm,
        start,
        count: this.pageSize
      });
      this.curPermList = data.map((perm, index) => {
        perm.index = this.start + index + 1;
        return perm;
      });
      this.total = more;
    },
    pageChange(page) {
      this.curPage = page;
      this.search();
    },
    add() {
      this.showAdd = true;
    },
    edit({ permId, permDesc, permStr }) {
      this.showEdit = true;
      this.editPerm = { permId, permDesc, permStr };
    },
    async remove({ permId }) {
      let vm = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除此权限吗?",
        async onOk() {
          let { data, status, message } = await DO_DELETE_PERM(permId);
          vm.$Message[status](message);
          vm.search();
        }
      });
    },
    updatePerm() {
      this.$refs["edit-form"].validate(async valid => {
        if (valid) {
          this.loading = true;
          this.showEdit = false;
          let { data, status, message } = await DO_UPDATE_PERM(this.editPerm);
          this.$Message[status](message);
          this.loading = false;
          this.search();
        }
      });
    },
    addPerm() {
      this.$refs["add-form"].validate(async valid => {
        if (valid) {
          this.loading = true;
          this.showAdd = false;
          let { data, status, message } = await DO_ADD_PERM(this.addedPerm);
          this.$Message[status](message);
          this.addedPerm = {};
          this.loading = false;
          this.search();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
