<template>
  <div class="send_page">
    <h3>
      SendAnyWhere
      <span
        @click="drawer = true"
        class="el-icon-more h3_more"
        
      ></span>
      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        direction="btt"
        :with-header="false"
        size="50%"
      >
        <div class="more_sendpic">
          <el-upload
            class="upload-demo"
            drag
            action="/send/sendpic"
            multiple
            :data="{name}"
            :on-success="sendPicSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-drawer>
    </h3>
    <div class="main">
      <div v-for="(item,index) in messageList" :key="index" :id="index">
        <p class="message_time">{{item.time | toTime}}</p>
        <p v-if="item.type == 'txt'" class="message_txt">{{item.txt}}</p>
        <p v-if="item.type=='img'">
          <el-image fit="scale-down" :src="item.url" class="message_img"></el-image>
        </p>
      </div>
    </div>
    <div style="height:120px;"></div>

    <div class="footer_container">
      <el-input v-if="notLogin" placeholder="用户名(3-10位字母）" v-model="name">
        <el-button @click="setName" slot="append">确定</el-button>
      </el-input>
      <el-input v-else placeholder="请输入" v-model="message">
        <el-button @click="sendMessage" slot="append">发送</el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "Send",
  data() {
    return {
      name: "",
      notLogin: true,
      message: "",
      messageList: [],
      drawer: false
    };
  },
  created() {
    let name = localStorage.getItem("name");
    if (name) {
      this.name = name;
      this.notLogin = false;
    }
  },
  beforeMount() {
    this.getUserJson();
  },
  methods: {
    getUserJson() {
      if (!this.name) {
        return;
      }
      this.$axios.get(`/send/getuserjson?name=${this.name}`).then(res => {
        this.messageList = res.data.message;
      });
    },
    setName() {
      var _this = this;
      const reg = /\w{3,10}/;
      if (!reg.test(this.name)) {
        return;
      }
      this.$axios.get(`/send/setname?name=${this.name}`).then(res => {
        localStorage.setItem("name", _this.name);
        _this.notLogin = false;
      });
    },
    openDrawer() {
      this.drawer = true;
      console.log("111");
    },
    sendMessage() {
      var _this = this;
      if (!this.message) {
        return;
      }
      this.$axios
        .get(`/send/sendmessage?name=${this.name}&message=${this.message}`)
        .then(res => {
          _this.getUserJson();
          let json = {
            txt: _this.message,
            time: new Date(),
            type: "txt"
          };
          _this.message = "";
          _this.messageList.push(json);
          let len = _this.messageList.length;
          document.documentElement.scrollTop = (len + 2) * 1000;
        });
    },
    sendPicSuccess(res, file) {
      this.getUserJson();
      this.drawer = false;
      let len = this.messageList.length;
      document.documentElement.scrollTop = (len + 2) * 1000;
    }
  }
};
</script>

<style scoped>
.footer_container {
  width: 100%;
  position: fixed;
  height: 50px;
  bottom: 0;
  background-color: white;
}
h3{
   width:100%;
   position: relative;
  text-align: center;
}
.h3_more{
  position: absolute;
  right: 30px;
}

@media screen and (min-width: 500px) {
  .footer_container{
    width: 375px;
  }
  h3{
    width: 375px;
    text-align: center;
  }
}
.main {
  width: 94%;
  left: 3%;
  position: relative;
}
.message_time {
  font-size: 8px;
  color: rgb(170, 170, 170);
}
.more_sendpic {
  width: 94%;
  height: 94%;
  margin: 3%;
}
.message_img {
  width: 100%;
}
</style>
