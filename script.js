// CONFIG: defina a URL do serviço de leads (ex.: Formspree, Getform, endpoint próprio) para ativar o envio real.
const FORM_ENDPOINT = "";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$("#y").textContent=new Date().getFullYear();
// Menu
const mb=$("#mb"),nl=$("#nl");
mb.onclick=()=>{const o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
$$(".nl a").forEach(a=>a.addEventListener("click",()=>{nl.classList.remove("open");mb.setAttribute("aria-expanded",false)}));
// Reveal + nav indicator
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.15});
$$(".rv").forEach(el=>io.observe(el));
const so=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)$$(".nl a:not(.btn)").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+x.target.id))}),{rootMargin:"-40% 0px -55% 0px"});
$$("main section[id]").forEach(s=>so.observe(s));
// Processo
const P=["Entendimento do negócio e identificação das necessidades.","Definição das prioridades e planejamento da solução.","Execução das ações e desenvolvimento do projeto.","Acompanhamento, análise e identificação de novas oportunidades."];
const tabs=$$("[role=tab]"),pn=$("#pn");
function sel(i){tabs.forEach((t,j)=>{t.setAttribute("aria-selected",i===j);t.tabIndex=i===j?0:-1});pn.textContent=P[i];pn.setAttribute("aria-labelledby","t"+i);tabs[i].focus()}
tabs.forEach((t,i)=>{t.onclick=()=>sel(i);t.onkeydown=e=>{if(e.key==="ArrowRight")sel((i+1)%4);if(e.key==="ArrowLeft")sel((i+3)%4)}});
pn.textContent=P[0];
// Serviço pré-selecionado
$$("[data-s]").forEach(a=>a.addEventListener("click",()=>{$("#sv").value=a.dataset.s}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nl.classList.contains("open")){nl.classList.remove("open");mb.setAttribute("aria-expanded",false);mb.focus()}});
// Formulário
const f=$("#f"),st=$("#st"),sb=$("#sb"),t0=Date.now(),fail=m=>{st.className="bad";st.textContent=m};
function chk(el){let m="";const ck=el.type==="checkbox",v=ck?(el.checked?"1":""):el.value.trim();
if(el.required&&!v)m=ck?"É necessário concordar para enviar.":"Campo obrigatório.";
else if(el.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m="Informe um e-mail válido.";
else if(el.type==="url"&&v&&!/^https?:\/\/[^\s.]+\.[^\s]+$/.test(v))m="Use um endereço completo (https://...).";
else if(el.name==="msg"&&v.length<20)m="Descreva com ao menos 20 caracteres.";
el.setAttribute("aria-invalid",!!m);el.closest("label").querySelector(".err").textContent=m;return !m}
const fields=[...f.querySelectorAll("input:not(.hp),select,textarea")];
fields.forEach(el=>el.addEventListener(el.type==="checkbox"?"change":"blur",()=>chk(el)));
f.addEventListener("submit",async e=>{e.preventDefault();st.className="";
const ok=fields.map(chk).every(Boolean);if(!ok){fields.find(x=>x.getAttribute("aria-invalid")==="true").focus();return}
if(f.website_hp.value)return; // spam bot (honeypot)
if(Date.now()-t0<3000){fail("Aguarde um instante e tente novamente.");return}
if(!FORM_ENDPOINT){fail("O envio ainda não está ativo: o serviço de recebimento de leads não foi configurado. Nenhum dado foi enviado.");return}
if(!navigator.onLine){fail("Sem conexão com a internet. Verifique e tente novamente.");return}
sb.disabled=true;sb.textContent="Enviando…";
const ac=new AbortController(),to=setTimeout(()=>ac.abort(),15000);
const data=Object.fromEntries(fields.map(x=>[x.name,x.type==="checkbox"?x.checked:x.value.trim()]));data.website_hp=f.website_hp.value;
try{const r=await fetch(FORM_ENDPOINT,{method:"POST",signal:ac.signal,headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)});
if(!r.ok)throw new Error(r.status);st.className="ok";st.textContent="Solicitação recebida. Entraremos em contato em breve.";f.reset()}
catch(err){fail(err.name==="AbortError"?"A conexão demorou demais. Tente novamente.":"Não foi possível enviar agora. Tente novamente em instantes.")}
finally{clearTimeout(to);sb.disabled=false;sb.textContent="Enviar solicitação"}});
