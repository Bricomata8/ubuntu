/*! (C) Copyright 2018 LanguageTooler GmbH. All rights reserved. */
function StorageController(t=(()=>{})){this._storage=this._getStorage(),this._eventBus=new EventBus,this._settings=null,this._privacySettings=null,this._statistics=null,this._uiState=null,this._testFlags=null,this._ready=!1,this._onReadyCallbacks=[t],this._loadData(),this._onStoredDataChanged=this._onStoredDataChanged.bind(this),browser.storage.onChanged.addListener(this._onStoredDataChanged)}StorageController.eventNames={settingsChanged:"lt-storageController.settingsChanged",privacySettingsChanged:"lt-storageController.privacySettingsChanged",uiStateChanged:"lt-storageController.uiStateChanged"},StorageController.DEFAULT_SETTINGS={apiServerUrl:config.MAIN_SERVER_URL,otherServerUrl:"",autoCheck:!0,havePremiumAccount:!1,knownEmail:"",username:"",password:"",motherTongue:"",geoIpLanguages:[],enVariant:getPreferredVariantFromBrowserLanguage(["en-US","en-GB","en-AU","en-CA","en-NZ","en-ZA"])||"en-US",deVariant:getPreferredVariantFromBrowserLanguage(["de-DE","de-AT","de-CH"])||"de-DE",ptVariant:getPreferredVariantFromBrowserLanguage(["pt-PT","pt-BR"])||"pt-PT",caVariant:"ca-ES",dictionary:[],ignoredRules:[{id:"PUNCTUATION_PARAGRAPH_END",language:"*",description:"No punctuation mark at the end of paragraph"},{id:"FINAL_PUNCTUATION",language:"pt",description:"Pontuagão final em falta"},{id:"FINAL_STOPS",language:"pt",description:"Pontuação: pontuação final em falta"},{id:"EN_QUOTES",language:"en",description:"Smart quotes (“”)"},{id:"DASH_RULE",language:"en",description:"Hyphen, n-dash and m-dash"},{id:"TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN",language:"de",description:"Typografische Anführungszeichen und Prime"},{id:"FALSCHE_VERWENDUNG_DES_BINDESTRICHS",language:"de",description:"Mögliche falsche Verwendung des Bindestrichs"},{id:"BISSTRICH",language:"de",description:"Bis-Strich vs. Bindestrich"},{id:"AUSLASSUNGSPUNKTE",language:"de",description:"Auslassungspunkte "},{id:"ABKUERZUNG_LEERZEICHEN",language:"de",description:'Geschütztes Leerzeichen bei Abkürzungen wie "z. B."'}],disabledDomains:[],disabledDomainsCapitalization:[],ignoreCheckOnDomains:[],autoCheckOnDomains:[]},StorageController.DEFAULT_PRIVACY_SETTINGS={allowRemoteCheck:!1},StorageController.DEFAULT_STATISTICS={usageCount:0,sessionCount:0,appliedSuggestions:0,firstVisit:null,ratingValue:null},StorageController.DEFAULT_UI_STATE={hasSeenPrivacyConfirmationDialog:!1,hasPaidSubscription:!1,hasRated:!1,hasUsedValidator:!1,hasPaidSubscriptionMaybe:!1},StorageController.DEFAULT_TEST_FLAGS={},StorageController.prototype=function(){function t(t,e){const i=Object.assign({},t);for(const t in i)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function e(t){return("0"+t.toString(16)).substr(-2)}function i(t){let e=0;for(let i=0;i<t.length;i++){const s=t.charCodeAt(i);e+=s<128?1:s<2048?2:s<65536?3:s<1<<21?4:s<1<<26?5:s<1<<31?6:Number.NaN}return e}function s(t){return t.toLowerCase().trim().replace(/^www\./,"")}function n(t,e){const i=s(e);return(t||[]).some(t=>{const e=s(t);return e===i||i.endsWith("."+e)})}return{_getStorage:()=>browser.storage.sync&&!isFirefox()?browser.storage.sync:browser.storage.local,_splitInChunks(t,e,s=this._storage.QUOTA_BYTES_PER_ITEM){let n=t[e],a=0,r=[],o=i(e)+i("[]");for(;n.length;){const l=n.shift(),d=i(`,"${l}"`);if(o+d>s){t[0===a?e:`${e}_${a}`]=r,a++,r=[l],o=i(`${e}_${s}`)+i(`["${l}"]`)}else r.push(l),o+=d;if(0===n.length){t[0===a?e:`${e}_${a}`]=r}}t[`${e}_${a+1}`]=[]},_joinChunks(t,e,i=this._storage.MAX_ITEMS){let s=t[e]||[];for(let n=1;n<i;n++){const i=t[`${e}_${n}`];if(void 0===i||0===i.length)break;s=s.concat(i)}return s},_loadData(){return this._storage.get(null).then(e=>{const i=t(StorageController.DEFAULT_SETTINGS,e);i.dictionary=this._joinChunks(e,"dictionary");for(const t of i.ignoredRules)if(void 0===t.description){const e=StorageController.DEFAULT_SETTINGS.ignoredRules.find(e=>e.id===t.id&&e.language===t.language);t.description=e?e.description:""}this._settings=i,this._privacySettings=t(StorageController.DEFAULT_PRIVACY_SETTINGS,e),this._statistics=t(StorageController.DEFAULT_STATISTICS,e),this._uiState=t(StorageController.DEFAULT_UI_STATE,e),this._testFlags=t(StorageController.DEFAULT_TEST_FLAGS,e),this.uniqueId=e.uniqueId,e.uniqueId&&16===e.uniqueId.length||(this.uniqueId=this.generateUniqueId(),this._storage.set({uniqueId:this.uniqueId})),this._statistics.firstVisit||this.updateStatistics({firstVisit:Math.round(Date.now()/1e3)}),this._ready=!0,this._onReadyCallbacks.forEach(t=>t()),this._onReadyCallbacks=[]})},_onStoredDataChanged(t){let e=!1,i=!1,s=!1,n=!1;for(const a in t)/^dictionary(_\d+)?$/.test(a)&&(i=!0),null!==this._settings&&StorageController.DEFAULT_SETTINGS.hasOwnProperty(a)&&"dictionary"!==a&&(this._settings[a]=t[a].newValue,e=!0),null!==this._privacySettings&&StorageController.DEFAULT_PRIVACY_SETTINGS.hasOwnProperty(a)&&(this._privacySettings[a]=t[a].newValue,s=!0),null!==this._statistics&&StorageController.DEFAULT_STATISTICS.hasOwnProperty(a)&&(this._statistics[a]=t[a].newValue),null!==this._uiState&&StorageController.DEFAULT_UI_STATE.hasOwnProperty(a)&&(this._uiState[a]=t[a].newValue,n=!0),null!==this._testFlags&&StorageController.DEFAULT_TEST_FLAGS.hasOwnProperty(a)&&(this._testFlags[a]=t[a].newValue),"uniqueId"===a&&(this.uniqueId=t[a].newValue);e&&this._eventBus.fire(StorageController.eventNames.settingsChanged,t),i&&this._storage.get(null).then(t=>{const e=this._joinChunks(t,"dictionary"),i={dictionary:{oldValue:this._settings.dictionary,newValue:e}};this._settings.dictionary=e,this._eventBus.fire(StorageController.eventNames.settingsChanged,i)}),s&&this._eventBus.fire(StorageController.eventNames.privacySettingsChanged,t),n&&this._eventBus.fire(StorageController.eventNames.uiStateChanged,t)},onReady(t){this._ready?t():this._onReadyCallbacks.push(t)},addEventListener(t,e){this._eventBus.subscribe(t,e)},removeEventListener(t,e){this._eventBus.unsubscribe(t,e)},generateUniqueId(){const t=new Uint8Array(8);return window.crypto.getRandomValues(t),Array.from(t,e).join("")},getUniqueId(){return new Promise(t=>{this.onReady(()=>t(this.uniqueId))})},getSettings(){return Object.assign({},this._settings)},updateSettings(t){for(const e in t)if(!StorageController.DEFAULT_SETTINGS.hasOwnProperty(e))throw new Error(`Unknown setting ${e}`);return void 0===t.dictionary||isFirefox()||this._splitInChunks(t,"dictionary"),Object.assign(this._settings||{},t),this._storage.set(t)},getDomainState(t){if(!this._settings)return!1;if(t===browser.runtime.id)return{isDisabled:!1,isAutoCheckEnabled:!0,shouldCapitalizationBeChecked:!0};const e=n(this._settings.disabledDomains,t),i=!n(this._settings.disabledDomainsCapitalization,t);if(this._settings.autoCheck){return{isAutoCheckEnabled:!n(this._settings.ignoreCheckOnDomains,t),isDisabled:e,shouldCapitalizationBeChecked:i}}return{isAutoCheckEnabled:n(this._settings.autoCheckOnDomains,t),isDisabled:e,shouldCapitalizationBeChecked:i}},disableDomain(t){const e=s(t),i=this.getSettings(),n="object"==typeof i.disabledDomains?i.disabledDomains:[];n.push(e),this.updateSettings({disabledDomains:n})},enableDomain(t){const e=s(t),i=this.getSettings();let n="object"==typeof i.disabledDomains?i.disabledDomains:[];n=n.filter(t=>{const i=s(t);return i!==e&&!e.endsWith("."+i)}),this.updateSettings({disabledDomains:n})},disableCapitalization(t){const e=s(t),i=this.getSettings(),n="object"==typeof i.disabledDomainsCapitalization?i.disabledDomainsCapitalization:[];n.push(e),this.updateSettings({disabledDomainsCapitalization:n})},enableCapitalization(t){const e=s(t),i=this.getSettings();let n="object"==typeof i.disabledDomainsCapitalization?i.disabledDomainsCapitalization:[];n=n.filter(t=>{const i=s(t);return i!==e&&!e.endsWith("."+i)}),this.updateSettings({disabledDomainsCapitalization:n})},isUsedCustomServer(){return this._settings.apiServerUrl!==StorageController.DEFAULT_SETTINGS.apiServerUrl},getPrivacySettings(){return Object.assign({},this._privacySettings)},updatePrivacySettings(t){for(const e in t)if(!StorageController.DEFAULT_PRIVACY_SETTINGS.hasOwnProperty(e))throw new Error(`Unknown privacy setting ${e}`);return Object.assign(this._privacySettings||{},t),this._storage.set(t)},getStatistics(){return Object.assign({},this._statistics)},updateStatistics(t){for(const e in t)if(!StorageController.DEFAULT_STATISTICS.hasOwnProperty(e))throw new Error(`Unknown privacy setting ${e}`);return Object.assign(this._statistics||{},t),this._storage.set(t)},getUIState(){return Object.assign({},this._uiState)},updateUIState(t){for(const e in t)if(!StorageController.DEFAULT_UI_STATE.hasOwnProperty(e))throw new Error(`Unknown ui state ${e}`);return Object.assign(this._uiState||{},t),this._storage.set(t)},getTestFlags(){return Object.assign({},this._testFlags)},updateTestFlags(t){for(const e in t)if(!StorageController.DEFAULT_TEST_FLAGS.hasOwnProperty(e))throw new Error(`Unknown test flag ${e}`);return Object.assign(this._testFlags||{},t),this._storage.set(t)},checkForPaidSubscription(){return new Promise((t,e)=>{this.onReady(()=>{const{havePremiumAccount:i,username:s,password:n,apiServerUrl:a}=this.getSettings();if(this.isUsedCustomServer())return this.disablePaidSubscription(),void t(!1);if(!i&&a===config.MAIN_SERVER_URL)return this.disablePaidSubscription(),void t(!1);let r;const o=`${r=i?config.PREMIUM_SERVER_URL:a||config.MAIN_SERVER_URL}/check`,l=new URLSearchParams;l.append("language","en"),l.append("data",JSON.stringify({text:"languagetool testrule 8634756"})),s&&n&&(l.append("username",s),l.append("password",n)),fetch(o,{method:"post",mode:"cors",body:l}).then(t=>t.json()).then(e=>{const i=e.matches.some(t=>"PREMIUM_FAKE_RULE"===t.rule.id);i?this.enablePaidSubscription():this.disablePaidSubscription(),t(i)}).catch(e)})})},disablePaidSubscription(){this._uiState.hasPaidSubscription&&this.updateUIState({hasPaidSubscription:!1})},enablePaidSubscription(){this._uiState.hasPaidSubscription||this.updateUIState({hasPaidSubscription:!0})},destroy(){this._eventBus.destroy(),this._onReadyCallbacks=[];try{browser.storage.onChanged.removeListener(this._onStoredDataChanged)}catch(t){}}}}();