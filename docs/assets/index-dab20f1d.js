(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();const $=document.getElementById("categories"),E=document.getElementById("full-list"),l=document.getElementById("category-input"),S=document.getElementById("start-time-input"),w=document.getElementById("add-category"),I=document.getElementById("remove-category"),L=document.getElementById("add-task"),k=document.getElementById("export-json"),v=document.getElementById("export-csv"),O=document.getElementById("delete-all"),T=["Socializing","Taking Classes","Studying","Transporting","Eating","Errands","YouTube","Other Distraction"];let s=T,a=[];function y(){localStorage.setItem("categories",JSON.stringify(s)),$&&s.forEach(o=>{const e=document.createElement("option");e.innerHTML=o,$.appendChild(e)})}function p(){if(!a||(localStorage.setItem("tasks",JSON.stringify(a)),!E))return;E.innerHTML="";const o=new Date,e=o.getDate(),r=o.getMonth()+1,i=o.getFullYear();a.filter(t=>t[0].year===i&&t[0].month===r&&t[0].day===e).sort((t,n)=>t[0].hour!==n[0].hour?t[0].hour-n[0].hour:t[0].minute-n[0].minute).forEach(t=>{const n=document.createElement("tr"),c=t[0].hour.toString().padStart(2,"0"),h=t[0].minute.toString().padStart(2,"0"),g=t[1];n.innerHTML=`<td class="border-2">${c}:${h}</td><td class="border-2">${g}</td>`;const d=document.createElement("button");d.classList.add("w-8","h-8","bg-rose-700","text-white","font-bold","rounded"),d.textContent="-",d.addEventListener("click",D=>{if(D.preventDefault(),!confirm("Do you really want to remove this task?"))return;const u=[{year:i,month:r,day:e,hour:t[0].hour,minute:t[0].minute},g],m=a.map(f=>{for(let b of Object.keys(f[0]))if(f[0][b]!==u[0][b])return!1;return f[1]===u[1]}).indexOf(!0);a.splice(m,1),p()}),n.appendChild(d),E.appendChild(n)})}window==null||window.addEventListener("load",()=>{localStorage.getItem("categories")!==null&&(s=JSON.parse(localStorage.getItem("categories"))),localStorage.getItem("tasks")!==null&&(a=JSON.parse(localStorage.getItem("tasks"))),y(),p()});w==null||w.addEventListener("click",o=>{if(o.preventDefault(),!l){console.warn("Element with id `category-input` not found!");return}const e=l.value.trim();s.indexOf(e)===-1&&confirm(`Do you really want to add "${e}" to the categories?`)&&(s.push(e),y())});I==null||I.addEventListener("click",o=>{if(o.preventDefault(),!l){console.warn("Element with id `category-input` not found!");return}const e=l.value.trim(),r=s.indexOf(e);r!==-1&&confirm(`Do you really want to remove "${e}" from the categories?`)&&(s.splice(r,1),y())});L==null||L.addEventListener("click",o=>{o.preventDefault();const e=l==null?void 0:l.value.trim();if(s.indexOf(e)===-1){alert(`"${e}" is not a valid category. Add it before you use it.`);return}const r=S==null?void 0:S.value.trim();if(r.length===0){alert("Input the start time before adding the task.");return}const i=new Date,[t,n]=r.split(":"),c=+t,h=+n,g=i.getDate(),d=i.getMonth()+1,u=[{year:i.getFullYear(),month:d,day:g,hour:c,minute:h},e];a.every(m=>{for(let f of Object.keys(m[0]))if(m[0][f]!==u[0][f])return!0;return m[1]!==u[1]})&&a.push(u),p()});k==null||k.addEventListener("click",o=>{o.preventDefault();const e=JSON.stringify(a);confirm("Copy the output to the clipboard?")&&(console.log(e),navigator.clipboard.writeText(e))});v==null||v.addEventListener("click",o=>{o.preventDefault();let e=`Start Time,Category
`;a.forEach(r=>{const i=`${r[0].year.toString().padStart(4,"0")}-${r[0].month.toString().padStart(2,"0")}-${r[0].day.toString().padStart(2,"0")} ${r[0].hour.toString().padStart(2,"0")}:${r[0].minute.toString().padStart(2,"0")}:00,${r[1]}`;e+=i+`
`}),confirm("Copy the output to the clipboard?")&&(console.log(e),navigator.clipboard.writeText(e))});O==null||O.addEventListener("click",o=>{o.preventDefault(),confirm("Are you sure you want to delete ALL store tasks and categories?")&&(localStorage.removeItem("categories"),localStorage.removeItem("tasks"),s=T,a=[],y(),p())});
