<template>
    <div class="introduceLists">
        <v-pageTitle vtitle="home"></v-pageTitle>

        <div class="clear"></div>

        <div class="content-list introduce-list" id="introduce-list">

            <template>
                <el-tabs v-model="activeName" @tab-click="handleNavClick">
                    <el-tab-pane :label="$t('introduce.introduceManage')" name="intro">

                        <!-- <introduceManage></introduceManage> -->

                        <div class="intro-manage">
                            <div class="intro-toolbar">
                                <el-button type="primary" @click="newIntro()">{{$t('introduce.addIntroduce')}}</el-button>
                                <el-button type="primary" @click="introSort()">{{$t('introduce.introduceSort')}}</el-button>
                            </div>
                            <el-row>
                                <el-col :sm="4" :md="4" :lg="4">
                                    <div class="intro-nav" id="intro-nav">
                                        <ul class="intro-list" id="intro-list">
                                            <li v-for="item in introGroupDatas" :key="item.id" @click="changeSelected(item.id)" :class="[isActive == item.id ? 'selected' :'']">                                                
                                                <span v-if="_SHOPLANGUAGE == 0"><a href="javascript:;">{{item.groupNamePojo.zh}}</a></span>
                                                <span v-if="_SHOPLANGUAGE == 1"><a href="javascript:;">{{item.groupNamePojo.en}}</a></span>
                                                <span v-if="_SHOPLANGUAGE == 2"><a href="javascript:;">{{item.groupNamePojo.jp}}</a></span>
                                            </li>
                                        </ul>
                                    </div>
                                </el-col>
                                <el-col :sm="20" :md="20" :lg="20">
                                    <div v-if="!sortTag">
                                        <div class="intro-content-list" id="intro-content-list">
                                            <el-row>
                                                <el-col :sm="24" :md="24" :lg="24" v-if="introDatas.length == 0">
                                                    <div style="text-align:center; padding-top:80px;">
                                                        <h3 v-if="_SHOPLANGUAGE == 0">当前提案组下没有提案，请添加</h3>
                                                        <h3 v-if="_SHOPLANGUAGE == 1">There is no proposal under the current proposal group. Please add</h3>
                                                        <h3 v-if="_SHOPLANGUAGE == 2">現在の提案グループの下に提案はありません。</h3>
                                                        
                                                    </div>
                                                </el-col>
                                                <el-col :sm="8" :md="8" :lg="8" v-for="item in introDatas" :key="item.id">
                                                    <el-card class="box-card intro-card" :body-style="{ padding: '0px' }">
                                                        <div slot="header" class="clearfix">                                                            
                                                            <span style="line-height: 36px;" v-if="_SHOPLANGUAGE == 0">{{item.titlePojo.zh}}</span>
                                                            <span style="line-height: 36px;" v-if="_SHOPLANGUAGE == 1">{{item.titlePojo.en}}</span>
                                                            <span style="line-height: 36px;" v-if="_SHOPLANGUAGE == 2">{{item.titlePojo.jp}}</span>
                                                            <el-button style="float: right; margin-left:10px;" type="text" @click="confirmDel(item)">
                                                                <i class="el-icon-delete"></i>
                                                            </el-button>
                                                            <el-button style="float: right;" type="text" @click="updateIntro(item)">
                                                                <i class="el-icon-edit"></i>
                                                            </el-button>
                                                        </div>
                                                        <div class="card-body">                                                            
                                                            <p v-if="_SHOPLANGUAGE == 0">{{item.contentPojo.zh}}</p>
                                                            <p v-if="_SHOPLANGUAGE == 1">{{item.contentPojo.en}}</p>
                                                            <p v-if="_SHOPLANGUAGE == 2">{{item.contentPojo.jp}}</p>
                                                        </div>
                                                    </el-card>
                                                </el-col>
                                            </el-row>
                                        </div>                                        
                                    </div>

                                    <div class="introSort" v-else>
                                        <div>
                                            <el-button @click="cancelSort()">{{$t('_global.back')}}</el-button>
                                        </div>
                                        <div class="drapSortList">
                                            <div class="drapSortList-list">
                                                <draggable :list="introDatas" class="dragArea" @change="moved" :options="{group:'introGroup'}">
                                                    <div class="list-complete-item" v-for="element in introDatas" :key='element'>
                                                        <div class="list-complete-item-handle">
                                                            <span v-if="_SHOPLANGUAGE == 0">{{element.titlePojo.zh}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 1">{{element.titlePojo.en}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 2">{{element.titlePojo.jp}}</span>
                                                            <span class="pull-right">
                                                                <i class="el-icon-d-caret"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </draggable>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-dialog :visible.sync="introDialogVisible" class="addDialog" v-bind:title="addTag ? $t('introduce.addIntroduce'):$t('introduce.updateIntroduce')" size="tiny">
                                <el-form :model="introForm" :rules="introFormRules" ref="introForm" label-width="100px" style="width:100%;">
                                    <el-form-item :label="$t('introduce.introduceGroupName')" prop="introGroup">                                        
                                        <el-select v-model="whichGroup" :placeholder="$t('placeholder.introGroup')" :disabled="!addTag">
                                            <el-option 
                                            v-for="item in introGroupDatas" 
                                            :key="item.id"
                                            :label=" _SHOPLANGUAGE == 0 ? item.groupNamePojo.zh : (_SHOPLANGUAGE == 1 ? item.groupNamePojo.en : item.groupNamePojo.jp)" 
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    
                                    <el-form-item :label="$t('introduce.introMotion')">
                                      <el-select v-model="introMotion" @change="motionChange()">
                                        <el-option :label="$t('introduce.selectMotion')" value="0"></el-option>
                                        <el-option 
                                        v-for="motion in motionLists" :key="motion.motionId" 
                                        :label="_SHOPLANGUAGE == 0 ? motion.motionNamePojo.zh : (_SHOPLANGUAGE == 1 ? motion.motionNamePojo.en : motion.motionNamePojo.jp)"
                                        :value="motion.motionId">
                                        </el-option>
                                      </el-select>
                                    </el-form-item>

                                    <el-form-item :label="$t('introduce.introduceName')" prop="title">
                                        <el-input v-model="introForm.title" :placeholder="$t('placeholder.introName')"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('introduce.introduceContent')" prop="content">
                                        <el-input type="textarea" :placeholder="$t('placeholder.introContent')" :autosize="{ minRows: 3, maxRows: 5}" v-model="introForm.content"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="addIntro()" v-if="addTag">{{$t('_global.lijiAdd')}}</el-button>
                                        <el-button type="primary" @click="updateIntroPost()" v-else>{{$t('_global.lijiEdit')}}</el-button>
                                        <el-button @click="cancelForm()">{{$t('_global.cancel')}}</el-button>
                                    </el-form-item>
                                </el-form>                                
                            </el-dialog>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane :label="$t('introduce.groupManage')" name="introGroup">
                        <introduceGroup></introduceGroup>
                    </el-tab-pane>
                </el-tabs>
            </template>

        </div>

    </div>
</template>

<script>
import store from "@/store/index";
import vPageTitle from "../common/pageTitle.vue";
import introduceGroup from "../introduce/introduceGroup.vue";
import $http from "../../utils/http";
import draggable from "vuedraggable";
import Cookies from "js-cookie";
import { baiduTranslate, returnTransArray } from "../../utils/translate.js";
export default {
  data() {
    return {
      activeName: "intro",
      introForm: {
        introGroup: "",
        title: "",
        content: ""
      },
      introFormRules: {
        title: [
          {
            required: true,
            message: this.$t("tips.rules.introTitle"),
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: this.$t("tips.rules.introContent"),
            trigger: "blur"
          },
          {
            max: 200,
            message: this.$t("tips.rules.intromaxChars"),
            trigger: "blur"
          }
        ]
      },
      introGroupDatas: [],
      introDatas: [],
      whichGroup: "",
      addTag: true,
      sortTag: false,
      isActive: 0,
      middleObj: {},
      introDialogVisible: false,
      introTitleTransArray: [],
      introContentTransArray: [],
      motionLists: [],
      introMotion: "",
      introMotionObj: {}
    };
  },

  components: {
    vPageTitle,
    introduceGroup,
    draggable
  },

  computed: {
    _SHOPLANGUAGE() {
      return Cookies.get("SHOPLANGUAGE");
    }
  },

  mounted() {
    window.onresize = function() {
      setTimeout(getHeight, 500);
    };
    getHeight();
    function getHeight() {
      //动态计算属性导航的高度
      var introduceHeight = document.body.clientHeight - 286;
      document.getElementById("intro-nav").style.height =
        introduceHeight + "px";
      document.getElementById("intro-content-list").style.height =
        introduceHeight + "px";
    }
  },

  created() {
    //默认获取属性列表
    this.getIntroGroupList();
    this.getMotionList();
  },

  methods: {
    handleNavClick(tab, event) {
      if (tab.name == "intro") {
        this.getIntroGroupList();
      }
    },

    async getMotionList() {
      var res = await $http.get("/coron-web/robotMotion/list", {
        rp: 100,
        page: 1
      });
      if (res.status) {
        this.motionLists = res.rows;
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },

    motionChange() {
      if (this.introMotion == "0") {
        this.introMotionObj = {};
      } else {
        this.introMotionObj = {};
        this.motionLists.forEach((value, key) => {
          if (value.motionId == this.introMotion) {
            this.introMotionObj.motionId = this.motionLists[key].motionId;
            this.introMotionObj.motionCode = this.motionLists[key].motionCode;
            this.introMotionObj.motionNamePojo = this.motionLists[
              key
            ].motionNamePojo;
          }
        });
        console.log(this.introMotionObj);
      }
    },

    getIntroGroupList() {
      $http
        .get("/coron-web/introduceGroup/list")
        .then(response => {
          response.status &&
            (this.introGroupDatas = response.entry) &&
            (this.isActive = this.whichGroup = response.entry[0].id) &&
            this.getIntroList(this.isActive);
        })
        .catch(error => {
          console.log(error);
        });
    },

    getIntroList(itemId) {
      let getParams = { groupId: itemId };

      $http
        .get("/coron-web/introduce/list", { groupId: itemId })
        .then(response => {
          response.status && (this.introDatas = response.rows);
        })
        .catch(error => {
          console.log(error);
        });
    },

    newIntro() {
      this.addTag = true;
      this.addBtn = true;
      this.introForm.title = "";
      this.introForm.content = "";
      this.introMotion = '0';
      this.introDialogVisible = true;
    },

    async addIntro() {
      var self = this;
      await self.translateContent(self.introForm.title, "introTitle");
      await self.translateContent(self.introForm.content, "introContent");

      let introTitleObj = {
        zh: self.introForm.title,
        jp: self.introForm.title,
        en: self.introForm.title
      };
      let introContentObj = {
        zh: self.introForm.content,
        jp: self.introForm.content,
        en: self.introForm.content
      };
      if (self.introTitleTransArray.length > 0) {
        introTitleObj = Object.assign(
          introTitleObj,
          self.introTitleTransArray[0]
        );
      }

      if (self.introContentTransArray.length > 0) {
        introContentObj = Object.assign(
          introContentObj,
          this.introContentTransArray[0]
        );
      }

      let addParams = {
        groupId: self.whichGroup,
        motionsPojo: self.introMotionObj,
        titlePojo: introTitleObj,
        contentPojo: introContentObj,
        type: 1,
        position: 0
      };
      self.$refs["introForm"].validate(valid => {
        if (valid) {
          $http
            .post("/coron-web/introduce/add", addParams)
            .then(response => {
              console.log(response);
              if (response.status) {
                self.addTag = false;
                self.getIntroList(self.whichGroup);
                self.introDialogVisible = false;
              } else {
                self.$message.error(response.responseCode);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          self.$message({
            type: "warning",
            message: this.$t("tips.rules.error")
          });
        }
      });
    },

    async translateContent(itemName, type) {
      var self = this;
      let _language = self._SHOPLANGUAGE;
      if (itemName !== "") {
        var res = await baiduTranslate(itemName, _language);
        switch (type) {
          case "introTitle":
            self.introTitleTransArray = returnTransArray(res);
            break;
          case "introContent":
            self.introContentTransArray = returnTransArray(res);
            break;
        }
      }
    },

    updateIntro(item) {
      console.log(item);
      this.addTag = false;
      this.addBtn = false;
      this.introDialogVisible = true;
      if (this._SHOPLANGUAGE == 0) {
        this.introForm.title = item.titlePojo.zh;
        this.introForm.content = item.contentPojo.zh;
      } else if (this._SHOPLANGUAGE == 1) {
        this.introForm.title = item.titlePojo.en;
        this.introForm.content = item.contentPojo.en;
      } else if (this._SHOPLANGUAGE == 2) {
        this.introForm.title = item.titlePojo.jp;
        this.introForm.content = item.contentPojo.jp;
      }
      this.introMotion = !!item.motionsPojo ? item.motionsPojo.motionId : '0';

      this.whichGroup = item.groupId;
      this.middleObj = item;
      console.log(this.middleObj);
      this.motionChange();
    },

    async updateIntroPost() {
      var self = this;

      console.log(self.middleObj);

      let introTitleObj = {
        zh: self.introForm.title,
        jp: self.introForm.title,
        en: self.introForm.title
      };
      let introContentObj = {
        zh: self.introForm.content,
        jp: self.introForm.content,
        en: self.introForm.content
      };

      if (
        self.introForm.title === self.middleObj.titlePojo.zh ||
        self.introForm.title === self.middleObj.titlePojo.en ||
        self.introForm.title === self.middleObj.titlePojo.jp
      ) {
        introTitleObj = self.middleObj.titlePojo;
      } else {
        await self.translateContent(self.introForm.title, "introTitle");
        if (self.introTitleTransArray.length > 0) {
          introTitleObj = Object.assign(
            introTitleObj,
            self.introTitleTransArray[0]
          );
        }
      }
      if (
        self.introForm.content === self.middleObj.contentPojo.zh ||
        self.introForm.content === self.middleObj.contentPojo.en ||
        self.introForm.content === self.middleObj.contentPojo.jp
      ) {
        introContentObj = self.middleObj.contentPojo;
      } else {
        await self.translateContent(self.introForm.content, "introContent");
        if (self.introContentTransArray.length > 0) {
          introContentObj = Object.assign(
            introContentObj,
            this.introContentTransArray[0]
          );
        }
      }

      let updateParams = {
        id: self.middleObj.id,
        motionsPojo: self.introMotionObj,
        titlePojo: introTitleObj,
        contentPojo: introContentObj
      };

      self.$refs["introForm"].validate(valid => {
        if (valid) {
          $http
            .post("/coron-web/introduce/update", updateParams)
            .then(response => {
              console.log(response);
              if (response.status) {
                this.$message({
                  type: "success",
                  message: this.$t("tips.message.updateSuccess")
                });
                this.addTag = false;
                this.introDialogVisible = false;
                this.getIntroList(this.whichGroup);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
              this.$message({
                type: "error",
                message: this.$t("tips.message.network")
              });
            });
        } else {
          self.$message({
            type: "warning",
            message: this.$t("tips.rules.error")
          });
        }
      });
    },

    delIntro(item) {
      $http
        .post("/coron-web/introduce/delete", {
          id: item.id
        })
        .then(response => {
          if (response.status) {
            this.$message({
              type: "success",
              message: this.$t("tips.message.delSuccess")
            });
            this.getIntroList(this.isActive);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    confirmDel(item) {
      this.$confirm(
        this.$t("tips.message.delIntro"),
        this.$t("tips.message.hint"),
        {
          confirmButtonText: this.$t("tips.message.ok"),
          cancelButtonText: this.$t("tips.message.cancel"),
          closeOnClickModal: false,
          type: "warning"
        }
      )
        .then(() => {
          this.delIntro(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("tips.message.canceled")
          });
        });
    },

    changeSelected(itemId) {
      this.isActive = itemId;
      this.whichGroup = itemId;
      this.getIntroList(itemId);
    },

    cancelForm() {
      this.introDialogVisible = false;
    },

    introSort() {
      this.sortTag = true;
    },
    cancelSort() {
      this.sortTag = false;
    },

    sortIntro(itemParams) {
      $http
        .post("/coron-web/introduce/sort", itemParams)
        .then(response => {
          this.$message({
            type: "success",
            message: this.$t("tips.message.updateSuccess")
          });
          this.getIntroList();
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: this.$t("tips.message.updateError")
          });
        });
    },

    moved(evt) {
      let newIndex = evt.moved.newIndex;
      let oldIndex = evt.moved.oldIndex;

      if (newIndex > oldIndex) {
        let oldItem = this.introDatas[evt.moved.newIndex],
          newItem = this.introDatas[evt.moved.newIndex - 1];

        const item = {
          id: oldItem.id,
          groupId: newItem.groupId,
          oldIndex: oldItem.seq,
          newIndex: newItem.seq
        };

        this.sortIntro(item);
      } else {
        let oldItem = this.introDatas[evt.moved.newIndex],
          newItem = this.introDatas[evt.moved.newIndex + 1];

        const item = {
          id: oldItem.id,
          groupId: newItem.groupId,
          oldIndex: oldItem.seq,
          newIndex: newItem.seq
        };

        this.sortIntro(item);
      }
    }
  }
};
</script>

<style scoped>
.el-tab-pane {
  margin-bottom: 0;
}

.intro-nav {
  border-right: 1px solid #d1dbe5;
  padding-top: 20px;
}

.intro-toolbar {
  /* background: #f8f8f9; */
  padding: 8px 0 20px 20px;
  border-bottom: solid 1px #d1dbe5;
}

ul.intro-list {
  list-style: none;
  text-align: left;
  padding: 0;
  margin: 0;
}

ul.intro-list li {
  height: 42px;
  line-height: 42px;
  padding: 0 18px;
}

ul.intro-list li a {
  color: #6b6b6b;
}

li.selected {
  border-left: 3px solid #20a0ff;
  background-color: rgba(242, 242, 242, 1);
}

.content-list {
  padding: 8px;
}
.intro-content-list {
  padding: 8px;
  overflow-y: auto;
}
.introduce-list {
  padding: 0px;
}

.content-list .intro-card {
  margin: 0 8px 8px 0;
}

.card-body {
  height: 200px;
  overflow-y: auto;
}

.content-list .intro-card p {
  padding: 8px 10px;
  margin: 10px 0;
  text-indent: 2em;
}

.add-intro-form {
  padding: 20px 10px;
}

.input440 {
  width: 440px;
}

.introSort {
  padding: 30px 0 0 20px;
}
</style>