/*! (C) Copyright 2018 LanguageTooler GmbH. All rights reserved. */
class TweaksManager{static _anonymizeEmail(e){return e.replace(TweaksManager.EMAIL_DOMAIN_REG_EXP,"@replaced.domain").trim()}static _removeEmail(e){return e.replace(TweaksManager.EMAIL_REG_EXP,"").trim()}static getTweaks(e){if(!e)return TweaksManager.DEFAULT_TWEAKS;let t=Object.assign({},TweaksManager.DEFAULT_TWEAKS);const a=getSubdomains(e);for(const e of a)t=Object.assign(t,TweaksManager.CUSTOM_TWEAKS[e]);return t}}TweaksManager.EMAIL_REG_EXP=/<?(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])>?/g,TweaksManager.EMAIL_DOMAIN_REG_EXP=/@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,TweaksManager.DEFAULT_TWEAKS={init(){document.documentElement.setAttribute("data-lt-installed","true")},supported:()=>!0,unsupportedMessage:()=>"",isElementCompatible(e){if(!(isInputArea(e)&&!e.readOnly))return!1;if(e.closest("quill-editor"))return!1;if(e.classList.contains("cke_editable"))return!0;if(e.ownerDocument.head&&isTinyMCE(e)){const t=document.createElement("script"),a="_isTinymceSpellcheckerActivated";return t.innerText=`\n                    try {\n                        if (window.parent.tinymce.get(document.body.dataset.id).plugins.tinymcespellchecker) {\n                            document.body.dataset.${a} = true;\n                        }\n                    } catch(e) {}\n                `,e.ownerDocument.head.appendChild(t),t.remove(),!Boolean(e.dataset[a])}return!!(window.innerHeight>=150&&window.innerWidth>=150)&&"false"!==e.getAttribute("spellcheck")},toolbarSettings(e){const t=[Dialog.CONTAINER_ELEMENT_NAME,ErrorCard.CONTAINER_ELEMENT_NAME].join(", ");return{isVisible(e,t){const a=!e.textContent.trim(),s=t.getPaddingBox(e);return!(a&&s.height<32)&&(s.width>=160&&s.height>=18)},getPosition(e,a,s,n){if(e===e.ownerDocument.body)return{fixed:!0,left:document.documentElement.clientWidth-a-6+"px"};const o=document.documentElement.clientHeight,i=getVisibleTopAndBottom(e,n,o,t),r=i.bottom-i.top;if(r<s)return null;const l=n.getPaddingBox(e);let c=l.top+i.bottom-6-s,d=l.right-6-a;if(r<=40){c=l.top+i.bottom-r/2-s/2}const g=l.height>=250,m=(document.documentElement.scrollTop||document.body.scrollTop)+o;if(g&&l.top+i.bottom>m&&l.top+s+12<m)return{fixed:!0,left:Math.round(d)+"px"};if(c>m)return null;const u=m-s-8;return c=Math.min(c,u),{fixed:!1,left:Math.round(d)+"px",top:Math.round(c)+"px"}}}},getParsingDetector(e){const t=!!location.href.match(/appsuite/),a=document.body&&document.body.dataset&&document.body.dataset.id&&document.body.dataset.id.includes("ZmHtmlEditor");let s=location.href.includes("/owa/")||!!document.querySelector(".owa-font-compose");try{s=s||window.parent.location.href.includes("/owa/")||!!window.parent.document.querySelector(".owa-font-compose")}catch(e){}let n=!1;try{n=!!window.parent.document.title.match(/roundcube/i)}catch(e){}let o=!1;try{o=window.parent.location.hostname.includes("mail.protonmail.com")}catch(e){}let i=!1;try{i=window.parent.location.href.includes("otrs")}catch(e){}return{isSignature:e=>t?"string"==typeof e.className&&e.className.includes("ox-signature"):a?!!(e.dataset&&e.dataset.marker&&e.dataset.marker.includes("_SIG_")):s?"signature"===e.id.toLowerCase():n?"_rc_sig"===e.id:!!o&&("string"==typeof e.className&&e.className.includes("protonmail_signature")),isQuote:e=>a?!!(e.dataset&&e.dataset.marker&&e.dataset.marker.includes("_QUOTED_")):s?"divRplyFwdMsg"===e.id||!!e.previousElementSibling&&"divRplyFwdMsg"===e.previousElementSibling.id:!!i&&"cite"===e.getAttribute("type")}},getRecipientInfo(e){try{const t="BODY"===e.tagName&&"tinymce"===e.id,a="TEXTAREA"===e.tagName&&"composebody"===e.id;if(t||a){const e=window.parent.document.getElementById("_from"),t=window.parent.document.getElementById("compose-subject"),a=window.parent.document.getElementById("_to");if(e&&t&&a){const e=TweaksManager._anonymizeEmail(a.value),t=TweaksManager._removeEmail(a.value);return Promise.resolve({address:e,fullName:t})}}}catch(e){}return Promise.resolve({address:"",fullName:""})},isClickIgnored:e=>!1,applyFix(e){const{error:t,replacementText:a,instance:s}=e;return s.inputAreaWrapper.replaceText(t.offset,t.length,a)}},TweaksManager.CUSTOM_TWEAKS={"1und1.de":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("signature"),isQuote:e=>"quote"===e.getAttribute("name")}),getRecipientInfo(e){try{const e=window.parent.document.querySelector(".objectivation_name[title]");if(e){const t=(e.getAttribute("title")||"").replace(/"/g,""),a=TweaksManager._anonymizeEmail(t),s=TweaksManager._removeEmail(t);return Promise.resolve({address:a,fullName:s})}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"atlassian.net":{isElementCompatible:e=>e.isContentEditable&&e.className.includes("ProseMirror")||TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),toolbarSettings:e=>({isVisible:(e,t)=>e.className.includes("ProseMirror")||TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).isVisible(e,t),getPosition:(e,t,a,s)=>TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)})},"canva.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"chrome.google.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("webstoreSiteNotSupported")},"deepl.com":{isElementCompatible:e=>TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)&&!e.className.includes("target_textarea"),applyFix(e){const t=TweaksManager.DEFAULT_TWEAKS.applyFix(e);return e.instance.inputAreaWrapper.simulateInput(e.replacementText),t}},"docs.google.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("googleDocsNotSupported","https://chrome.google.com/webstore/detail/languagetool/kjcoklfhicmkbfifghaecedbohbmofkm")},"e.mail.ru":{getRecipientInfo(e){try{const t="BODY"===e.tagName&&"tinymce"===e.id,a="TEXTAREA"===e.tagName&&e.classList.contains("composeEditor");if(t||a){const e=window.parent.document.getElementById("compose_to");if(e){const t=e.value.split(",")[0],a=TweaksManager._anonymizeEmail(t),s=TweaksManager._removeEmail(t);return Promise.resolve({address:a,fullName:s})}}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"facebook.com":{toolbarSettings:e=>({isVisible:(e,t)=>t.getPaddingBox(e).width>=120,getPosition:(e,t,a,s)=>TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)})},"grammarly.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"gmx.com":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("signature"),isQuote:e=>"quote"===e.getAttribute("name")}),getRecipientInfo:e=>TweaksManager.CUSTOM_TWEAKS["1und1.de"].getRecipientInfo(e)},"gmx.net":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("signature"),isQuote:e=>"quote"===e.getAttribute("name")}),getRecipientInfo:e=>TweaksManager.CUSTOM_TWEAKS["1und1.de"].getRecipientInfo(e)},"iblogbox.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"languagetool.org":{isElementCompatible:e=>!e.classList.contains("mceContentBody")&&TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)},"languagetoolplus.com":{init:()=>(document.addEventListener("lt-upgrade",()=>{Tracker.trackEvent("Action","upgrade"),new StorageController(e=>{e.checkForPaidSubscription(),e.updateUIState({hasPaidSubscriptionMaybe:!0})})}),document.addEventListener("lt-open-options",e=>{browser.runtime.sendMessage({command:"OPEN_OPTIONS"})}),TweaksManager.DEFAULT_TWEAKS.init()),isElementCompatible:e=>!e.classList.contains("mceContentBody")&&TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)},"linkedin.com":{toolbarSettings:e=>({isVisible:(e,t)=>TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).isVisible(e,t),getPosition(e,t,a,s){const n=e.nextElementSibling;if(isTextArea(e)&&n&&n.classList.contains("send-invite__count")){const o=parseInt(s.getStyle(n,"width")),i=parseInt(s.getStyle(n,"right")),r=s.getBorderBox(e);return{fixed:!1,left:Math.round(r.right-i-o-4-t)+"px",top:Math.round(r.bottom-4-a)+"px"}}return TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)}})},"mail.google.com":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("gmail_signature"),isQuote:e=>"string"==typeof e.className&&e.className.includes("gmail_quote")}),getRecipientInfo(e){try{if("DIV"===e.tagName){const e=document.querySelector("input[name=to]");if(e){const t=TweaksManager._anonymizeEmail(e.value),a=TweaksManager._removeEmail(e.value);return Promise.resolve({address:t,fullName:a})}}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"mail.rambler.ru":{getRecipientInfo(e){try{if("BODY"===e.tagName&&"tinymce"===e.id){const e=window.parent.document.querySelector("div[class*=Fields-receiverWrapper] div[class*=Fields-inputWrapper] span[class*=EmailBadge-root] span[class*=EmailBadge-text]");if(e){const t=TweaksManager._anonymizeEmail(e.textContent||""),a=TweaksManager._removeEmail(e.textContent||"");return Promise.resolve({address:t,fullName:a})}}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"mail.yandex.ru":{getRecipientInfo(e){try{if("DIV"===e.tagName&&e.classList.contains("cke_wysiwyg_div")&&e.classList.contains("cke_editable")){const e=document.querySelector("div[name=to] span[bubble][data-yabble-email]");if(e){const t=TweaksManager._anonymizeEmail(e.dataset.yabbleName||""),a=TweaksManager._removeEmail(e.dataset.yabbleName||"");return Promise.resolve({address:t,fullName:a})}}}catch(e){}return Promise.resolve({address:"",fullName:""})},isClickIgnored(e){const t=e.target;return!!t&&isTextArea(t)&&"editor1"===t.id}},"mail.yahoo.com":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("signature"),isQuote:e=>"string"==typeof e.className&&e.className.includes("yahoo_quoted")}),getRecipientInfo(e){try{const e=document.querySelector("[data-test-id='email-pill'] [data-test-id='pill']");if(e)return Promise.resolve({address:TweaksManager._anonymizeEmail(e.getAttribute("title")||""),fullName:e.innerText.trim()})}catch(e){}return Promise.resolve({address:"",fullName:""})}},"mailbox.org":{getRecipientInfo(e){try{const t="BODY"===e.tagName&&"tinymce"===e.id,a="TEXTAREA"===e.tagName&&e.parentElement&&e.parentElement.classList.contains("editor");if(t||a){const e=window.parent.document.querySelector(".tokenfield .token span.token-label");if(e){const t=e.textContent||"",a=TweaksManager._anonymizeEmail(t),s=TweaksManager._removeEmail(t);return Promise.resolve({address:a,fullName:s})}}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"my.smashdocs.net":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"onedrive.live.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("msOnlineOfficeNotSupported","https://appsource.microsoft.com/de-de/product/office/WA104381727")},"overleaf.com":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"outlook.live.com":{getParsingDetector:e=>({isSignature:e=>"signature"===e.id.toLowerCase(),isQuote:e=>"divRplyFwdMsg"===e.id||!!e.previousElementSibling&&"divRplyFwdMsg"===e.previousElementSibling.id}),getRecipientInfo(e){try{if("DIV"===e.tagName&&"textbox"===e.getAttribute("role")){const e=document.querySelector("[id^=subjectLine]"),t=document.querySelector(".ms-BasePicker-text [aria-label]");if(e&&t){const e=t.getAttribute("aria-label")||"",a=TweaksManager._anonymizeEmail(e),s=TweaksManager._removeEmail(e);return Promise.resolve({address:a,fullName:s})}}}catch(e){}return Promise.resolve({address:"",fullName:""})}},"paper.dropbox.com":{toolbarSettings:e=>({isVisible:(e,t)=>!(e.offsetHeight<30&&e.classList.contains("editor-blank"))&&TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).isVisible(e,t),getPosition:(e,t,a,s)=>TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)})},"reverso.net":{supported:()=>!1,unsupportedMessage:()=>browser.i18n.getMessage("siteCannotBeSupported")},"slack.com":{toolbarSettings:e=>!(e.parentElement&&"share-dialog-message-input"===e.parentElement.id)&&e.classList.contains("ql-editor")?{isVisible:e=>!0,getPosition(e,t,a,s){const n=Math.max(parseInt(s.getStyle(e,"padding-right"))+2,38),o=parseInt(s.getStyle(e,"line-height"))+parseInt(s.getStyle(e,"padding-top"))+parseInt(s.getStyle(e,"padding-bottom")),i=s.getBorderBox(e);return{fixed:!1,left:Math.round(i.right-n-t)+"px",top:Math.round(i.bottom-a+(a-o)/2)+"px"}}}:TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e)},"spanishdict.com":{isElementCompatible:e=>"query"!==e.id&&TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)},"twitter.com":{toolbarSettings:e=>({isVisible(e,t){if(e.classList.contains("twttr-directmessage-input"))return!1;if(e.classList.contains("tweet-box")&&"tweet-box-dm-conversation"!==e.id){const a=64;return t.getBorderBox(e).height>=a}return TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).isVisible(e,t)},getPosition(e,t,a,s){if("tweet-box-dm-conversation"===e.id){const n=TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s);if(!n)return null;const o=20,i=5;return{fixed:!1,left:parseInt(n.left)-o-i+"px",top:n.top}}if(e.classList.contains("tweet-box")){const n=10,o=4,i=20,r=20,l=s.getBorderBox(e);return{fixed:!1,left:Math.round(l.right-n-i-t)+"px",top:Math.round(l.bottom-o-a+(a-r)/2)+"px"}}return TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)}})},"vk.com":{toolbarSettings:e=>({isVisible(e,t){if("post_field"===e.id){const a=50;return t.getBorderBox(e).height>=a}return!e.classList.contains("page_status_input")&&TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).isVisible(e,t)},getPosition(e,t,a,s){const n=TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s);if(!n)return n;if(e.classList.contains("im_editable")||e.classList.contains("reply_field")){const t=parseInt(s.getStyle(e,"padding-right"));return Object.assign(n,{left:Math.round(parseInt(n.left)-t)+"px"})}return n}})},"upwork.com":{toolbarSettings:e=>({isVisible(e,t){const a=t.getBorderBox(e);return a.width>=160&&a.height>=34},getPosition(e,t,a,s){if(e.classList.contains("msg-composer-input")){const n=-112,o=-3,i=s.getBorderBox(e);return{fixed:!1,left:Math.round(i.right-n-t)+"px",top:Math.round(i.bottom-o-a)+"px"}}return TweaksManager.DEFAULT_TWEAKS.toolbarSettings(e).getPosition(e,t,a,s)}})},"web.de":{getParsingDetector:e=>({isSignature:e=>"string"==typeof e.className&&e.className.includes("signature"),isQuote:e=>"quote"===e.getAttribute("name")}),getRecipientInfo:e=>TweaksManager.CUSTOM_TWEAKS["1und1.de"].getRecipientInfo(e)}};