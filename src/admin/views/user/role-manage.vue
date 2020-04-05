<template>
  <div>
    <Card style="margin:0;">
      <h2 style="margin-bottom:24px;">角色列表</h2>
      <!-- 搜索框 -->
      <Row :gutter="16">
        <Col span="8">
          <Input
            v-model="searchRole.roleStr"
            placeholder="角色表达式"
            clearable
          />
        </Col>
        <Col span="8">
          <Input
            v-model="searchRole.roleDesc"
            placeholder="角色描述"
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
          <Button type="success" @click="add" icon="ios-add">添加角色</Button>
        </Col>
      </Row>
      <Alert style="margin:12px 0;" show-icon>
        <!-- <span>设置角色</span> -->
        查看权限:在表格中点击表格左侧的展开按钮即可查看角色的权限。
      </Alert>
      <Divider>
        <span>角色列表</span>
        <span class="help-text">(共有{{ total }}个角色)</span>
      </Divider>
      <!-- 表格 -->
      <Table
        border
        style="margin:24px 0;"
        :columns="columns"
        :data="curRoleList"
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
          @on-change="pageChange"/></Divider
    ></Card>
    <!-- 修改新增对话框 -->
    <Modal v-model="showEdit" title="编辑角色" footer-hide loading>
      <Form
        :model="editRole"
        :rules="ruleValidate"
        :label-width="80"
        ref="edit-form"
      >
        <template v-for="(label, key) in ROLE_PROP_MAP">
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="editRole[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="updateRole"
          >
            <span v-if="!loading">提交</span>
            <span v-else>正在提交...</span>
          </Button>
          <Button @click="showEdit = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 新增角色 -->
    <Modal v-model="showAdd" title="新增角色" footer-hide loading>
      <Form
        :model="addedRole"
        :rules="ruleValidate"
        :label-width="80"
        ref="add-form"
      >
        <template v-for="(label, key) in ROLE_PROP_MAP">
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="addedRole[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="addRole"
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
import expandRow from "@/admin/components/expand-row";
import { ROLE_PROP_MAP } from "@/utils/util";
import {
  DO_ADD_ROLE,
  GET_ROLE_LIST,
  DO_UPDATE_ROLE,
  DO_DELETE_ROLE
} from "@/api/role";
export default {
  name: "user-manage",
  data() {
    let columns = Object.keys(ROLE_PROP_MAP).map(key => {
      return {
        title: ROLE_PROP_MAP[key],
        key
      };
    });
    columns.unshift({
      title: "#",
      type: "expand",
      width: 50,
      key: "index",
      render: (h, params) => {
        return h(expandRow, {
          props: {
            row: params.row
          }
        });
      }
    });
    columns.push({
      title: "操作",
      slot: "action"
    });
    return {
      searchRole: {
        roleDesc: "",
        roleStr: ""
      },
      columns,
      curRoleList: [],
      total: 0,
      pageSize: 10,
      curPage: 1, //当前页码,
      showEdit: false,
      editRole: {},
      ROLE_PROP_MAP,
      ruleValidate: {
        roleStr: [
          {
            required: true,
            message: "表达式不能为空",
            type: "string",
            min: 1,
            trigger: "blur"
          }
        ],
        roleDesc: [
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
      addedRole: {}
    };
  },
  components: {
    expandRow
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
      let { data, more } = await GET_ROLE_LIST({
        role: this.searchRole,
        start,
        count: this.pageSize
      });
      this.curRoleList = data.map((role, index) => {
        role.index = this.start + index + 1;
        return role;
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
    edit({ roleId, roleDesc, roleStr }) {
      this.showEdit = true;
      this.editRole = { roleId, roleDesc, roleStr };
    },
    async remove({ roleId }) {
      let vm = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除此角色吗?",
        async onOk() {
          let { data, status, message } = await DO_DELETE_ROLE(roleId);
          vm.$Message[status](message);
          vm.search();
        }
      });
    },
    updateRole() {
      this.$refs["edit-form"].validate(async valid => {
        if (valid) {
          this.loading = true;
          this.showEdit = false;
          let { data, status, message } = await DO_UPDATE_ROLE(this.editRole);
          this.$Message[status](message);
          this.loading = false;
          this.search();
        }
      });
    },
    addRole() {
      this.$refs["add-form"].validate(async valid => {
        if (valid) {
          this.loading = true;
          this.showAdd = false;
          let { data, status, message } = await DO_ADD_ROLE(this.addedRole);
          this.$Message[status](message);
          this.addedRole = {};
          this.loading = false;
          this.search();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
