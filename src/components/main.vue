<template>
  <b-container id="app" style="position: relative;">
    <b-navbar toggleable="md" type="white" variant="white" class="fixed-top">
      <h1 class="text-center" style="display: inline-block; margin: 0 auto">{{getNavBarText || '未設定'}}</h1>
    </b-navbar>
      <div class="d-none d-md-block main-picture" :style="{background: 'url(' + getHeadPic || 'https://loremflickr.com/1024/768' + ')'}">
        <div class="main-picture--element"></div>
      </div>
      <div class="loading" v-if="loading === true">
        <div class="loading-item-0"></div>
      </div>
      <b-row :class="{'loadingBlur': loading}">
        <b-col sm="12" md="8" lg="8">
          <div class="main-block">
            <ul class="main-block--element">
              <li class="main-block--element-mod"
                  v-for="(obj, index) in filterData.slice(pageStart, pageStart + countOfPage)"
                  :id="'list' + pageStart + index">
                <b-row>
                  <b-col>
                    <h1>{{obj.title}}</h1>
                  </b-col>
                  <b-col right>
                    <b-row>
                      <b-col sm="12" right>
                        <a href="#" class="float-right text-right d-md-none d-block" @click="setHashTagKeyToNone" v-if="index === 0">#All</a>
                        <a class="float-right text-right" v-if="obj.hashTag !== undefined" v-for="item in obj.hashTag" @click="setHashTagKeyWord(item)" href="#">#{{item}} </a>
                      </b-col>
                      <b-col sm="12" right>
                        <h4 class="float-right text-right">{{obj.time || now}}</h4>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="mb-3" sm="12" v-for="pic in obj.pic" :key="pic.id">
                    <div class="innerImg-block" @click="changeToFullScreen(pic); setNowPost(obj.pic); frontPost(index); nextPost(index);">
                      <b-img v-bind:src="pic" class="innerImg-block--element" fluid></b-img>
                    </div>
                  </b-col>
                </b-row>
                <div class="fullScreen-block d-none d-md-block" v-if="fScreen === true">
                  <div class="text-white fullScreen-block-element-closer" @click="closeFullScreen"><a href="#">X</a></div>
                  <div class="fullScreen-block-element-arrowContainer-left" @click="changeToLeft">
                    <div class="fullScreen-block-element-left"></div>
                  </div>
                  <div class="fullScreen-block-element-arrowContainer-right" @click="changeToRight">
                    <div class="fullScreen-block-element-right"></div>
                  </div>
                  <div class="fullScreen-block-element-imgContainer">
                    <b-img class="fullScreen-block-element-imgContainer-img" v-bind:src="fScreenImg"
                           v-if="fScreenImg !== undefined" fluid></b-img>
                  </div>
                </div>
                <b-row>
                  <b-col>
                    <p style="font-weight: lighter;">{{obj.text}}</p>
                  </b-col>
                </b-row>
              </li>
            </ul>
          </div>
            <div style="position: relative;">
              <b-button-toolbar aria-label="Toolbar with button groups">
                <b-button-group class="mx-1">
                  <b-btn class="btn-sm" @click="setPage(currentPage - 1)" v-if="totalPage >= 1">&lsaquo;</b-btn>
                </b-button-group>
                <b-button-group class="mx-1">
                  <b-btn class="btn-sm" sm v-for="(obj, i) in totalPage" :key="i" @click="setPage(obj)">{{obj}}</b-btn>
                </b-button-group>
                <b-button-group class="mx-1">
                  <b-btn class="btn-sm" @click="setPage(currentPage + 1)" v-if="totalPage >= 1">&rsaquo;</b-btn>
                </b-button-group>
              </b-button-toolbar>
            </div>

        </b-col>
        <b-col sm="0" md="4" lg="4" class="d-none d-md-block">
          <div class="square">
            <div style="position: relative; max-width: 20rem;">
              <h1 class="mb-4">{{getTitleText}}</h1>
              <b-card border-variant="light"
                      header="關於我"
                      class="text-center">
                <p class="card-text">{{getProfileText}}</p>
                <b-img :src="getProfilePic" fluid></b-img>
              </b-card>
              <b-col sm="12">
                <a href="#" @click="setHashTagKeyToNone">#All</a>
              </b-col>
              <b-col sm="12" v-for="link in allHashTag" :key="link.id">
                <a @click="setHashTagKeyWord(link)" href="#">#{{link}}</a><br>
              </b-col>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-btn class="btn-circle" @click="chatOpen" id="chat"><span class="text-center">？？</span></b-btn>
      <b-popover :target="'chat'"
                 :placement="chatPosition"
                 title="請聯絡我！"
                 content="123"
                 :show.sync="chat">
        <b-form action="https://formspree.io/aa1010111@icloud.com" method="POST">
          <b-form-group id="emailGroupEmail"
                        label="您的信箱："
                        label-for="emailInput"
                        description="我們不會洩漏您的資訊。">
            <b-form-input id="emailInput"
                          type="email"
                          v-model="inputEmail"
                          name="_replyto"
                          required
                          placeholder="請輸入您的信箱。"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="emailGroupName"
                        label="您的大名："
                        label-for="nameInput"
          >
            <b-form-input id="nameInput"
                          type="text"
                          v-model="inputName"
                          required
                          placeholder="請輸入您的大名。"
                          name="name"
            ></b-form-input>
          </b-form-group>
          <b-form-textarea id="emailGroupTextArea"
                           v-model="inputText"
                           placeholder="請輸入您的寶貴意見。"
                           :rows="3"
                           :max-rows="6"
                           name="name">
          </b-form-textarea>
          <input type="hidden" name="_next" value="//localhost:8080/#/thanks" />
          <b-form-group>
            <b-button type="submit" class="btn-outline-info mt-3">送出</b-button>
          </b-form-group>
        </b-form>
      </b-popover>
    <b-col>
    </b-col>
    <div class="row mt-3">
      <hr class="col-11 text-center" style="background-color: rgba(0,0,0,0.5);">
    </div>
  </b-container>
</template>

<script>
  const databaseUI = firebase.database().ref().child('/UI/')
  Date.prototype.myDate = function () {
    if (this.getMinutes().length < 2) {
      let minute = JSON.stringify(this.getMinutes()).split("")
      this.myProp = minute.unshift("0")
    } else {
      this.myProp = this.getMinutes()
    }
  }
  let date = new Date()
  date.myDate()
  let minute = date.myProp
  let filters = {
    all: (object) => {
      return object
    },
    hashTag: (hashTag, object) => {
      let filterArray = []
      for (let obj in object) {
        if (object.hasOwnProperty(obj)) {
          for (let hashTagItem of object[obj].hashTag) {
            if (hashTagItem === hashTag) {
              filterArray.push(object[obj])
              break
            }
          }
        }
      }
      return filterArray
    }
  }
  export default {
    data() {
      return {
        now: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}  ${date.getHours()}: ${minute}`,
        msg: 'Welcome to Your Vue.js App',
        testImg: ['https://i.imgur.com/efFTTIT.jpg', 'https://i.imgur.com/AM3lVYo.gif', 'https://i.imgur.com/BwXxYmu.jpg', 'https://i.imgur.com/tZL0CbA.gif'
          , 'https://i.imgur.com/309wjS9.jpg', 'https://i.imgur.com/GynjwN2.jpg', 'https://i.imgur.com/oo4TKze.jpg'],
        dataAll: [],
        fScreen: false,
        fScreenImg: '',
        inputEmail: '',
        inputName: '',
        inputText: '',
        chatPosition: 'top',
        chat: false,
        currentPage: 1,
        countOfPage: 5,
        allHashTag: [],
        filterArray: [],
        view: 'all',
        hashTagKeyWord: '',
        loading: true,
        frontPic: [],
        nextPic: [],
        currentPost: 0,
        currentPostPic: [],
        UIBase: '',
        itemUI: []
      }
    },
    computed: {
      getNavBarText () {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'loading'
        }
        return this.itemUI[this.UIBase].navBarText
      },
      getTitleText () {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].titleText
      },
      getHeadPic () {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].headPic
      },
      getProfilePic() {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].profilePic
      },
      getProfileText () {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].profileText
      },
      fullScreenLeft() {
        if (this.filterData[this.currentPost - 1].pic === undefined) {
          return ''
        }
        return this.filterData[this.currentPost - 1].pic
      },
      fullScreenRight() {
        if (this.filterData[this.currentPost + 1].pic === undefined) {
          return ''
        }
        return this.filterData[this.currentPost + 1].pic
      },
      pageStart() {
        return ((this.currentPage - 1) * this.countOfPage)
      },
      totalPage() {
        return Math.ceil(this.filterData.length / this.countOfPage)
      },
      filterData() {
        if (this.view === 'all') {
          return filters[this.view](this.dataAll)
        } else if (this.view === 'hashTag') {
          return filters[this.view](this.hashTagKeyWord, this.dataAll)
        }
      }
    },
    methods: {
      frontPost (index) {
        if (this.filterData[index - 1] === undefined) {
          return
        }
        this.currentPost = index
        this.frontPic = this.dataAll[index - 1].pic
      },
      nextPost (index) {
        if (this.filterData[index + 1] === undefined) {
          return
        }
        this.currentPost = index
        this.nextPic = this.dataAll[index + 1].pic
      },
      setNowPost (picArray) {
        this.currentPostPic = picArray
      },
      changeToFullScreen(img) {
        this.fScreenImg = img
        this.fScreen = !this.fScreen
      },
      closeFullScreen() {
        this.fScreenImg = ''
        this.fScreen = !this.fScreen
      },
      changeToLeft() {
        if (this.currentPostPic[this.currentPostPic.indexOf(this.fScreenImg) - 1] === undefined) {
          this.currentPostPic = this.fullScreenLeft
          this.currentPost --
          this.fScreenImg = this.currentPostPic[this.currentPostPic.length - 1]
        } else {
          this.fScreenImg = this.currentPostPic[this.currentPostPic.indexOf(this.fScreenImg) - 1]
        }
      },
      changeToRight() {
        if (this.currentPostPic[this.currentPostPic.indexOf(this.fScreenImg) + 1] === undefined) {
          this.currentPostPic = this.fullScreenRight
          this.currentPost ++
          this.fScreenImg = this.currentPostPic[0]
        } else {
          this.fScreenImg = this.currentPostPic[this.currentPostPic.indexOf(this.fScreenImg) + 1]
        }
      },
      chatOpen() {
        this.chat = !this.chat
      },
      setPage(idx) {
        if (idx <= 0 || idx > this.totalPage) {
          return
        }
        this.currentPage = idx
      },
      getHashTag() {
        let vm = this
        for (let obj in vm.dataAll) {
          if (vm.dataAll.hasOwnProperty(obj)) {
            for (let hashTagItem of vm.dataAll[obj].hashTag) {
              if (vm.allHashTag.indexOf(hashTagItem) === -1) {
                vm.allHashTag.push(hashTagItem)
              }
            }
          }
        }
      },
      filterTest() {
        this.filterArray = filters.hashTag('work', this.dataAll)
      },
      setHashTagKeyWord(item) {
        this.view = 'hashTag'
        this.hashTagKeyWord = item
      },
      setHashTagKeyToNone () {
        this.view = 'all'
      }
    },
    mounted() {
      let vm = this
      databaseUI.on('value', (snap) => {
        snap.forEach((item) => {vm.UIBase = item.key})
        vm.itemUI = snap.val()
      })
      firebase.database().ref('/content/').on('value', (snapshot) => {
        snapshot.forEach((item) => {
          vm.dataAll.push(item.val())
        })
        vm.dataAll.reverse()
        vm.getHashTag()
        vm.loading = false
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fullScreenCloser {
    transition: .5s;
  }

  .fullScreenCloser:hover {
    animation: closerSpin 1s ease-in infinite backwards;
    content: '';
  }

  @keyframes closerSpin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #1e90ff;
  }

  .main-block {
    min-height: 100%;
    width: 100%;
    background-color: white;
    padding-bottom: -100px;
  }

  .main-picture {
    width: 100%;
    padding-left: 185px;
    padding-right: 185px;
    min-height: 30%;
    padding-bottom: 100px;
    background-size: cover;
    margin-bottom: 2rem;
  }

  .main-picture--element {
    min-height: 18rem;
    width: 100%;
  }

  .main-block--element {
    padding: 0;
    margin: 0
  }

  .main-block--element-mod {
    padding-bottom: 2rem
  }

  .innerImg-block--element {
    filter: opacity(.2);
    transition: .5s;
  }

  .innerImg-block--element:hover {
    filter: opacity(1);
  }

  .fullScreen-block {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    max-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    top: 50%;
    left: 50%;
    z-index: 9900;
    transform: translate(-50%, -50%)
  }

  .fullScreen-block-element-closer {
    position: absolute;
    top: 5%;
    right: 5%;
    z-index: 9995;
  }
  .fullScreen-block-element-arrowContainer-left {
    height: 100%;
    width: 3rem;
    border: none;
    background-color: transparent;
    left: 3%;
    position: relative;
    z-index: 9994;
  }
  .fullScreen-block-element-arrowContainer-right {
    height: 100%;
    width: 3rem;
    border: none;
    background-color: transparent;
    bottom: 0;
    right: 3%;
    position: absolute;
    z-index: 9994;
  }
  .fullScreen-block-element-left {
    height: 1.5rem;
    width: 1.5rem;
    border: .2rem ghostwhite solid;
    border-top: transparent;
    border-right: transparent;
    transform: rotate(45deg);
    position: absolute;
    top: 50%;
    left: 3%;
    z-index: 9991;
    box-shadow: #000 ;
  }
  .fullScreen-block-element-arrowContainer-left:hover {
    animation-play-state: running;
  }
  .fullScreen-block-element-right {
    height: 1.5rem;
    width: 1.5rem;
    border: .2rem ghostwhite solid;
    border-left: transparent;
    border-bottom: transparent;
    transform: rotate(45deg);
    position: absolute;
    top: 50%;
    right: 3%;
    z-index: 9991;
  }
  .fullScreen-block-element-arrowContainer-right:hover {
    animation-play-state: running;
  }
  @keyframes swingToLeft {
    0% {
      left: 10%
    }
    100% {
      left: 3%
    }
  }
  @keyframes swingToRight {
    0% {
      right: 3%
    }
    100% {
      right: calc(+30%);
    }
  }
  .fullScreen-block-element-imgContainer {
    position: absolute;
    width: 100%;
    height: 80%;
    top: 50%;
    transform: translateY(-50%);
  }

  .fullScreen-block-element-imgContainer-img {
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 80%;
    max-width: 90%;
  }

  .fullScreen-block-element-imgContainer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loading {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0,0,0,0.25);
    line-height: 100%;
    z-index: 9999;
  }
  .loading-item-0 {
    display: inline-block;
    position: absolute;
    height: 10rem;
    width: 10rem;
    margin: -5rem 0 0 -5rem;
    background-color: transparent;
    border: 1px #F8ECE1 solid;
    border-bottom: transparent;
    border-right: transparent;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    animation: loading 1s infinite ease;
  }
  @keyframes loading {
    from {
      transform: rotate(0deg);
    } to {
        transform: rotate(360deg);
      }
  }
  .loadingBlur {
    filter: blur(5px);
    z-index: 9999;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
