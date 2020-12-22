// 设置cookie
const setCookie = (name, val, day) => {
  const days = day;
  const exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  if (name === 'sessionId') {
    name += `_${process.env.VUE_APP_appid}`
  }
  document.cookie = name + '=' + escape(val) + ';expires=' + exp.toGMTString() + ';path=/;domain=.kuwo-inc.com';
}
// 获取cookie
const getCookie = (cookie_name) => {
  if (cookie_name === 'sessionId') {
    cookie_name += `_${process.env.VUE_APP_appid}`
  }
  const allcookies = document.cookie;
  let cookie_pos = allcookies.indexOf(cookie_name + '=');
  if (cookie_pos != -1) {
    cookie_pos = cookie_pos + cookie_name.length + 1;
    let cookie_end = allcookies.indexOf(";", cookie_pos);
    if (cookie_end == -1) {
      cookie_end = allcookies.length;
    }
    return unescape(allcookies.substring(cookie_pos, cookie_end));
  }
  return null;
}
// 删除cookie
const delCookie = (cookie_name) => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const val = getCookie(cookie_name);
  if (val != null) {
    document.cookie = cookie_name + '=' + val + ';expires=' + exp.toGMTString() + ';path=/;domain=.kuwo.cn'
  }
};

/**
 * 获取url 参数
 * @param name
 * @returns {*}
 */
const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

const toTop = () => {
  const oDom = document.getElementsByClassName('el-main')[0];
  oDom.scrollTop = 0;
}

// 下载
const downloadFile = async function (api, params, name) {
  const res = await this.$get(api, params, { responseType: 'blob'});
  try {
    let url = window.URL.createObjectURL(new Blob([res]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url

    const time = new Date();
    let year = time.getFullYear() + '';
    let month = time.getMonth() + 1 + '';
    let date = time.getDate() + '';
    let hour = time.getHours() + '';
    let min = time.getMinutes() + '';
    let str = year + '-' + month + '-' + date + ' ' + hour + '：' + min;
    
    link.setAttribute('download', `${name || str}.xlsx`)
    document.body.appendChild(link);
    link.click() //执行下载
    window.URL.revokeObjectURL(link.href) //释放url
    document.body.removeChild(link) //释放标签
  } catch (e) {
    this.$notify.error({
      title: '错误',
      message: '下载文件失败'
    });
  }
}


/**
 * 生成水印
 * @param str
 */
const watermark = (str) => {
  (function createCanvas(){
    const bodyContainer = document.body;
    const width = 120;
    const height = 120;
    // var x =10;
    // var y =10;
    const rotate=30;
    const fontSize =16;
    const alpha = 0.05;//透明度
    const color='#';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    const ctx = canvas.getContext("2d");

    ctx.textAlign = 'top';//在绘制文本时使用的当前文本基线
    ctx.textBaseline = 'left';//设置或返回文本内容的当前对齐方式
    ctx.font = `${fontSize}px Arial`//ctx.font = '24px Arial';
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;//设置或返回绘图的当前 alpha 或透明值
    ctx.rotate(Math.PI / 180 * rotate);//将画布旋转30度
    ctx.fillText(str, parseFloat(width) / 2, parseFloat(height) / 2);//从cookie里获取userName
    const base64Url = canvas.toDataURL();

    const wm = document.getElementById('waterMark');

    const watermarkDiv = wm || document.createElement("div");
    const styleStr = `
         position:fixed;
         top:0;
         left:0;
         bottom:0;
         right:0;
         z-index:${9999};
         pointer-events:none;
         background-repeat:repeat;
         background-image:url('${base64Url}')`;

    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.id ='waterMark'

    if (!wm) {
      bodyContainer.appendChild(watermarkDiv)
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;//检测浏览器是否支持该特性
    if (MutationObserver) {
      var observer = new MutationObserver(function () {
        var wm = document.getElementById('waterMark');
        // 只在wm元素样式被修改或者元素被移除时
        if ((wm && wm.getAttribute('style') !== styleStr) || !wm) {
          // 避免一直触发
          observer.disconnect();
          observer = null;
          createCanvas()
        }
      });

      observer.observe(bodyContainer, { //监听body元素子元素的变化
        attributes: true,
        subtree: true,
        childList: true
      })
    }

    var styleEl =  document.createElement('style');
    styleEl.setAttribute('type','text/css');
    styleEl.innerText ='@media  print{ #waterMark{ display:none } }';
    document.head.appendChild(styleEl)
  })();
}

// 1211211 -> 2020-12-16
function formateDate (time) {
  let returnValue = '';
  if (time) {
    const ttime = new Date(time);
    let year = ttime.getFullYear();
    let month = ttime.getMonth() + 1;
    let date = ttime.getDate();
    returnValue = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
  }
  return returnValue;
}

// 1211211 -> 00:04:21
function formatTime (value) {
  let seconds = parseInt((value % (1000 * 60)) / 1000)  // 秒数
  let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60))  // 分钟数
  let hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))   // 小时数
  let time = [hours, minutes, seconds]
  // 补 0
  time.forEach((el,index) => {
    if(el < 10) {
      time[index] = '0' + el
    }
  })
  return time.join(':')
}

export {
  setCookie,
  getCookie,
  delCookie,
  getQueryString,
  toTop,
  downloadFile,
  watermark,
  formateDate,
  formatTime
}
