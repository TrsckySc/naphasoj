(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{186:function(e,t,a){e.exports=a(397)},193:function(e,t,a){},397:function(e,t,a){"use strict";a.r(t);a(187);var n=a(3),l=a(0),c=a.n(l),r=a(9),i=a.n(r),o=(a(193),a(194),a(76)),m=(a(131),a(20)),u=a(75),s=a(39),d=(a(398),a(183)),p=(a(207),a(172)),E=(a(209),a(185)),f=(a(135),a(38)),h=(a(78),a(11)),g=(a(211),a(128)),y=(a(399),a(65)),v=a(77),b=a(408),k=a(401),x=a(402),O=a(403),w=a(404),j=a(405),I=a(406),S=a(407),z=a(100),F=a.n(z);function N(e){var t=y.a.useForm(),a=Object(v.a)(t,1)[0],n=Object(l.useState)(),r=Object(v.a)(n,2)[1];Object(l.useEffect)((function(){r({})}),[]);return c.a.createElement(y.a,{form:a,name:"horizontal_login",layout:"inline",onFinish:function(t){e.onSearch(t)}},c.a.createElement(y.a.Item,{name:"name"},c.a.createElement(g.a,{placeholder:"\u8bf7\u8f93\u5165\u63a5\u53e3\u540d\u79f0"})),c.a.createElement(y.a.Item,{name:"url"},c.a.createElement(g.a,{placeholder:"\u8bf7\u8f93\u5165\u63a5\u53e3\u5730\u5740"})),c.a.createElement(y.a.Item,{shouldUpdate:!0},(function(){return c.a.createElement(h.a,{type:"primary",htmlType:"submit"},"\u67e5 \u8be2")})))}function _(){return c.a.createElement("div",{className:"pt-20 pb-20 clearfix"},c.a.createElement("div",{style:{float:"left"}},c.a.createElement(h.a,{type:"primary",icon:c.a.createElement(b.a,null)},"\u65b0\u5efa\u63a5\u53e3"),c.a.createElement(h.a,{type:"dashed",icon:c.a.createElement(k.a,null),className:"ml-20"},"\u5bfc\u5165Swagger \u63a5\u53e3")),c.a.createElement("div",{style:{float:"right"}},c.a.createElement(h.a,{danger:!0,icon:c.a.createElement(x.a,null)},"\u6e05\u7a7a\u5f53\u524d\u6240\u6709\u63a5\u53e3")))}function H(e){var t=f.a.Option;function a(t,a){e.onHandleTableRow("changeMock",t,a.id)}var n=[{value:"open",label:"\u542f\u7528\u4e2d"},{value:"close",label:"\u505c\u7528\u4e2d"}],l=[{title:"\u5e8f\u53f7",width:70,align:"center",render:function(e,t,a){return"".concat(a+1)}},{title:"\u63a5\u53e3\u540d\u79f0",dataIndex:"name",key:"name"},{title:"\u63a5\u53e3\u7c7b\u578b",dataIndex:"method",key:"method",align:"center",render:function(e){return c.a.createElement(E.a,{color:"POST"===e?"green":"geekblue"},e.toUpperCase())}},{title:"\u63a5\u53e3\u524d\u7f00",dataIndex:"prefix",key:"prefix"},{title:"\u63a5\u53e3\u5730\u5740",dataIndex:"path",key:"path",render:function(e){return c.a.createElement(c.a.Fragment,null,c.a.createElement(O.a,{className:"pr-10"}),c.a.createElement("span",null,e))}},{title:"Mock\u542f\u7528\u72b6\u6001",dataIndex:"isOpen",key:"isOpen",width:150,align:"center",render:function(e,l,r){return c.a.createElement(f.a,{defaultValue:l.isOpen?"open":"close",style:{width:100,color:l.isOpen?"#52c41a":"#ff4d4f"},onChange:a},n.map((function(e){return c.a.createElement(t,{value:e.value,key:e.value,id:l._id},e.label)})))}},{title:"\u64cd\u4f5c",width:270,align:"center",render:function(e,t,a){return c.a.createElement(p.a,null,t.isLock?c.a.createElement(h.a,{type:"link",size:"small",icon:c.a.createElement(w.a,null)}):c.a.createElement(h.a,{type:"link",size:"small",icon:c.a.createElement(j.a,null)}),c.a.createElement(h.a,{size:"small",type:"primary",icon:c.a.createElement(I.a,null)},"\u67e5\u770b"),c.a.createElement(h.a,{size:"small",icon:c.a.createElement(S.a,null)},"\u7f16\u8f91"),c.a.createElement(h.a,{size:"small",danger:!0,icon:c.a.createElement(x.a,null)},"\u5220\u9664"))}}];return c.a.createElement(d.a,{columns:l,dataSource:e.dataSource,rowKey:function(e){return e._id}})}var L=[{path:"/",component:function(){var e=Object(l.useState)({}),t=Object(v.a)(e,2),a=t[0],n=t[1],r=function(e,t,a){var n={name:e,url:t,page:1,rows:20};console.log(n),F.a.post("/api/get-interface-list",n).then((function(e){e.data.success&&u(e.data.data.list)}))},i=Object(l.useState)([]),o=Object(v.a)(i,2),m=o[0],u=o[1];return Object(l.useEffect)((function(){r(a.name,a.url)}),[a]),c.a.createElement("div",null,c.a.createElement(N,{onSearch:function(e){n(e)}}),c.a.createElement(_,{initSearch:function(){r()}}),c.a.createElement(H,{dataSource:m,onHandleTableRow:function(e,t,a){console.log(e,t,a),"changeMock"===e?F.a.post("/api/change-interface-mock-status",{id:a,isOpen:"open"===t}).then((function(e){if(e.data.success){var n=m.map((function(e){return a===e._id?Object.assign(e,{isOpen:"open"===t}):e}));u(n)}})):"changeLock"===e&&F.a.post("/api/change-interface-lock-status",{id:a,isLock:t}).then((function(e){if(e.data.success){var n=m.map((function(e){return a===e._id?Object.assign(e,{isLock:t}):e}));u(n)}}))}}))},exact:!0,title:"\u63a5\u53e3\u5217\u8868"},{path:"/base-data",component:function(){return c.a.createElement("div",null,"BaseData")},title:"\u54cd\u5e94\u6570\u636e\u7ef4\u62a4"}];var T=Object(s.f)((function(e){for(var t="1",a=0;a<L.length;a++)L[a].path===e.history.location.pathname&&(t="".concat(a+1));return c.a.createElement(l.Fragment,null,c.a.createElement("div",{style:{float:"left",fontSize:"20px",marginRight:"20px",height:"64px"}},"SNAKE-API ",c.a.createElement("small",null,"mini")),c.a.createElement(m.a,{mode:"horizontal",defaultSelectedKeys:[t]},c.a.createElement(m.a.Item,{key:"1"},c.a.createElement(u.b,{to:"/"},"\u63a5\u53e3\u5217\u8868")),c.a.createElement(m.a.Item,{key:"2"},c.a.createElement(u.b,{to:"/base-data"},"\u54cd\u5e94\u6570\u636e\u7ef4\u62a4"))))})),A=(a(395),a(129));function B(e){return c.a.createElement("div",{style:{padding:"66px 20px 0 20px",minHeight:"calc(100vh - 42px)"}},c.a.createElement(A.a,{style:{padding:"10px 0"}},c.a.createElement(A.a.Item,null,"\u63a5\u53e3\u5217\u8868")),e.children)}var C=o.a.Header,K=o.a.Footer,M=o.a.Content;function R(e){return document.title=e.title,c.a.createElement(s.a,{exact:e.exact,path:e.path,render:function(t){return c.a.createElement(e.component,Object.assign({},t,{routes:e.routes}))}})}var J=function(){return c.a.createElement(u.a,null,c.a.createElement(o.a,null,c.a.createElement(C,{className:"header",style:{position:"fixed",zIndex:1,width:"100%",padding:"0 20px"}},c.a.createElement(T,null)),c.a.createElement(M,null,c.a.createElement(B,null,c.a.createElement(s.c,null,L.map((function(e,t){return c.a.createElement(R,Object.assign({key:e.path},e))}))))),c.a.createElement(K,{style:{textAlign:"center",padding:"10px"}},"\u6280\u672f\u652f\u6301\uff1aseebin | \u9489\u9489\u4ea4\u6d41\u7fa4:21958681")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var P=a(184);i.a.render(c.a.createElement(n.a,{locale:P.a},c.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[186,1,2]]]);
//# sourceMappingURL=main.4a7866f5.chunk.js.map