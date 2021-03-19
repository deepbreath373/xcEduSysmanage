<template>
  <div>
    <!--查询表单-->
    <el-form :model="params">
      <el-select v-model="params.siteId" clearable placeholder="请选择站点">
        <el-option
          v-for="item in siteList"
          :key="item.siteId"
          :label="item.siteName"
          :value="item.siteId">
        </el-option>
      </el-select>
      页面名称：
      <el-input v-model="params.pageName" style="width: 100px"></el-input>
      页面别名：
      <el-input v-model="params.pageAliase" style="width: 100px"></el-input>
      页面类型：
      <el-select v-model="params.pageType" clearable placeholder="请选择类型">
        <el-option
          v-for="item in Types"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" v-on:click="query" size="small">查询</el-button>
      <!--将当前页码和siteId传入add的url-->
      <router-link :to="{path:'/cms/page/add/',query:{
        page:this.params.page,
        siteId:this.params.siteId
      }}">
        <el-button type="primary" size="small">新增页面</el-button>
      </router-link>
    </el-form>

    <!--列表-->
    <el-table :data="list" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" width="120">
      </el-table-column>
      <el-table-column prop="pageAliase" label="别名" width="120">
      </el-table-column>
      <el-table-column prop="pageType" label="页面类型" width="150">
      </el-table-column>
      <el-table-column prop="pageWebPath" label="访问路径" width="250">
      </el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径" width="250">
      </el-table-column>
      <el-table-column prop="pageCreateTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <!--插槽获取当前行数据-->
        <template slot-scope="page">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-edit"
                       @click="edit(page.row.pageId)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="del(page.row.pageId)">删除
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button icon="el-icon-reading" type="info" size="mini"
                       @click="preview(page.row.pageId)">预览
            </el-button>
            <el-button icon="el-icon-upload" type="primary" size="mini"
                       @click="postPage(page.row.pageId)">发布
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="this.params.size"
                   :total="total" :current-page="this.params.page" style="float:right;">
    </el-pagination>
  </div>
</template>
<script>
import * as cmsApi from '../api/cms'

export default {
  data() {
    return {
      siteList: [],
      list: [],
      total: 0,
      params: {
        page: 1,
        size: 10,
        siteId: '',
        pageAliase: '',
        pageName: '',
        pageType: ''
      },
      Types: [{
        value: '0'
      }, {
        value: '1'
      }]
    }
  },
  methods: {
    query: function () {
      //调用服务端的接口
      cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
        //将res结果数据赋值给数据模型对象
        this.list = res.queryResult.list;
        this.total = res.queryResult.total;
      })
      cmsApi.site_list().then((res) => {
        this.siteList = res.queryResult.list;
      })
    },
    changePage: function (page) {//page形参代表当前页码
      this.params.page = page;
      this.query()
    },
    edit: function (pageId) {
      //打开修改页面
      this.$router.push({
        path: '/cms/page/edit/' + pageId
      })
    },
    del: function (pageId) {
      this.$confirm('您确定删除吗？', '提示', {}).then(() => {
        //调用服务端的接口
        cmsApi.page_del(pageId).then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.query()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    preview: function (pageId){
      //打开浏览器窗口
      window.open("http://www.xuecheng.com/cms/preview/"+pageId);
    },
    postPage: function (pageId){
      this.$confirm('确认发布该页面吗？','提示',{}).then(() => {
        cmsApi.page_postPage(pageId).then((res) => {
          if(res.success){
            console.log('发布页面id='+pageId);
            this.$message.success('发布成功，请稍后查看结果');
          }else{
            this.$message.error('发布失败');
          }
        });
      }).catch(() => {

      })
    }
  },
  created() {
    //取出路由中的参数，赋值给数据对象
    this.params.page = Number.parseInt(this.$route.query.page || 1);
    this.params.siteId = this.$route.query.siteId || '';
  },
  mounted() {
    this.query()
  }
}
</script>
<style>
</style>
