/* !
 *  tool公用类
 *  author: lingweifeng
 *  date: 2017-07-26 
 */
var Tool = (function(){
	"use strict";

	return {
		/**
		 * example: T.regExp.email.test( str )...
		 */
		regExp: {
            email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
            tel: /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/,
            nick: /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D](4,20)$/, // 英文下划线中文,4-20位
            // 密码6-16位，至少包含数字、字母（区分大小写）、符号中的2种，且不能有空格
            password: /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!;_\{\}<>\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"])|(?=.*?[A-Za-z])(?=.*?[!;_\{\}<>\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]))[\dA-Za-z!;_\{\}<>\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]+$/
        },
        /**
		 * description:字符串去空格的函数 
		 * @param: str 需要去空格的字符串
		 * @param:type 1-所有空格  2-前后空格  3-前空格 4-后空格
		 * return value:去掉空格的字符串
		 * example: T.trim( ' abckdfg ', 1 ) => 'abckdfg'
		 */
		trim: function(str,type){
		    switch (type){
		    	case 1: return str.replace(/\s+/g,"");
		    	case 2: return str.replace(/(^\s*)|(\s*$)/g, "");
		        case 3: return str.replace(/(^\s*)/g, "");
		        case 4: return str.replace(/(\s*$)/g, "");
		        default: return str;
		    }
		},
		/**
		 * description: 字母大小写转换
		 * @param: type1:首字母大写;2：首页母小写;3：大小写转换;4：全部大写;5：全部小写
	     * example: T.changeCase('asdasd',1) = > Asdasd
	     */
	    changeCase: function (str, type) {
	        function ToggleCase(str) {
	            var itemText = ""
	            str.split("").forEach(
	                function (item) {
	                    if (/^([a-z]+)/.test(item)) {
	                        itemText += item.toUpperCase();
	                    }
	                    else if (/^([A-Z]+)/.test(item)) {
	                        itemText += item.toLowerCase();
	                    }
	                    else{
	                        itemText += item;
	                    }
	                });
	            return itemText;
	        }

	        switch (type) {
	            case 1:
	                return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
	                    return v1.toUpperCase() + v2.toLowerCase();
	                });
	            case 2:
	                return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
	                    return v1.toLowerCase() + v2.toUpperCase();
	                });
	            case 3:
	                return ToggleCase(str);
	            case 4:
	                return str.toUpperCase();
	            case 5:
	                return str.toLowerCase();
	            default:
	                return str;
	        }
	    },
	    /**
		 * description: 检测密码强度
		 * @param: str:密码字符串
	     * example: T.checkPwd('12asdASAD') = > 3(强度等级为3)
	     */
	    checkPwd: function (str) {
	        var nowLv = 0;
	        if (str.length < 6) {
	            return nowLv
	        };
	        if (/[0-9]/.test(str)) {
	            nowLv++
	        };
	        if (/[a-z]/.test(str)) {
	            nowLv++
	        };
	        if (/[A-Z]/.test(str)) {
	            nowLv++
	        };
	        if (/[\.|-|_]/.test(str)) {
	            nowLv++
	        };
	        return nowLv;
	    },
	    /**
		 * description: 获取url参数后缀
		 * @param: name:参数名
	     * example: 'http://localhost:3000/assets/index.html?s=1234' -> T.getQueryString('s') = > 1234
	     */
		getQueryString: function(name) { 
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); 
			return null;
		},
		/**
		 * description: 设置cookie
		 * @param: name: cookie名
		 * @param: value: cookie值
		 * @param: days: 有效时间(天)
	     * example: T.setCookie( 'test', '1234', 1 )
	     */
	    setCookie: function(name, value, days) {
	        var oDate = new Date();
	        oDate.setDate(oDate.getDate() + days);
	        document.cookie = name + '=' + value + ';expires=' + oDate;
	    },
	    /**
		 * description: 获取cookie
		 * @param: name: cookie名
	     * example: T.getCookie( 'test' ) => 1234
	     */
	    getCookie: function (name) {
	        var arr = document.cookie.split(';');
	        for (var i = 0; i < arr.length; i++) {
	            var arr2 = arr[i].split('=');
	            if (arr2[0] == name) {
	                return arr2[1];
	            }
	        }
	        return '';
	    },
	    /**
		 * description: 删除cookie
		 * @param: name: cookie名
	     * example: T.delCookie( 'test' ) => 1234
	     */
	    delCookie: function (name) {
	        this.setCookie(name, 1, -1);
	    },
	    /**
		 * description: 通过ID获取DOM
		 * @param: id: 元素ID
	     * example: T.getElementById( 'test' )
	     */
	    getEleById: function(id) {
	        return !id ? null : document.getElementById( id );
	    },
	    /**
		 * description: 通过class获取元素集合
		 * @param: name: 元素class名
	     * example: T.getEleByClass( 'test' )
	     */
	    getElsByClass: function(name) {
	        var tags = document.getElementsByTagName('*') || document.all;
	        var els = [];
	        for (var i = 0; i < tags.length; i++) {
	        	var tag = tags[i];
	        	if (tag.className) {
	        		var cs = tag.className.split(' ');
	        		for (var j = 0; j < cs.length; j++) {
	        			if (name == cs[j]) {
	        				els.push(tag);
	        				break
	        			}
	        		}
	        	}
	        }
	        return els
	    },
	    /**
		 * description: 通过class获取元素集合
		 * @param: className: 元素class名
	     * example: T.getEleByClass( 'test' )
	     */
	    text: function(element) {
	    	if( !element ) return;
		    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
		},
	    /**
		 * description: 为dom对象添加事件
		 * @param: element: dom对象
		 * @param: event: 待处理的事件,不含“on”，比如“click”、“mouseover”、“keydown”等
		 * @param: handleFun: 处理函数
	     * example: T.addEvent( document.getElementById( 'test' ),'click', function(){ alert(12234); });
	     */
	    addEvent: function(element,event,handleFun){
	    	//addEventListener----应用于mozilla/chrome
	    	if(element.addEventListener){ 
	     		element.addEventListener(event,handleFun,false);
	     	}//attachEvent----应用于IE 
	     	else if(element.attachEvent){
	     		element.attachEvent("on"+event,handleFun);
	     	}//其他的选择dom0级事件处理程序
	     	else{
	     		//element.onclick===element["on"+event];
	     		element["on"+event] = handleFun;
	     	}
	    },
	    /**
		 * description: 为dom对象移除事件
		 * @param: element: dom对象
		 * @param: event: 待处理的事件,不含“on”，比如“click”、“mouseover”、“keydown”等
		 * @param: handleFun: 处理函数
	     * example: T.removeEvent( document.getElementById( 'test' ),'click', function(){ alert(12234); });
	     */
	    removeEvent: function(element,event,handleFun){
	     	//removeEventListener----应用于mozilla 
		    if (element.removeEventListener) { 
		      element.removeEventListener(event,handleFun,false); 
		    }//detachEvent----应用于IE 
		    else if (element.detachEvent) {
		      element.detachEvent("on"+event,handleFun); 
		    }//其他的选择dom0级事件处理程序 
		    else {
		      element["on"+event] = null;
		    }
		},
		/**
		 * description: 阻止事件冒泡
		 * @param: event: 事件
	     * example: T.stopPropagation( e );
	     */
		stopPropagation: function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;//IE阻止事件冒泡，true代表阻止
			}
		},
		/**
		 * description: 阻止事件默认行为
		 * @param: event: 事件
	     * example: T.preventDefault( e );
	     */
		preventDefault: function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;//IE阻止事件冒泡，false代表阻止
			}
		},
		/**
		 * description: 获得事件元素
		 * @param: event: 事件
	     * example: T.getElement( e );
	     */
		getEventElement: function(event){
			//event.target--非IE，event.srcElement--IE
			return event.target || event.srcElement;
		},
		/**
		 * description: 获得事件类型
		 * @param: event: 事件
	     * example: T.getType( e );
	     */
		getEventType: function(event){
			return event.type;
		},
		/**
		 * description: 判断鼠标滚轮滚动方向
		 * @return: 1：向上 -1：向下
	     * example: T.getWheelDirect( e );
	     * 注册事件：
	     	if(document.addEventListener){
	     		document.addEventListener('DOMMouseScroll',scrollFunc,false);
	     	}//W3C
	     	window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari
	     */
		getWheelDirect: function(event){
			var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
        	(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));            // firefox
        	if (delta > 0) {
        		// 向上滚
        		return 1;
        	} else if (delta < 0) {
        		// 向下滚
        		return -1;
        	}
        }

	}
})();

window.Tool = Tool;
window.T === undefined && (window.T = Tool);

/* !
 *  日期格式化：对Date的扩展，将Date转化为指定格式的String
 *  description: 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *  example1: (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 *  example2: (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/* !
 *  description: 对String的扩展，字符串转为date对象
 *  example: '2015-05-21'.toDate()
 */
String.prototype.toDate = function(){
    return new Date(Date.parse(this.replace(/-/g, "/")));
}
