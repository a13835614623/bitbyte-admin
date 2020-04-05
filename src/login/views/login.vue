<template>
  <v-container>
    <v-row style="height:100vh;" align="center" justify="center">
      <v-col cols="6">
        <v-card hover>
          <v-card-title>登录</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="user.username"
                clearable
                prepend-icon="mdi-account"
                :rules="rules.username"
                label="手机号/邮箱"
                required
              ></v-text-field>
              <v-text-field
                v-model="user.password"
                prepend-icon="mdi-key"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPwd ? 'text' : 'password'"
                :counter="16"
                :rules="rules.password"
                label="密码"
                @click:append="showPwd = !showPwd"
                required
              ></v-text-field>
              <v-btn
                class="mt-7"
                :disabled="!valid"
                color="primary"
                block
                @click="login"
              >
                登录
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <loading :loading="loading" />
    <Toast :show.sync="msg.show" :text="msg.text" :color="msg.color" />
  </v-container>
</template>

<script>
import { DO_USER_LOGIN } from "@/api/user.js";
import loading from "@/components/loading";
import Toast from "@/components/toast";
import md5 from "crypto-js/md5";
import { mapMutations } from "vuex";
// 邮箱正则表达式
let emailReg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
// 手机号正则表达式
let phoneReg = /^1[3-578]\d{9}$/;
export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      showPwd: false,
      rules: {
        username: [
          v => !!v || "用户名不能为空!",
          v =>
            emailReg.test(v) ||
            phoneReg.test(v) ||
            "用户名必须为手机号或者邮箱!"
        ],
        password: [
          v => !!v || "密码不能为空!",
          v => (v.length >= 8 && v.length <= 16) || "密码必须为8-16个字符"
        ]
      },
      valid: false,
      loading: false,
      msg: {
        show: false,
        text: "",
        color: ""
      }
    };
  },
  components: {
    loading,
    Toast
  },
  created() {
    this.CLEAR_USER();
  },
  methods: {
    ...mapMutations(["SAVE_USER", "CLEAR_USER"]),
    async login() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let { data, status, message } = await DO_USER_LOGIN({
          username: this.user.username,
          password: md5(this.user.password)
        });
        if (status == "success") {
          this.SAVE_USER();
          this.$router.push("/entry");
        } else {
          this.showMsg(message, status);
        }
      } catch (error) {
        console.error(error);
        this.showMsg("服务器异常,请稍后再试!", "error");
      } finally {
        this.loading = false;
      }
    },
    showMsg(text, color) {
      this.msg.show = true;
      this.msg.text = text;
      this.msg.color = color;
    }
  }
};
</script>

<style lang="scss" scoped></style>
