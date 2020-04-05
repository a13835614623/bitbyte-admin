<template>
  <v-snackbar :timeout="3000" :value="show" @input="updateShow" :color="color">
    <span><v-icon left>mdi-information</v-icon>{{ text }}</span>
    <v-btn color="white" icon @click="updateShow(false)">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  methods: {
    updateShow(show) {
      this.$emit("update:show", show);
    }
  }
};
</script>

<style lang="scss" scoped></style>
