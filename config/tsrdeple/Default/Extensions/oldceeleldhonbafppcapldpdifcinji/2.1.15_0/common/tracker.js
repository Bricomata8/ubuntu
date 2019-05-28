/*! (C) Copyright 2018 LanguageTooler GmbH. All rights reserved. */
class Tracker{static _constructor(){Tracker._isInitialized||(window.addEventListener("error",r=>{const e=r.message,t=r.filename,a=r.lineno,o=r.error;if(isFirefox()&&(!t||!t.startsWith(browser.runtime.getURL("/"))))return;if(navigator.userAgent.match(/Chrome\/6\d/)&&(!t||!t.startsWith(browser.runtime.getURL("/"))))return;if("string"!=typeof e)return;if(e.includes("ResizeObserver"))return;const n=o&&generateStackTrace(o);n?Tracker.trackError("js",e,n):Tracker.trackError("js",e,`${t}:${a}`)}),Tracker._isInitialized=!0)}static _getCustomVariables(){const r=Tracker.MANIFEST&&Tracker.MANIFEST.version?Tracker.MANIFEST.version:"unknown",e=Tracker._storageController.getSettings(),t=Tracker._storageController.getUIState();return{1:["version",String(r)],2:["autoCheck",String(e.autoCheck)],3:["account",String(e.havePremiumAccount)],4:["subscription",String(t.hasPaidSubscription)],5:["hiddenMatches",String(!0)],6:["lowerTextLimit",String(!0)],7:["prominentPremiumIcon",String(!0)]}}static _getTrackingUrlForPageView(r){return r=r.replace(/^(chrome|moz)-extension:\/\/.+?\//i,""),r=`${Tracker.TRACKING_BASE_PAGE_URL}${r}`,Promise.all([Tracker._storageController.getUniqueId(),Tracker._storageController.getStatistics()]).then(([e,t])=>{const a={idsite:Tracker.TRACKING_SITE_ID,_cvar:JSON.stringify(Tracker._getCustomVariables()),rec:"1",url:r,rand:Date.now(),apiv:"1",res:`${screen.width}x${screen.height}`,_id:e,_idts:t.firstVisit,_idvc:t.sessionCount};let o="";for(const r in a)a.hasOwnProperty(r)&&(o+=`${r}=${encodeURIComponent(a[r])}&`);return`${Tracker.TRACKING_BASE_URL}?${o}`})}static _getTrackingUrlForEvent(r,e,t="",a){return a=a||Tracker.TRACKING_BASE_PAGE_URL,Promise.all([Tracker._storageController.getUniqueId(),Tracker._storageController.getStatistics()]).then(([o,n])=>{const i={idsite:Tracker.TRACKING_SITE_ID,_cvar:JSON.stringify(this._getCustomVariables()),rec:"1",url:a,action_name:e,rand:Date.now(),apiv:"1",res:`${screen.width}x${screen.height}`,_id:o,_idts:n.firstVisit,_idvc:n.sessionCount,e_c:r,e_a:e,e_n:t};let s="";for(const r in i)i.hasOwnProperty(r)&&(s+=`${r}=${encodeURIComponent(i[r])}&`);return`${Tracker.TRACKING_BASE_URL}?${s}`})}static _sendRequest(r){if("1"!==navigator.doNotTrack){const e=new Image;e.referrerPolicy="no-referrer",e.src=r}}static trackPageView(r){r=r||getCurrentUrl(),Tracker._getTrackingUrlForPageView(r).then(e=>{Tracker.IS_PRODUCTION_MODE?Tracker._sendRequest(e):console.log("LT Page view tracking disabled in dev mode",{pageUrl:r,trackingUrl:e})}).catch(r=>{console.log("LT could not track because:",r&&r.message)})}static trackEvent(r,e,t,a){this._getTrackingUrlForEvent(r,e,t,a).then(a=>{Tracker.IS_PRODUCTION_MODE?this._sendRequest(a):console.log("LT Event tracking disabled in dev mode",{actionCategory:r,action:e,actionName:t,trackingUrl:a})}).catch(r=>{console.log("LT could not track because:",r&&r.message)})}static trackActivity(){const r=Date.now();if(r-Tracker._lastTrackedActivity>Tracker.ACTIVITY_TRACK_INTERVAL){Tracker._lastTrackedActivity=r;const e=this._storageController.getStatistics();this._storageController.updateStatistics({sessionCount:e.sessionCount+1}),Tracker.trackEvent("Action","ping",getPrimaryLanguageCode(navigator.language))}}static trackError(r,e,t=""){try{if(isUnsupportedChrome())return;if(Tracker._errorCount++,Tracker._errorCount>config.MAX_EXCEPTION_COUNT)return;if("string"!=typeof e)return;if(Tracker._loggedErrors)if(Tracker._loggedErrors.length<Tracker.THROTTLE_REQUESTS)Tracker._loggedErrors.push(Date.now());else{const r=Date.now();if(!(r-Tracker._loggedErrors[0]>=Tracker.MAX_TIME))return;Tracker._loggedErrors.push(r),Tracker._loggedErrors.splice(0,1)}else Tracker._loggedErrors=[Date.now()];let a="JS-Error";"message"===r?a="Message-Error":"http"===r&&(a="HTTP-Error");const o=getCurrentUrl();this.trackEvent(a,e,t||o,o)}catch(r){console.error("Error while logging error from language tool",r)}}static trackStat(r,e){0===Math.floor(10*Math.random())&&Tracker.trackEvent("Stat",r,e)}static trackTextLength(r){if(0===r)return;let e="";e=r<=100?"1-100":r<=1e3?"101-1000":r<=2500?"1001-2500":r<=5e3?"2501-5000":r<=7500?"5001-7500":r<=1e4?"7501-10000":r<=15e3?"10001-15000":r<=2e4?"15001-20000":r<=4e4?"20001-40000":">40000",this.trackStat("text_length",e)}}Tracker.TRACKING_BASE_URL="https://openthesaurus.stats.mysnip-hosting.de/piwik.php",Tracker.TRACKING_BASE_PAGE_URL="https://fake/",Tracker.TRACKING_SITE_ID="12",Tracker.ACTIVITY_TRACK_INTERVAL=432e5,Tracker.MAX_TIME=6e4,Tracker.THROTTLE_REQUESTS=10,Tracker.MANIFEST=browser.runtime.getManifest(),Tracker.IS_PRODUCTION_MODE=isFirefox()?!browser.runtime.id.match("temporary-addon"):"update_url"in Tracker.MANIFEST,Tracker._storageController=new StorageController,Tracker._lastTrackedActivity=0,Tracker._isInitialized=!1,Tracker._loggedErrors=null,Tracker._errorCount=0,Tracker._constructor();