import{$ as r,a as d}from"./vendor.7c70a12f.js";const O=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerpolicy&&(c.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?c.credentials="include":n.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}};O();const b=r(".cell"),M=r("#restartButton"),$=r(".choice"),L=r(".x"),S=r(".o"),T=r("path");let l=!0;function v(){return l?"x":"o"}function p(){return l?"o":"x"}let u=!0,y=!1,o=[["","",""],["","",""],["","",""]];const A=()=>({[p()]:1,[v()]:-1,tie:0});function D(){d({targets:"#svg_1 line",x2:233,duration:300,easing:"easeOutQuad"})}function g(){let e=[];for(let t=0;t<3;t++)for(let s=0;s<3;s++)o[t][s]===""&&e.push({x:t,y:s});return e}function w(e,t){switch(r(`[data-id="${e}"]`).find(`.${t}`).css("display","block"),t){case"o":d({targets:`[data-id="${e}"] .x-arc`,strokeDashoffset:0,easing:"easeInOutQuad",duration:200});break;case"x":d({targets:`[data-id="${e}"] .x-line`,strokeDashoffset:0,easing:"easeOutQuad",duration:150,delay:d.stagger(100)});break}}function x(e,t,s){const i=f();if(i!==null)return A()[i];if(s){let n=-1/0;for(const{x:c,y:a}of g()){e[c][a]=p();const m=x(e,t+1,!1);e[c][a]="",n=Math.max(m,n)}return n}else{let n=1/0;for(const{x:c,y:a}of g()){e[c][a]=v();const m=x(e,t+1,!0);e[c][a]="",n=Math.min(m,n)}return n}}function C(){let e=-1/0,t;for(const{x:s,y:i}of g()){o[s][i]=p();const n=x(o,0,!1);o[s][i]="",n>e&&(e=n,t={x:s,y:i})}k(t.x,t.y,p()),setTimeout(()=>{u=!0,$.toggleClass("active")},500)}function k(e,t,s){o[e][t]=s,w(r(`[data-x="${e}"][data-y=${t}]`).data("id"),s),f()!==null&&setTimeout(()=>{N()},600)}function h(e,t,s){return e===t&&t===s&&e!==""}function f(){let e=null;for(let i=0;i<3;i++)h(o[0][i],o[1][i],o[2][i])&&(e=o[0][i]),h(o[i][0],o[i][1],o[i][2])&&(e=o[i][0]);const t=h(o[0][0],o[1][1],o[2][2]),s=h(o[0][2],o[1][1],o[2][0]);return(t||s)&&(e=o[1][1]),e===null&&g().length==0&&(e="tie"),e}function I(e=null){if(e!==null){const t=e.toUpperCase(),s=t=="X"?"O":"X";r(`#choice${t}`).addClass("active"),r(`#choice${s}`).removeClass("active")}else r("#choiceX, #choiceO").toggleClass("active")}function N(){alert(`winner: ${f()}`),u=!1}b.on("click",function(){y=!0,r("#playerChoice").addClass("disabled");const{x:e,y:t}=r(this).data();u&&f()===null&&o[e][t]===""&&(u=!1,k(e,t,v()),f()===null&&($.toggleClass("active"),setTimeout(()=>{C()},400)))});$.on("click",function(){l=r(this).data("play-as")=="x",!l&&!y&&(y=!0,r("#playerChoice").addClass("disabled"),C())});M.on("click",function(){l=!0,u=!0,y=!1,r("#playerChoice").removeClass("disabled"),I("x"),o=[["","",""],["","",""],["","",""]],L.css({display:"none"}),S.css({display:"none"}),r.each(T,function(){r(this).css({"stroke-dashoffset":r(this).data("stroke-dashoffset")})})});D();