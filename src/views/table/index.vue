<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const json = '[{"id":"510000200005234495","title":"Mmh fppp ucrqjp vvspx mwj vxermqjtq idvutgumhw tnupd kpepilxn qunfrmu ssfnwif ekwruiq iqsvfftm wuxym ouvpxedyst knefxoyy oarqbphet mfxifm cagx.","status":"published","author":"name","display_time":"1976-10-23 01:29:18","pageviews":793},{"id":"130000197505227755","title":"Biibuwf fdsg vcxhcc ekinb cbmtk hlpwsps qvmdiyv nvbjwcpc qbynwhox frlvdgv xoaijvwts vgentto gkbkuvnu tskguaasc oyt odbe.","status":"published","author":"name","display_time":"1975-11-04 06:15:58","pageviews":3551},{"id":"45000020110308146X","title":"Cxlpdhzc qtaufx llkqst nlfqosb nyqhws fbduw gxtimy dsvdlqpp pfmshf hhpbrg.","status":"draft","author":"name","display_time":"1976-07-16 18:24:04","pageviews":760},{"id":"220000200210076482","title":"Wswco qfhffu cmvj qxiv lddylzdb hqbmsboqp fojqgih uvqzfc dftjilveo ytwcdxlb bxnn lfvf.","status":"draft","author":"name","display_time":"2000-07-28 10:25:35","pageviews":1106},{"id":"640000197507301111","title":"Wstu hahaiqkg jpifoqo bkmhpds gfjnk zyoyi rlxcb cpjddjk ktfz xqoqsj yotjulk ujiwc abithlxmte unhfhsp fovmq.","status":"draft","author":"name","display_time":"1978-03-23 17:51:31","pageviews":4540}]'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      setTimeout(() => {
        this.list = JSON.parse(json);
        this.listLoading = false
      }, 500);
    }
  }
}
</script>
