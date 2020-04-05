<template>
  <div>
    <Row>
      <Col span="2">
        <h3>权限列表:</h3>
      </Col>
      <Col span="22">
        <template v-if="permList.length > 0">
          <Tag
            closable
            type="border"
            @on-close="deletePermFromRoleWithConfirm([perm.permId])"
            v-for="perm in permList"
            :key="perm.permId"
            color="error"
            >{{ perm.permDesc }}</Tag
          >
        </template>
        <Button @click="showPermModal" size="small" icon="ios-add">
          添加权限</Button
        >
      </Col>
    </Row>
    <!-- 新增权限 -->
    <Modal v-model="showModal" title="新增角色" footer-hide>
      <Transfer
        :titles="['可添加权限', '已有权限']"
        filterable
        :data="allPermList"
        :list-style="{ height: '300px' }"
        :operations="['移除权限', '添加权限']"
        :target-keys="permListKeys"
        :filter-method="filterMethod"
        @on-change="handleChange"
      ></Transfer>
    </Modal>
  </div>
</template>

<script>
import {
  GET_ROLE_PERM_LIST,
  GET_PERM_LIST,
  DO_ADD_ROLE_PERM,
  DO_DELETE_ROLE_PERM
} from "@/api/perm.js";
export default {
  props: {
    row: Object
  },
  data() {
    return {
      permList: [],
      allPermList: [],
      permListKeys: [],
      showModal: false
    };
  },
  created() {
    this.getRolePermList();
    this.getPermList();
  },
  methods: {
    async handleChange(targetKeys, direction, moveKeys) {
      try {
        if (direction == "right") {
          await this.addPermToRole(moveKeys);
        } else {
          await this.deletePermFromRole(moveKeys);
        }
        await this.getRolePermList();
      } catch (error) {
        this.$Message.error("未知异常!");
      }
    },
    async getRolePermList() {
      let { data } = await GET_ROLE_PERM_LIST(this.row.roleId);
      this.permList = data;
      this.permListKeys = data.map(perm => {
        return perm.permId;
      });
    },
    async getPermList() {
      let { data } = await GET_PERM_LIST({ start: 0, count: 100 });
      this.allPermList = data.map(perm => {
        return {
          key: perm.permId,
          label: perm.permDesc
        };
      });
    },
    showPermModal() {
      this.showModal = true;
      this.getRolePermList();
      this.getPermList();
    },
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
    },
    async addPermToRole(permIdList) {
      let { data, status, message } = await DO_ADD_ROLE_PERM(
        this.row.roleId,
        permIdList
      );
      this.$Message[status](message);
    },
    async deletePermFromRole(permIdList) {
      let roleId = this.row.roleId;
      let { data, status, message } = await DO_DELETE_ROLE_PERM(
        roleId,
        permIdList
      );
      this.$Message[status](message);
    },
    deletePermFromRoleWithConfirm(permIdList) {
      let roleId = this.row.roleId;
      let vm = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除此权限吗?",
        async onOk() {
          await vm.deletePermFromRole(permIdList);
          await vm.getRolePermList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
