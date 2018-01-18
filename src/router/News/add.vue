<template>
  <div class="main_wrapper wrap_shoadow">
    <div>
      <el-button type="primary" @click="showPreview=true">{{i18n.g.preview}}</el-button>
    </div>
    <el-dialog :title="i18n.g.preview" v-model="showPreview">
      <div class="ql-container ql-snow" style="border: none;color: #333;">
        <h3 style="text-align: center;font-size: 1.7em;font-weight: bold;margin-bottom: 10px" id="title">{{form.title}}</h3>
        <div id="content" v-html="form.content" class="ql-editor">
        </div>
      </div>
    </el-dialog>
    <el-form :model="form" ref="form" :rules="rules" label-position="left" :label-width="labelWidth" class="form">
      <el-form-item :label="i18n.title" prop="title">
        <el-input v-model="form.title" class="form-input" @blur="trim('title')"></el-input>
      </el-form-item>
      <el-form-item :label="i18n.release_location" prop="location">
        <el-select v-model="form.location" class="form-input" :placeholder="i18n.toChoose">
          <el-option
            v-for="e in options"
            :key="e.value"
            :label="e.label"
            :value="e.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n.content" prop="content">
        <quill-editor ref="myTextEditor"
                      v-model="form.content"
                      :options="editorOption">
        </quill-editor>
        {{form.content.length}}
        <el-input v-model="form.content" v-show="false"></el-input>
      </el-form-item>
    </el-form>

    <div>
      <el-button type="primary" @click="addNews('1')">{{i18n.release}}</el-button>
      <el-button type="primary" @click="addNews('0')">{{i18n.g.save}}</el-button>
      <el-button @click="tableView()">{{i18n.cancel}}</el-button>
    </div>
  </div>
</template>

<script>
  import { addNews, newsDetail } from './request'
  import { sprintf } from 'src/utils/format'

  export default {
    data() {
      let i18n = this.i18n
      let _this = this
      return ({
        showPreview: false,
        labelWidth: '120px',
        form: {
          title: '',
          location: '',
          content: '',
        },
        rules: {
          title: [
            {required: true, message: i18n.title_required, trigger: 'blur'},
            {max: 30, message: sprintf(i18n.length_limit, 30), trigger: 'blur'},
          ],
          location: [
            {required: true, message: i18n.location_required, trigger: 'change'}
          ],
          content: [
            {required: true, message: i18n.content_required, trigger: 'change'},
            {max: 10000, message: sprintf(i18n.length_limit, 10000), trigger: 'change'},
            /*{pattern: /^[a-z0-9_-]{3,16}$/, message: '目前只支持中国大陆的手机号码', trigger: 'change'}*/
          ],
        },
        options: [{
          value: '1',
          label: i18n.FAQ
        }, {
          value: '2',
          label: i18n.system_info
        }, {
          value: '3',
          label: i18n.suggestion
        }],
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'direction': 'rtl'}],
              [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              [{'font': []}],
              [{'align': []}],
              ['clean'],
              ['image']
             /* ['link', 'image', 'video']*/
            ],
          }
        }
      })
    },
    methods: {
      addNews(status) {
        let _this = this
        let func = function () {
          let form = _this.form
          let params = {
            title: form.title,
            position: form.location,
            content: form.content,
            status: status,
            token: JSON.parse(window.localStorage.getItem('loginInfo')).token,
          }
          if (form.newsId) {
            params.newsId = form.newsId
          }
          addNews(params).then(() => {
            try{
              _this.tableView(true)
            }catch(e) { console.log(e) }
          })
        }

        this.$refs.form.validate((valid) => {
          if (valid) {
            func()
          }
        })
      },
      tableView(p) {
        let _this = this
        let func = function () {
          _this.$router.push({name: 'news'})
        }
        if (!p && this.form.newsId) {
          this.confirm('warning', this.i18n.g.is_sure_confirm, func)
        } else {
          func()
        }
      },
      newsDetail(id) {
        let params = {
          newsId: id,
          token: JSON.parse(window.localStorage.getItem('loginInfo')).token
        }
        newsDetail(params).then(data => {
          try{
            let form = this.form
            let result = data.result
            form.title = result.title
            form.location = result.position
            form.content = result.content
          }catch(e) { console.log(e) }
        })
      },
      trim(l) {
        this.form[l] = this.form[l].replace(/(^\s*)|(\s*$)/g, "")
      }
    },
    created () {
      let id = this.$route.params.id
      if (id) {
        this.form.newsId = id
        this.newsDetail(id)
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main_wrapper
    width 60%
    min-height 100%
    background #fff
    border-radius 8px
    margin 0 auto
  .form
    margin-top 12px
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .ql-container
    .ql-editor
      min-height 20em
      padding-bottom 1em
      /*max-height 25em*/
</style>
