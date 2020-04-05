<template>
  <div>
    <Card style="margin:0;">
      <h2 style="margin-bottom:24px;">
        <Icon type="md-person"></Icon>
        用户管理
      </h2>
      <!-- 搜索框 -->
      <Row :gutter="16">
        <Col span="5">
          <Input
            v-model="searchUser.userName"
            placeholder="用户昵称"
            clearable
          />
        </Col>
        <Col span="2">
          <Select v-model="searchUser.userSex" placeholder="性别">
            <Option v-for="item in USER_SEX_LIST" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input
            v-model="searchUser.userMobile"
            placeholder="手机号"
            clearable
          />
        </Col>
        <Col span="4">
          <Input v-model="searchUser.userEmail" placeholder="邮箱" clearable />
        </Col>
        <Col span="4">
          <Input
            v-model="searchUser.userAddress"
            placeholder="地址"
            clearable
          />
        </Col>
        <Col span="5">
          <Button
            type="primary"
            @click="firstSearch"
            icon="ios-search"
            style="margin-right:5px;"
            >搜索</Button
          >
          <Button type="success" @click="showAdd = true" icon="ios-add"
            >添加用户</Button
          >
        </Col>
      </Row>
      <Alert style="margin:12px 0;" show-icon>
        <!-- <span>设置角色</span> -->
        设置角色:在表格中点击选中要设置权限的数据行,点击左下角"设置角色"即可给用户设置角色。
      </Alert>
      <Divider>
        <span>用户列表</span>
        <span class="help-text">(共有{{ total }}位用户)</span>
      </Divider>
      <!-- 表格 -->
      <Table
        ref="table"
        border
        highlight-row
        @on-current-change="hanldleSelectRowChange"
        :columns="columns"
        :data="curUserList"
      >
        <template slot-scope="{ row }" slot="userPic">
          <img
            :src="row.userPic"
            width="30px"
            height="30px"
            style="border-radius:15px;"
          />
        </template>
        <template slot-scope="{ row }" slot="roleList">
          <!-- {{row.roleList}} -->
          <span v-for="role in row.roleList" :key="role.roleId">
            {{ role.roleDesc }}<br />
          </span>
        </template>
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
      <Button type="primary" @click="showRoleEditModal">设置角色</Button>
    </Card>
    <!-- 修改对话框 -->
    <Modal v-model="showEdit" title="编辑用户" footer-hide loading>
      <Form
        :model="editUser"
        :rules="ruleValidate"
        :label-width="80"
        ref="edit-form"
      >
        <!-- 昵称，手机号,邮箱 -->
        <template
          v-for="(label, key) in {
            userName: '昵称',
            userMobile: '手机号',
            userEmail: '邮箱'
          }"
        >
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="editUser[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <!-- 性别 -->
        <FormItem label="性别" prop="userSex">
          <Select v-model="editUser.userSex">
            <Option v-for="item in USER_SEX_LIST" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="出生日" prop="userBirthday">
          <DatePicker
            v-model="editUser.userBirthday"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="updateUser"
          >
            <span v-if="!loading">提交</span>
            <span v-else>正在提交...</span>
          </Button>
          <Button @click="showEdit = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 新增用户 -->
    <Modal v-model="showAdd" title="新增用户" footer-hide loading>
      <Form
        :model="addedUser"
        :rules="ruleValidate"
        :label-width="80"
        ref="add-form"
      >
        <!-- 昵称，手机号,邮箱 -->
        <template
          v-for="(label, key) in {
            userName: '昵称',
            userMobile: '手机号',
            userEmail: '邮箱'
          }"
        >
          <FormItem :label="label" :prop="key" :key="key">
            <Input
              v-model="addedUser[key]"
              :placeholder="'输入' + label"
            ></Input>
          </FormItem>
        </template>
        <!-- 性别 -->
        <FormItem label="性别" prop="userSex">
          <Select v-model="addedUser.userSex">
            <Option v-for="item in USER_SEX_LIST" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="出生日" prop="userBirthday">
          <DatePicker
            v-model="addedUser.userBirthday"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <!-- 密码 -->
        <FormItem label="密码" prop="userPassword">
          <Input
            type="password"
            password
            v-model="addedUser.userPassword"
            placeholder="输入密码"
          ></Input>
        </FormItem>
        <!-- 密码 -->
        <FormItem label="确认密码" prop="user">
          <Input
            v-model="addedUser.userCheckPwd"
            placeholder="确认密码"
            type="password"
            password
          ></Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="loading"
            style="margin-right:5px;"
            @click="addUser"
          >
            <span v-if="!loading">提交</span>
            <span v-else>正在提交...</span>
          </Button>
          <Button @click="showAdd = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 设置角色 -->
    <Modal v-model="showRoleEdit" title="设置用户角色" footer-hide>
      <Transfer
        :titles="['可添加角色', '已有角色']"
        filterable
        :data="allRoleList"
        :list-style="{ height: '300px' }"
        :operations="['移除角色', '添加角色']"
        :target-keys="roleListKeys"
        :filter-method="filterMethod"
        @on-change="handleRoleChange"
      ></Transfer>
    </Modal>
  </div>
</template>

<script>
import { USER_PROP_MAP, USER_SEX_LIST } from "@/utils/util";
import {
  DO_ADD_USER,
  GET_USER_LIST,
  DO_UPDATE_USER,
  DO_DELETE_USER
} from "@/api/user";
import {
  GET_ROLE_LIST,
  DO_ADD_ROLE_USER,
  DO_DELETE_ROLE_USER
} from "@/api/role.js";
// 邮箱正则表达式
let emailReg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
// 手机号正则表达式
let phoneReg = /^1[3-578]\d{9}$/;
export default {
  name: "user-manage",
  data() {
    let columns = Object.keys(USER_PROP_MAP)
      .map(key => {
        let res = {
          title: USER_PROP_MAP[key],
          key
        };
        if (key == "userPic") {
          res.slot = key;
          res.width = 70;
        }
        return res;
      })
      .filter(column => {
        return ["userId", "userPassword"].indexOf(column.key) == -1;
      });
    columns.unshift({
      title: "角色",
      slot: "roleList"
    });
    columns.unshift({
      title: "#",
      key: "index",
      minWidth: 30,
      maxWidth: 100
    });
    columns.push({
      title: "操作",
      slot: "action",
      width: 200
    });
    // 校验邮箱
    let validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      if (!emailReg.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      }
      callback();
    };
    // 校验手机号
    let validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      if (!phoneReg.test(value)) {
        return callback(new Error("手机号格式不正确"));
      }
      callback();
    };
    let validateCheckPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("确认密码不能为空"));
      } else if (value != this.addedUser.userPassword) {
        console.log(this.addedUser.userPassword);
        return callback(new Error("两次密码不一致"));
      }
      callback();
    };
    return {
      searchUser: {},
      columns,
      curUserList: [],
      total: 0,
      pageSize: 10,
      curPage: 1, //当前页码,
      USER_PROP_MAP,
      ruleValidate: {
        userName: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: "blur"
          },
          {
            message: "昵称不能超过16个字符",
            type: "string",
            min: 1,
            max: 16,
            trigger: "blur"
          }
        ],
        userBirthday: [
          {
            required: true,
            message: "出生日不能为空"
          }
        ],
        userSex: [
          {
            required: true,
            message: "性别不能为空"
          }
        ],
        userMobile: [{ validator: validateMobile, trigger: "blur" }],
        userEmail: [{ validator: validateEmail, trigger: "blur" }],
        roleList: [
          { required: true, type: "array", min: 1, message: "角色不能为空!" }
        ],
        userPassword: [
          {
            required: true,
            type: "string",
            min: 8,
            message: "密码不能少于8个字符"
          },
          {
            required: true,
            type: "string",
            max: 16,
            message: "密码不能多于16个字符"
          }
        ],
        userCheckPwd: [
          {
            validator: validateCheckPwd,
            trigger: "blur"
          }
        ]
      },
      loading: false,
      showAdd: false,
      showEdit: false,
      showRoleEdit: false,
      editRoleList: [],
      addedUser: {},
      editUser: {},
      USER_SEX_LIST,
      selectRow: {},
      allRoleList: [],
      roleListKeys: []
    };
  },
  created() {
    this.firstSearch();
    this.getRoleList();
  },
  computed: {
    // 当前页的开始索引
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
      let { data, more } = await GET_USER_LIST({
        user: this.searchUser,
        start,
        count: this.pageSize
      });
      this.curUserList = data.map((user, index) => {
        user.userBirthday = new Date(user.userBirthday).format("y-m-d");
        user.userPic = this.$USER_PIC_PREFIX + user.userPic;
        user.index = this.start + index + 1;
        user.roleList = user.roleList.map(({ roleDesc, roleId }) => {
          return { roleDesc, roleId };
        });
        return user;
      });
      this.total = more;
    },
    async getRoleList() {
      let { data } = await GET_ROLE_LIST({ start: 0, count: 10 });
      this.allRoleList = data.map(({ roleId, roleDesc }) => {
        return {
          key: roleId,
          label: roleDesc
        };
      });
    },
    pageChange(page) {
      this.curPage = page;
      this.search();
    },
    edit(row) {
      this.showEdit = true;
      this.editUser = this.$clone(row);
      this.editUser.roleList = this.editUser.roleList.map(({ roleId }) => {
        return roleId;
      });
    },
    async remove({ userId }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除此用户吗?",
        async onOk() {
          let { data, status, message } = await DO_DELETE_USER(userId);
          this.$Message[status](message);
          this.search();
        }
      });
    },
    updateUser() {
      this.$refs["edit-form"].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            this.showEdit = false;
            let { data, status, message } = await DO_UPDATE_USER(this.editUser);
            this.$Message[status](message);
          } catch (error) {
            console.error(error);
          } finally {
            this.loading = false;
            this.search();
          }
        }
      });
    },
    addUser() {
      this.$refs["add-form"].validate(async valid => {
        if (valid) {
          this.loading = true;
          this.showAdd = false;
          let { data, status, message } = await DO_ADD_USER(this.addedUser);
          this.$Message[status](message);
          this.addedUser = {};
          this.loading = false;
          this.search();
        }
      });
    },
    showRoleEditModal() {
      if (!this.selectRow.userId) {
        this.$Message.warning("请先选中要设置角色的数据行!");
      } else {
        this.showRoleEdit = true;
      }
    },
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
    },
    // 表格选中行改变
    hanldleSelectRowChange(currentRow, oldCurrentRow) {
      this.selectRow = currentRow;
      this.roleListKeys = currentRow.roleList.map(r => r.roleId);
    },
    async deleteRoleFromUser(roleIdList) {
      let { data, status, message } = await DO_DELETE_ROLE_USER(
        this.selectRow.userId,
        roleIdList
      );
      this.$Message[status](message);
    },
    async addRoleToUser(roleIdList) {
      let { data, status, message } = await DO_ADD_ROLE_USER(
        this.selectRow.userId,
        roleIdList
      );
      this.$Message[status](message);
    },
    // 角色设置改变
    async handleRoleChange(targetKeys, direction, moveKeys) {
      try {
        if (direction == "right") {
          await this.addRoleToUser(moveKeys);
        } else {
          await this.deleteRoleFromUser(moveKeys);
        }
        await this.search();
      } catch (error) {
        this.$Message.error("未知异常!");
      } finally {
        this.roleListKeys = targetKeys;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
