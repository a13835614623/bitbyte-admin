<template>
  <div class="index">
    <Layout>
      <Header>
        <Row type="flex" justify="space-between" align="middle">
          <Col span="12">
            <img
              style="display:block;"
              src="@/assets/img/logo.png"
              alt="bitbyte"
              width="100"
              height="30"
          /></Col>
          <Col span="2">
            <Dropdown @on-click="handleClickItems">
              <a href="javascript:void(0)">
                <Avatar :src="user.userPic" style="margin-right:5px;" />
                {{ user.userName }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">
                  退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Layout>
        <!-- 侧边导航 -->
        <Sider hide-trigger :style="{ background: '#fff' }">
          <Menu
            ref="menu"
            @on-select="changeMenu"
            :active-name="activeMenuName"
            :open-names="openMenuNames"
            theme="light"
            width="auto"
          >
            <template v-for="menu in siderMenus">
              <Submenu
                v-if="menu.items && menu.items[0]"
                :key="menu.name"
                :name="menu.name"
              >
                <template slot="title">
                  <Icon :type="menu.icon"></Icon>{{ menu.name }}
                </template>
                <MenuItem
                  v-for="(item, itemIndex) in menu.items"
                  :key="item.name + itemIndex"
                  :to="item.to"
                  :name="menu.name + '/' + item.name"
                  >{{ item.name }}</MenuItem
                >
              </Submenu>
              <MenuItem v-else :key="menu.name" :name="menu.name" :to="menu.to"
                ><Icon :type="menu.icon"></Icon>{{ menu.name }}</MenuItem
              >
            </template>
          </Menu>
        </Sider>
        <Layout>
          <Breadcrumb :style="{ padding: '24px', background: '#fff' }">
            <BreadcrumbItem v-for="menu in activeMenuNameArray" :key="menu">
              {{ menu }}
            </BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{ padding: '24px', minHeight: '280px' }"
            ><router-view @update-menu="updateMenu"
          /></Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { IS_LOGIN, LOGIN_URL } from "@/utils/util.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "index",
  data() {
    return {
      siderMenus: [
        {
          name: "首页",
          icon: "md-home",
          to: "/dashboard"
        },
        {
          name: "对象管理",
          icon: "md-contact",
          items: [
            {
              name: "用户管理",
              to: "/user/user-manage"
            },
            {
              name: "权限管理",
              to: "/user/perm-manage"
            },
            {
              name: "角色管理",
              to: "/user/role-manage"
            }
          ]
        },
        {
          name: "博客管理",
          icon: "ios-book",
          items: [
            {
              name: "文章管理",
              to: "/article/article-manage"
            },
            {
              name: "分区管理",
              to: "/article/part-manage"
            }
          ]
        },
        {
          name: "互动管理",
          icon: "md-people",
          items: [
            {
              name: "博客排行榜",
              to: "/action/article-toplist"
            },
            {
              name: "粉丝排行榜",
              to: "/action/fans-toplist"
            }
          ]
        }
        // {
        //   name: "统计分析",
        //   icon: "ios-stats",
        //   to: "/stats"
        // }
      ],
      activeMenuName: "首页",
      openMenuNames: [],
      activeMenuNameArray: []
    };
  },
  created() {
    this.initMenu();
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations(["CLEAR_USER"]),
    initMenu() {
      let path = this.$route.path;
      for (const menu of this.siderMenus) {
        if (menu.to) {
          if (path == menu.to) {
            this.activeMenuName = menu.name;
          }
        } else {
          for (const item of menu.items) {
            if (path == item.to) {
              this.activeMenuName = menu.name + "/" + item.name;
              this.openMenuNames.push(menu.name);
            }
          }
        }
      }
      this.changeMenu(this.activeMenuName);
    },
    changeMenu(name) {
      if (name != "首页")
        this.activeMenuNameArray = ["首页", ...name.split("/")];
      else this.activeMenuNameArray = [name];
    },
    updateMenu(path) {
      this.$router.push(path);
      this.initMenu();
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
        this.$refs.menu.updateOpened();
      });
    },
    handleClickItems(name) {
      console.log("点击了" + name);
      let vm = this;
      let hanldeMap = {
        logout() {
          vm.CLEAR_USER();
          window.location = LOGIN_URL;
        }
      };
      hanldeMap[name]();
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.index-logo {
  width: 100px;
  height: 30px;
  border-radius: 3px;
}
.index-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
