<template>
  <b-container fluid id="app">
    <div class="row">
      <div class="col-sm-6 col-md-4 offset-md-4" v-if="logged === false">
        <h1 class="text-center login-title"><b>登入之後繼續</b></h1>
        <div class="account-wall">
          <img class="profile-img"
               src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
               alt="">
          <form class="form-signin" v-on:submit.prevent="login">
            <input type="text" class="form-control" placeholder="Email" v-model="inputAccount" required autofocus>
            <input type="password" class="form-control" placeholder="Password" v-model="inputPassword" required>
            <button class="btn btn-lg btn-outline-info btn-block" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
    <b-card no-body v-if="logged === true">
      <b-tabs pills card vertical nav-wrapper-class="w-50">
        <b-tab title="Tab 1" active>
          <ul>
            <li v-for="(data, index) in item" style="margin-bottom: 15px">
              <b-list-group>
                <b-list-group-item href="#" active class="flex-column align-items-start">
                  <div v-if="data.editing === false">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">{{data.title}}</h5>
                    </div>
                    <p class="mb-1">
                      {{data.text}}
                    </p>
                    <small>id: {{index}}</small>
                    <br>
                    <small v-for="item in data.hashTag">#{{item}}</small>
                    <br>
                    <b-button class="btn-outline-danger" @click="deleteData(index)">刪除</b-button>
                    <b-button class="btn-outline-warning">置頂</b-button>
                    <b-button class="btn-outline-info" @click="editData(index)">編輯</b-button>
                  </div>
                  <div class="d-flex w-100 justify-content-between" v-if="data.editing === true">
                    <b-row>
                      <b-col cols="12">
                        <p>請輸入標題：</p>
                        <b-form-input placeholder="請輸入標題" v-model="editTitle" class="mb-5"></b-form-input>
                        <p>請輸入圖片網址：</p>
                        <b-form-input placeholder="請輸入圖片網址" v-model="editInnerPic" class="mb-5"></b-form-input>
                      </b-col>
                      <b-col cols="12">
                        <p>請輸入內文：</p>
                        <b-form-textarea placeholder="請輸入內文" v-model="editInnerText" rows="3"></b-form-textarea>
                        <b-button class="btn mt-4 mb-5" @click="saveEditedData(index)">保存</b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </li>
          </ul>
        </b-tab>
        <b-tab title="Tab 2">
          <b-form>
            <b-input-group prepend="標題" class="mb-5">
              <b-form-input placeholder="請輸入標題" v-model="inputTitle" required></b-form-input>
            </b-input-group>
            <b-input-group>
              <b-form-input placeholder="請輸入圖片網址" v-model="inputInnerPicText" required></b-form-input>
              <b-input-group-append>
                <b-button variant="info" @click="addInnerPic">新增圖片</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-list-group class="mb-5">
              <b-list-group-item v-for="pic in inputInnerPic" :key="pic.id">{{pic}}
                <b-button class="btn-danger float-right" @click="deletePicArray(pic)">刪除</b-button>
              </b-list-group-item>
            </b-list-group>
            <b-form-input class="mb-5" placeholder="請輸入內文" v-model="inputInnerText" required></b-form-input>
            <b-input-group prepend="標籤" class="mb-5">
              <b-form-input placeholder="請輸入標籤" v-model="inputHashTagText"></b-form-input>
              <b-input-group-append>
                <b-button variant="info" @click="addHashTag">新增</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-button @click="getHashTag" class="mb-5">取得既有標籤</b-button>
            <b-list-group v-if="allHashTag !== null" class="mb-3">
              <b-list-group-item v-for="item in allHashTag" :key="item.id">{{item}}
                <b-button class="btn-success float-right" @click="addAlreadyHashTag(item)">加入</b-button>
              </b-list-group-item>
            </b-list-group>
            <b-list-group v-if="inputHashTagArray !== null" class="mb-3">
              <b-list-group-item class="mb-2" v-for="(item) in inputHashTagArray" :key="item.id">#{{item}}
                <b-button class="btn-danger float-right" @click="deleteHashTagFromArray(item)">刪除</b-button>
              </b-list-group-item>
            </b-list-group>
            <b-button class="btn-outline-info" @click="newPost">送出</b-button>
          </b-form>
        </b-tab>
        <b-tab title="hashTag 測試">
          <b-input-group prepend="導覽列文字">
            <b-form-input v-model="inputNavBarText"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="editNavBarText">修改</b-button>
            </b-input-group-append>
          </b-input-group>
          <p class="mb-5">現在的 navBar 為 {{getNavBarText || ''}}</p>
          <b-input-group prepend="右側標題">
            <b-form-input v-model="inputRightTitleText"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="editTitleText">修改</b-button>
            </b-input-group-append>
          </b-input-group>
          <p class="mb-5">現在的 右側標題 為 {{getTitleText || ''}}</p>
          <b-input-group prepend="上面大圖">
            <b-form-input v-model="inputHeadPic"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="editHeadPic">修改</b-button>
            </b-input-group-append>
          </b-input-group>
          <p>現在的 頭頂大圖 為 {{getHeadPic || ''}}</p>
          <b-img class="mb-5" :src="getHeadPic" fluid v-if="getHeadPic !== ''"></b-img>
          <b-input-group prepend="自我介紹文字" class="mb-5">
            <b-form-textarea v-model="inputProfileText"
                             placeholder="請輸入您的寶貴意見。"
                             :rows="3"
                             :max-rows="6"
                             name="name">
            </b-form-textarea>
            <b-input-group-append>
              <b-button variant="info" @click="editProfileText">修改</b-button>
            </b-input-group-append>
          </b-input-group>
          <p class="mb-5">{{inputProfileText}}</p>
          <b-input-group prepend="自我介紹頭圖">
            <b-form-input v-model="inputProfilePic"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="editProfilePic">修改</b-button>
            </b-input-group-append>
          </b-input-group>
          <b-img fluid :src="getProfilePic"></b-img>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
  const storageRef = firebase.storage().ref('/images/')
  const databaseContent = firebase.database().ref().child('/content/')
  const databaseUI = firebase.database().ref().child('/UI/')

  function addZeroToTime(i) {
    if (i < 10) {
      return "0" + i
    } else {
      return i
    }
  }

  function getDay(i) {
    switch (i) {
      case 0:
        return 'Sun'
        break
      case 1:
        return 'Mon'
        break
      case 2:
        return 'Tue'
        break
      case 3:
        return 'Wed'
        break
      case 4:
        return 'Thu'
        break
      case 5:
        return 'Fri'
        break
      case 6:
        return 'Sat'
        break
    }
  }

  function getTime() {
    let time = new Date()
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = addZeroToTime(time.getDate())
    let day = getDay(time.getDay())
    let hour = addZeroToTime(time.getHours())
    let minutes = addZeroToTime(time.getMinutes())
    let second = addZeroToTime(time.getSeconds())
    return `${year}/${month}/${date} ${day}`
  }

  export default {
    name: "back",
    data() {
      return {
        inputAccount: '',
        inputPassword: '',
        logged: false,
        inputTitle: '',
        editTitle: '',
        inputInnerText: '',
        editInnerText: '',
        inputInnerPic: [],
        inputInnerPicText: '',
        editInnerPic: '',
        inputHashTagArray: [],
        editHashTagArray: [],
        inputHashTagText: '',
        editHashTagText: '',
        item: [],
        itemUI: [],
        allHashTag: [],
        inputNavBarText: '',
        inputRightTitleText: '',
        inputHeadPic: '',
        inputProfileText: '',
        inputProfilePic: '',
        UIBase: ''
      }
    },
    computed: {
      getNavBarText() {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].navBarText
      },
      getTitleText() {
        if (this.itemUI[this.UIBase] === undefined) {
          return 'none'
        }
        return this.itemUI[this.UIBase].titleText
      },
      getHeadPic() {
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
      }
    },
    methods: {
      login() {
        let vm = this
        firebase.auth().signInWithEmailAndPassword(this.inputAccount, this.inputPassword)
          .then(() => {
            vm.logged = true
            vm.getHashTag()
          })
          .catch(error => {
            let errorcode = error.code
            console.log(errorcode)
          })
      },
      addHashTag() {
        if (this.inputHashTagArray.indexOf(this.inputHashTagText.toLowerCase()) === -1) {
          this.inputHashTagArray.push(this.inputHashTagText.toLowerCase())
          this.inputHashTagText = ''
        } else {
          alert('這個 tag 重複囉')
          this.inputHashTagText = ''
        }
      },
      addAlreadyHashTag(item) {
        this.inputHashTagArray.push(item)
      },
      deleteHashTagFromArray(item) {
        this.inputHashTagArray.splice(this.inputHashTagArray.indexOf(item), 1)
      },
      addInnerPic() {
        if (this.inputInnerPic.indexOf(this.inputHashTagText) === -1) {
          this.inputInnerPic.push(this.inputInnerPicText)
          this.inputInnerPicText = ''
        } else {
          alert('這張圖用過囉')
          this.inputInnerPicText = ''
        }
      },
      deletePicArray(item) {
        this.inputInnerPic.splice(this.inputInnerPic.indexOf(item), 1)
      },
      newPost() {
        if (this.inputTitle !== '' && this.inputInnerPic !== '') {
          databaseContent.push({
            title: this.inputTitle,
            text: this.inputInnerText,
            pic: this.inputInnerPic,
            hashTag: this.inputHashTagArray,
            editing: false,
            pinned: false,
            time: getTime()
          })
        }
        this.inputTitle = ''
        this.inputInnerText = ''
        this.inputInnerPic = []
        this.inputInnerPicText = ''
        this.inputHashTagArray = []
        this.inputHashTagText = ''
      },
      deleteData(e) {
        databaseContent.child(e).remove()
      },
      editData(e) {
        let editing
        databaseContent.child(e).child('editing').once('value', (snap) => {
          editing = snap.val()
        })
        editing = !editing
        databaseContent.child(e).child('editing').set(editing)
        this.editTitle = this.item[e].title
        this.editInnerPic = this.item[e].pic
        this.editInnerText = this.item[e].text
        this.editHashTagArray = this.item[e].hashTag
      },
      saveEditedData(e) {
        databaseContent.child(e).update({
          title: this.editTitle,
          text: this.editInnerText,
          pic: this.editInnerPic,
          hashTag: this.editHashTagArray,
          editing: false
        })
      },
      getHashTag() {
        let vm = this
        for (let obj in vm.item) {
          if (vm.item.hasOwnProperty(obj)) {
            for (let hashTagItem of vm.item[obj].hashTag) {
              if (vm.allHashTag.indexOf(hashTagItem) === -1) {
                vm.allHashTag.push(hashTagItem)
              }
            }
          }
        }
      },
      editNavBarText() {
        let vm = this
        if (vm.inputNavBarText === '') {
          alert('不得為空')
          return
        }
        databaseUI.child(vm.UIBase).update({'navBarText': this.inputNavBarText})
      },
      editTitleText() {
        let vm = this
        if (vm.inputRightTitleText === '') {
          alert('不得為空')
          return
        }
        databaseUI.child(vm.UIBase).update({'titleText': this.inputRightTitleText})
      },
      editHeadPic() {
        let vm = this
        if (vm.inputHeadPic === '') {
          alert('不得為空')
          return
        }
        databaseUI.child(vm.UIBase).update({'headPic': this.inputHeadPic})
      },
      editProfileText() {
        let vm = this
        if (vm.inputProfileText === '') {
          alert('不得為空')
          return
        }
        databaseUI.child(vm.UIBase).update({'profileText': this.inputProfileText})
      },
      editProfilePic() {
        let vm = this
        if (vm.inputProfilePic === '') {
          alert('不得為空')
          return
        }
        databaseUI.child(vm.UIBase).update({'profilePic': this.inputProfilePic})
      }
    },
    created() {
      let vm = this
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          databaseContent.on('value', (snap) => {
            vm.item = snap.val()
          })
          databaseUI.on('value', (snap) => {
            snap.forEach((item) => {
              vm.UIBase = item.key
            })
            vm.itemUI = snap.val()
          })
          vm.inputProfileText = vm.itemUI[vm.UIBase].profileText
          vm.logged = true
          vm.getHashTag()
        } else {
          vm.logged = false
          // No user is signed in.
        }
      })
    }
  }
</script>

<style scoped>
  .form-signin {
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }

  .form-signin .form-signin-heading, .form-signin .checkbox {
    margin-bottom: 10px;
  }

  .form-signin .checkbox {
    font-weight: normal;
  }

  .form-signin .form-control {
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  .form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .account-wall {
    margin-top: 20px;
    padding: 40px 0px 20px 0px;
    background-color: #f7f7f7;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .login-title {
    font-size: 1.5rem;
    color: #555;
    margin-top: 100px;
    font-weight: 400;
    display: block;
    font-family: 'Noto Sans TC', 'Bungee Hairline', sans-serif;
  }

  .profile-img {
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
  }
</style>
