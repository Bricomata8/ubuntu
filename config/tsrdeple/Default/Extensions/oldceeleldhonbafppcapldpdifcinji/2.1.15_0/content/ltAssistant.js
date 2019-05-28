/*! (C) Copyright 2018 LanguageTooler GmbH. All rights reserved. */
function LTAssistant(e){if(isUnsupportedChrome()||isUnsupportedFirefox()||!document.documentElement)return;this._options=e||{},this._instances=[],this._otherSpellCheckers=new Map,this._behaviorTweaks=TweaksManager.getTweaks(getCurrentHostname()),this._behaviorTweaks.init();const t=this._behaviorTweaks.supported(),n=this._behaviorTweaks.unsupportedMessage();if(this._onMessage=bindAndCatch(this._onMessage,this),!t)return browser.runtime.sendMessage({command:"PAGE_LOADED",enabled:!0,capitalization:!0,supported:t,unsupportedMessage:n}),void browser.runtime.onMessage.addListener(this._onMessage);this._validateInstanceDebounce=new Debounce(bindAndCatch(this._validateInstance,this),config.VALIDATION_DEBOUNCE_TIMEOUT),this._onWindowBlur=bindAndCatch(this._onWindowBlur,this),this._onDocumentClick=bindAndCatch(this._onDocumentClick,this),this._onDocumentFocus=bindAndCatch(this._onDocumentFocus,this),this._onTextChanged=bindAndCatch(this._onTextChanged,this),this._onInputScroll=bindAndCatch(this._onInputScroll,this),this._onBlockClicked=bindAndCatch(this._onBlockClicked,this),this._onPermissionRequiredIconClicked=bindAndCatch(this._onPermissionRequiredIconClicked,this),this._onToggleDialog=bindAndCatch(this._onToggleDialog,this),this._onPremiumIconVisible=bindAndCatch(this._onPremiumIconVisible,this),this._onLanguageChanged=bindAndCatch(this._onLanguageChanged,this),this._enableHere=bindAndCatch(this._enableHere,this),this._enableEverywhere=bindAndCatch(this._enableEverywhere,this),this._onErrorSelected=bindAndCatch(this._onErrorSelected,this),this._onTurnOffClicked=bindAndCatch(this._onTurnOffClicked,this),this._onSettingsOpen=bindAndCatch(this._onSettingsOpen,this),this._onAddToDictionaryClicked=bindAndCatch(this._onAddToDictionaryClicked,this),this._onSettingsOpen=bindAndCatch(this._onSettingsOpen,this),this._onDialogDestroyed=bindAndCatch(this._onDialogDestroyed,this),this._onFixSelected=bindAndCatch(this._onFixSelected,this),this._onTurnOffRuleClicked=bindAndCatch(this._onTurnOffRuleClicked,this),this._onErrorCardDestroyed=bindAndCatch(this._onErrorCardDestroyed,this),this._onSettingsChanged=bindAndCatch(this._onSettingsChanged,this),this._onUiStateChanged=bindAndCatch(this._onUiStateChanged,this),this._onShowFeedbackForm=bindAndCatch(this._onShowFeedbackForm,this),this._onPrivacySettingsChanged=bindAndCatch(this._onPrivacySettingsChanged,this),this._onDestroy=bindAndCatch(this.destroy,this),this._onMoreDetailsClick=bindAndCatch(this._onMoreDetailsClick,this),this._onPageHide=bindAndCatch(this._onPageHide,this),this._sendPageLoaded=bindAndCatch(this._sendPageLoaded,this),this._checkExtensionHealthInterval=setInterval(bindAndCatch(this._checkExtensionHealth,this),config.CHECK_EXTENSION_HEALTH_INTERVAL),document.addEventListener(LTAssistant.eventNames.destroy,this._onDestroy),window.addEventListener("pageshow",this._sendPageLoaded),window.addEventListener("pagehide",this._onPageHide),this._storageController=new StorageController(bindAndCatch(()=>{this._sendPageLoaded();const e=document.querySelector(":focus");e&&this._initInstance(e,!0),window._ltLastActiveElement&&(this._initInstance(window._ltLastActiveElement,!1),window._ltLastActiveElement=null),browser.runtime.onMessage.addListener(this._onMessage),window.addEventListener("blur",this._onWindowBlur),document.addEventListener("click",this._onDocumentClick,!0),document.addEventListener("focus",this._onDocumentFocus,!0),document.addEventListener(InputAreaWrapper.eventNames.textChanged,this._onTextChanged),document.addEventListener(InputAreaWrapper.eventNames.scroll,this._onInputScroll),document.addEventListener(Highlighter.eventNames.blockClicked,this._onBlockClicked),document.addEventListener(Toolbar.eventNames.permissionRequiredIconClicked,this._onPermissionRequiredIconClicked),document.addEventListener(Toolbar.eventNames.toggleDialog,this._onToggleDialog),document.addEventListener(Toolbar.eventNames.notifyAboutPremiumIcon,this._onPremiumIconVisible),document.addEventListener(Dialog.eventNames.changeLanguage,this._onLanguageChanged),document.addEventListener(Dialog.eventNames.enableHere,this._enableHere),document.addEventListener(Dialog.eventNames.enableEverywhere,this._enableEverywhere),document.addEventListener(Dialog.eventNames.errorSelected,this._onErrorSelected),document.addEventListener(Dialog.eventNames.fixSelected,this._onFixSelected),document.addEventListener(Dialog.eventNames.turnOff,this._onTurnOffClicked),document.addEventListener(Dialog.eventNames.addToDictionaryClicked,this._onAddToDictionaryClicked),document.addEventListener(Dialog.eventNames.turnOffRuleClicked,this._onTurnOffRuleClicked),document.addEventListener(Dialog.eventNames.moreDetailsClicked,this._onMoreDetailsClick),document.addEventListener(Dialog.eventNames.openSettings,this._onSettingsOpen),document.addEventListener(Dialog.eventNames.showFeedbackForm,this._onShowFeedbackForm),document.addEventListener(Dialog.eventNames.destroyed,this._onDialogDestroyed),document.addEventListener(ErrorCard.eventNames.fixSelected,this._onFixSelected),document.addEventListener(ErrorCard.eventNames.addToDictionaryClicked,this._onAddToDictionaryClicked),document.addEventListener(ErrorCard.eventNames.turnOffRuleClicked,this._onTurnOffRuleClicked),document.addEventListener(ErrorCard.eventNames.destroyed,this._onErrorCardDestroyed),document.addEventListener(ErrorCard.eventNames.moreDetailsClicked,this._onMoreDetailsClick),this._storageController.addEventListener(StorageController.eventNames.settingsChanged,this._onSettingsChanged),this._storageController.addEventListener(StorageController.eventNames.privacySettingsChanged,this._onPrivacySettingsChanged),this._storageController.addEventListener(StorageController.eventNames.uiStateChanged,this._onUiStateChanged)},this))}LTAssistant.eventNames={destroy:"_lt-destroy",updateState:"_lt-update-state"},LTAssistant.prototype=function(){const e=/^[^\n]{0,50}?[.!?]($|\n)/;function t(e,t){if(!e.isSpellingError)return!1;let n=e.misspelledWord;if(/^\w+\.$/.test(n)&&(n=n.substring(0,n.length-1)),t.includes(n))return!0;if(function(e){const t=e.charAt(0);return t===t.toUpperCase()&&t!==t.toLowerCase()}(n)){const e=(i=n).charAt(0).toLowerCase()+i.substr(1);if(t.includes(e))return!0}var i;return!1}function n(e,t){const n=getPrimaryLanguageCode(e.language.code);return t.find(t=>t.id===e.rule.id&&("*"===t.language||t.language===n))}function i(e,t,n){const i=getParagraphsDiff(e,t),r=[];for(const e of n){const t=Object.assign({},e),n=t.offset,s=t.offset+t.length;let a=!0;for(const e of i)if(null!==e.oldText){const i=e.oldOffset,r=e.oldOffset+e.oldText.length+1;if(isIntersect(n,s,i,r)){if(null!==e.textDiff){const i=e.oldOffset+e.textDiff.from,r=i+e.textDiff.oldFragment.length;if(isIntersect(n,s,i,r,!0)){a=!1;break}if(n>r){const n=e.textDiff.newFragment.length-e.textDiff.oldFragment.length;t.offset+=n}}t.offset+=e.newOffset-e.oldOffset}}a&&r.push(t)}const s=i.filter(e=>e.oldText!==e.newText&&null!==e.newText).map(e=>({text:e.newText,offset:e.newOffset}));return{changedParagraphs:s,nonAffectedErrors:r,isAllTextChanged:s.map(e=>e.text).join("\n")===t}}function r(e,t){const n=[];for(const i of e){const e=Object.assign({},i),r=e.offset,s=e.offset+e.length;let a=!0;for(const e of t){const t=e.offset,n=e.offset+e.text.length+1;if(isIntersect(r,s,t,n)){a=!1;break}}a&&n.push(Object.assign({},e))}return n}return{getDomainState(){const e=getMainPageHostname();return this._storageController.getDomainState(e)},_sendPageLoaded(){const e=this._behaviorTweaks.supported(),t=this._behaviorTweaks.unsupportedMessage(),n=this.getDomainState();browser.runtime.sendMessage({command:"PAGE_LOADED",enabled:!n.isDisabled,capitalization:n.shouldCapitalizationBeChecked,supported:e,unsupportedMessage:t})},_setDisplayedErrors(i,r,s){const a=i.displayedErrors;if(i.pendingErrors=[],i.displayedErrors=[],0===r.length)return;const{dictionary:o,ignoredRules:d}=this._storageController.getSettings(),l="string"==typeof s?s:i.inputAreaWrapper.getText(),c=i.inputAreaWrapper.getSelection();r.forEach(r=>{if(!(t(r,o)||n(r,d))){if(i.isTyping){const t=!a.some(e=>e.offset===r.offset);if(t&&r.ignoreForIncompleteSentence){if(!l.substr(r.offset+r.length).match(e))return void i.pendingErrors.push(r)}const n=c&&(c.start===r.offset||c.end===r.offset+r.length);if(t&&n)return void i.pendingErrors.push(r)}i.displayedErrors.push(r)}})},_setHiddenErrors(t,n,i){const r=t.displayedHiddenErrors;if(t.pendingHiddenErrors=[],t.displayedHiddenErrors=[],0===n.length)return;const s="string"==typeof i?i:t.inputAreaWrapper.getText(),a=t.inputAreaWrapper.getSelection();n.forEach(n=>{if(t.isTyping){const i=!r.some(e=>e.offset===n.offset);if(i&&n.ignoreForIncompleteSentence){if(!s.substr(n.offset+n.length).match(e))return void t.pendingHiddenErrors.push(n)}const o=a&&(a.start===n.offset||a.end===n.offset+n.length);if(i&&o)return void t.pendingHiddenErrors.push(n)}t.displayedHiddenErrors.push(n)})},_getIgnoredErrorsStats(e){const{dictionary:i,ignoredRules:r}=this._storageController.getSettings();return{byDictionary:e.reduce((e,n)=>t(n,i)?e+1:e,0),byRules:e.reduce((e,t)=>n(t,r)?e+1:e,0)}},_initInstance(e,t=!0){e.parentElement&&(this._instances.some(t=>t.targetElement===e)||this.getDomainState().isDisabled||this._behaviorTweaks.isElementCompatible(e)&&(this._disableOtherSpellCheckers(e),clearTimeout(this._initTimeout),this._initTimeout=setTimeout(()=>{if(t&&!e.matches(":focus"))return void this._enableOtherSpellCheckers(e);const n=Math.round(99999*Math.random())+":"+Date.now(),i="TEXTAREA"===e.tagName?new Mirror(e):null,r=new InputAreaWrapper(i?i.getCloneElement():e,e,this._behaviorTweaks.getParsingDetector(e)),s=new Highlighter(i?i.getCloneElement():e,e,r,!!i),a=new Toolbar(e,this._behaviorTweaks.toolbarSettings(e),i),o={id:n,targetElement:e,inputAreaWrapper:r,mirror:i,highlighter:s,toolbar:a,validatedText:"",allErrors:[],displayedErrors:[],pendingErrors:[],allHiddenErrors:[],displayedHiddenErrors:[],pendingHiddenErrors:[],selectedErrorId:null,temporaryDisabledErrorId:null,language:null,forceLanguage:!1,errorCard:null,dialog:null,exception:null,isAutoCheckEnabled:this.getDomainState().isAutoCheckEnabled,isRemoteCheckAllowed:this._storageController.getPrivacySettings().allowRemoteCheck,isTyping:!1,isValidating:!1,isConnected:!0,isSupportedLanguage:!0,isIncompleteResult:!1,isTextTooLong:!1,tracking:{sawPremiumIcon:!1,hasEnoughText:!1,language:null,hasTracked:!1,textLength:0},lastValidation:0};this._instances.push(o),this.updateState(o),this._validateInstance(o),onElementDisabled(e,()=>this._destroyInstance(o)),onElementRemoved(e,()=>this._destroyInstance(o))},150)))},_destroyInstance(e){const t=this._instances.indexOf(e);-1!==t&&(t>-1&&this._instances.splice(t,1),e.inputAreaWrapper.destroy(),e.highlighter.destroy(),e.toolbar.destroy(),clearTimeout(e.typingTimeout),e.mirror&&e.mirror.destroy(),e.errorCard&&e.errorCard.destroy(),e.dialog&&e.dialog.destroy(),this._enableOtherSpellCheckers(e.targetElement),this._trackInstance(e))},_validateInstance(e,t,n,r){if(!e.isAutoCheckEnabled||!e.isRemoteCheckAllowed)return;if(-1===this._instances.indexOf(e))return;void 0===t&&(t=e.inputAreaWrapper.getText(),n=i(e.validatedText,t,e.allErrors)),e.exception=null,e.isTextTooLong=!1;const{hasPaidSubscription:s}=this._storageController.getUIState();if(!s&&!this._storageController.isUsedCustomServer()&&t.length>config.MAX_TEXT_LENGTH)return e.isValidating=!1,e.isTextTooLong=!0,e.allErrors=[],e.allHiddenErrors=[],this._setDisplayedErrors(e,e.allErrors,t),this._setHiddenErrors(e,e.allHiddenErrors,t),this._leaveTypingMode(e),this._highlight(e),this.updateState(e),void(e.validatedText="");e.lastValidation=Date.now(),e.isValidating=!0,e.isSupportedLanguage||(e.isSupportedLanguage=!0,e.language=null),this.updateState(e),!e.forceLanguage&&n.isAllTextChanged&&(e.language=null),this._behaviorTweaks.getRecipientInfo(e.targetElement).then(i=>{const s={instanceId:e.id,url:getCurrentUrl(),recipientInfo:i},a={command:"VALIDATE_TEXT",text:t,changedParagraphs:n.changedParagraphs,language:e.language,forceLanguage:e.forceLanguage,userLanguageCodes:getUserLanguageCodes(),elementLanguage:e.targetElement.lang,hasUserChangedLanguage:r,metaData:s};browser.runtime.sendMessage(a).then(e=>{e&&"VALIDATION_COMPLETED"===e.command?this._onValidationCompleted(e):e&&"VALIDATION_FAILED"===e.command&&this._onValidationFailed(e)}).catch(t=>{e.isValidating=!1,Tracker.trackError("message",t.message,a.command),(t.message&&t.message.startsWith("Invocation of form runtime.connect(null, ) doesn't match definition runtime.connect")||t.message.startsWith("Extension context invalidated."))&&this._instances.forEach(e=>{e.isConnected=!1,e.highlighter&&e.highlighter.destroy()}),this.updateState(e)})})},_revalidateInstance(e,t,n=!1){e.language=t,e.forceLanguage=n,e.validatedText="",e.allErrors=[],e.displayedErrors=[],e.allHiddenErrors=[],e.displayedHiddenErrors=[],this._highlight(e),this._hideAllErrorCards(),this._validateInstance(e,void 0,void 0,n)},updateState(e,t=""){let n=REQUEST_STATUS.COMPLETED,i="";e.isConnected?e.isValidating||e.isTyping?n=REQUEST_STATUS.IN_PROGRESS:e.exception?(n=REQUEST_STATUS.FAILED,i=e.exception.message):e.isTextTooLong?n=REQUEST_STATUS.TEXT_TOO_LONG:e.isSupportedLanguage?e.isAutoCheckEnabled?e.isRemoteCheckAllowed||(n=REQUEST_STATUS.PERMISSION_REQUIRED):n=REQUEST_STATUS.DISABLED:n=REQUEST_STATUS.UNSUPPORTED_LANGUAGE:n=REQUEST_STATUS.DISCONNECTED,e.requestStatus=n;const r={requestStatus:n,errorsCount:e.displayedErrors.length,hiddenErrorsCount:e.displayedHiddenErrors.length,isIncompleteResult:e.isIncompleteResult,languageName:t,exceptionMessage:i};if(e.toolbar.updateState(r),e.dialog){const r={requestStatus:n,languageName:t,errors:e.displayedErrors,hiddenErrors:e.displayedHiddenErrors,ignoredErrorsStats:this._getIgnoredErrorsStats(e.allErrors),isIncompleteResult:e.isIncompleteResult,exceptionMessage:i};e.dialog.updateState(r)}dispatchCustomEvent(LTAssistant.eventNames.updateState,{requestStatus:n,exceptionMessage:i,languageName:t,errors:e.displayedErrors,hiddenErrors:e.displayedHiddenErrors,isIncompleteResult:e.isIncompleteResult})},_highlight(e){const t=e.displayedErrors.map(t=>({id:t.id,offset:t.offset,length:t.length,isEmphasized:t.id===e.selectedErrorId,emphasiseColor:t.color,isUnderlined:!0,underlineColor:t.color}));e.highlighter.highlight(t)},_showErrorCard(e,t,n){this._hideAllErrorCards(),e.errorCard=new ErrorCard(n,t,e.targetElement)},_hideAllErrorCards(){this._instances.forEach(e=>{e.errorCard&&e.errorCard.destroy()})},_showDialog(e){this._hideAllDialogs(),e.dialog=new Dialog(e.toolbar.getContainer(),e.language&&e.language.code,{requestStatus:e.requestStatus,errors:e.displayedErrors,hiddenErrors:e.displayedHiddenErrors,ignoredErrorsStats:this._getIgnoredErrorsStats(e.allErrors),isIncompleteResult:e.isIncompleteResult,exceptionMessage:e.exception&&e.exception.message||""},this._storageController.getUIState())},_hideAllDialogs(){this._instances.forEach(e=>{e.dialog&&e.dialog.destroy()})},_showTurnOnHint(){if(window.parent!==window)browser.runtime.sendMessage({command:"SHOW_TURN_ON_HINT"});else{const e=document.createElement("lt-hint"),t=document.createElement("lt-div");t.classList.add("lt-hint__wrapper");const n=document.createElement("lt-div");n.classList.add("lt-hint__message"),n.textContent=browser.i18n.getMessage("turnOnHint");const i=document.createElement("lt-div");i.classList.add("lt-hint__arrow"),t.appendChild(n),t.appendChild(i),e.appendChild(t),(document.body.isContentEditable?document.documentElement:document.body).appendChild(e),setAnimationFrameTimeout(()=>{fadeOutAndRemove(e)},5e3)}},_enableHere(e){const t=this._instances.find(t=>t.dialog===e.detail.dialog);t&&(t.isAutoCheckEnabled=!0,this._revalidateInstance(t,t.language),Tracker.trackEvent("Action","check_trigger:manually_triggered"))},_enableEverywhere(e){const t=this._instances.find(t=>t.dialog===e.detail.dialog);t&&(t.isAutoCheckEnabled=!0,this._revalidateInstance(t,t.language),this._storageController.updateSettings({autoCheck:!0,ignoreCheckOnDomains:[]}),Tracker.trackEvent("Action","enable_everywhere"))},_onTextChanged(e){const t=e.detail.inputAreaWrapper,n=this._instances.find(e=>e.inputAreaWrapper===t);if(!n)return;if(!n.isConnected||!n.isAutoCheckEnabled||!n.isRemoteCheckAllowed)return;this._hideAllErrorCards(),this._enterTypingMode(n);const r=e.detail.text;if(n.exception=null,r.trim().length<config.MIN_TEXT_LENGTH)n.language=null,n.isValidating=!1,n.isTextTooLong=!1,n.allErrors=[],n.allHiddenErrors=[],this._setDisplayedErrors(n,n.allErrors,r),this._setHiddenErrors(n,n.allHiddenErrors,r),this._leaveTypingMode(n),this._highlight(n),this.updateState(n),n.validatedText=r,this._validateInstanceDebounce.cancelCall();else if(r===n.validatedText)n.isValidating=!1,this._setDisplayedErrors(n,n.allErrors,r),this._setHiddenErrors(n,n.allHiddenErrors,r),this._highlight(n),this.updateState(n),this._validateInstanceDebounce.cancelCall();else{const e=i(n.validatedText,r,n.allErrors);n.isValidating=!0,n.isTextTooLong=!1,this._setDisplayedErrors(n,e.nonAffectedErrors,r),this._setHiddenErrors(n,n.allHiddenErrors,r),this._highlight(n),this.updateState(n),Date.now()-n.lastValidation>config.INTERMEDIATE_VALIDATION_INTERVAL?(this._validateInstanceDebounce.cancelCall(),this._validateInstance(n,r,e)):this._validateInstanceDebounce.call(n,r,e)}},_enterTypingMode(e){e.isTyping=!0,clearTimeout(e.typingTimeout),e.typingTimeout=setTimeout(()=>{this._leaveTypingMode(e),this._setDisplayedErrors(e,e.allErrors),this._setHiddenErrors(e,e.allHiddenErrors),this._highlight(e),this.updateState(e,e.language&&e.language.code||"")},config.STOPPED_TYPING_TIMEOUT)},_leaveTypingMode(e){e.isTyping=!1,clearTimeout(e.typingTimeout)},_onInputScroll(){window.requestAnimationFrame(()=>this._hideAllErrorCards())},_onMessage(e){switch(e.command){case"GET_SELECTED_TEXT":{const e=getSelectedText();if(e)return Promise.resolve({selectedText:e});break}case"SHOW_TURN_ON_HINT":this._showTurnOnHint()}return!1},_onUnsupportedLanguage(e,t){e.isSupportedLanguage=!1,e.isIncompleteResult=!1,e.validatedText=t.text,e.allErrors=[],e.allHiddenErrors=[],this._setDisplayedErrors(e,e.allErrors),this._setHiddenErrors(e,e.allHiddenErrors),e.selectedErrorId=null,e.language=t.language,e.forceLanguage=!1,e.errorCard&&e.errorCard.destroy(),e.dialog&&(e.dialog.destroy(),e.dialog=null),this._highlight(e),this.updateState(e,t.language.code)},_onValidationCompleted(e){const t=this._instances.find(t=>t.id===e.instanceId);if(t)if(t.isValidating=!1,e.isUnsupportedLanguage)this._onUnsupportedLanguage(t,e);else if(e.language&&!t.language&&(t.language=e.language),e.text.length>config.MIN_TEXT_LENGTH_FOR_LANGUAGE_DETECTION&&(t.tracking.language=e.language?e.language.code:null),e.text.length>config.MIN_TEXT_LENGTH&&(t.tracking.hasEnoughText=!0),t.tracking.textLength=Math.max(e.text.length,t.tracking.textLength),t.dialog&&e.language&&t.dialog.setCurrentLanguage(e.language.code),t.forceLanguage||!e.language||e.language.code.toLowerCase()===t.language.code.toLowerCase()){let n=t.allErrors.slice(0),s=t.allHiddenErrors.slice(0);n=n.filter(e=>e.isPartialValidation),s=s.filter(e=>e.isPartialValidation);let a=i(t.validatedText,e.text,n),o=i(t.validatedText,e.text,s);n=r(a.nonAffectedErrors,a.changedParagraphs),s=r(o.nonAffectedErrors,o.changedParagraphs),n=n.concat(e.partialValidationErrors),s=s.concat(e.partialValidationHiddenErrors);for(const t of e.validationErrors)n.some(e=>e.offset===t.offset&&e.length===t.length)||n.push(t);for(const t of e.validationHiddenErrors)s.some(e=>e.offset===t.offset&&e.length===t.length)||s.push(t);n.sort((e,t)=>e.offset>t.offset?1:-1);for(let e=0;e<n.length;e++)n[e].id=e+1;s.sort((e,t)=>e.offset>t.offset?1:-1);for(let e=0;e<s.length;e++)s[e].id=e+1;const d=t.inputAreaWrapper.getText();a=i(e.text,d,n),o=i(e.text,d,s),t.validatedText=e.text,t.allErrors=n,t.allHiddenErrors=s,t.isIncompleteResult=e.isIncompleteResult,this._setDisplayedErrors(t,a.nonAffectedErrors),this._setHiddenErrors(t,o.nonAffectedErrors),t.pendingErrors.length||t.pendingHiddenErrors.length||this._leaveTypingMode(t),this._highlight(t),this.updateState(t)}else this._revalidateInstance(t,e.language)},_onValidationFailed(e){const t=this._instances.find(t=>t.id===e.instanceId);if(t){if(t.isValidating=!1,t.validatedText="",t.allErrors=[],t.displayedErrors=[],t.pendingErrors=[],t.allHiddenErrors=[],t.displayedHiddenErrors=[],t.pendingHiddenErrors=[],t.isIncompleteResult=!1,t.exception=e.exception,e&&e.exception&&void 0!==e.exception.status)this._storageController.isUsedCustomServer()||Tracker.trackError("http",`${e.exception.status}: ${e.exception.response}`);else if(e&&e.exception&&e.exception.message){const n=e.exception;t.exception={message:browser.i18n.getMessage("statusIconError")};const i=generateStackTrace(n);Tracker.trackError("js",n.message,i||"")}else Tracker.trackError("http","unknown");this._highlight(t),this.updateState(t)}},_onWindowBlur(){this._hideAllErrorCards(),this._hideAllDialogs()},_onDocumentFocus(e){this._initInstance(e.target)},_onDocumentClick(e){if(this._behaviorTweaks.isClickIgnored(e))return;closestElement(e.target,ErrorCard.CONTAINER_ELEMENT_NAME)||this._hideAllErrorCards(),closestElement(e.target,`${Dialog.CONTAINER_ELEMENT_NAME}, ${Toolbar.CONTAINER_ELEMENT_NAME}`)||this._hideAllDialogs()},_disableOtherSpellCheckers(e){if(this._otherSpellCheckers.get(e))return;const t={spellcheck:e.getAttribute("spellcheck"),"data-gramm":e.getAttribute("data-gramm")};e.setAttribute("spellcheck","false"),e.setAttribute("data-gramm","false");const n=new MutationObserver(()=>{"false"===e.getAttribute("spellcheck")&&"false"===e.getAttribute("data-gramm")||(e.setAttribute("spellcheck","false"),e.setAttribute("data-gramm","false"))});n.observe(e,{attributes:!0,attributeFilter:["spellcheck","data-gramm"]}),this._otherSpellCheckers.set(e,{originalAttributes:t,mutationObserver:n})},_enableOtherSpellCheckers(e){const t=this._otherSpellCheckers.get(e);if(t){t.mutationObserver.disconnect();for(const n in t.originalAttributes){const i=t.originalAttributes[n];t.originalAttributes[n]?e.setAttribute(n,i):e.removeAttribute(n)}this._otherSpellCheckers.delete(e)}},_onBlockClicked(e){const t=this._instances.find(t=>t.highlighter===e.detail.highlighter);if(this._hideAllErrorCards(),this._hideAllDialogs(),t){const n=t.displayedErrors.find(t=>t.id===e.detail.blockId);if(!n)return;if(t.temporaryDisabledErrorId===n.id)return;if(getSelectedText().trim())return;this._showErrorCard(t,e.detail.clickedRectangle,n),t.selectedErrorId=n.id,this._highlight(t)}},_onErrorSelected(e){const t=this._instances.find(t=>t.dialog===e.detail.dialog);if(t){t.selectedErrorId=e.detail.errorId,this._highlight(t);const n=t.displayedErrors.find(e=>e.id===t.selectedErrorId);n&&t.inputAreaWrapper.scrollToText(n.offset,n.length)}},_onFixSelected(e){let t=null;if(e.detail.errorCard?t=this._instances.find(t=>t.errorCard===e.detail.errorCard):e.detail.dialog&&(t=this._instances.find(t=>t.dialog===e.detail.dialog)),this._hideAllErrorCards(),!t)return;const n=e.detail.error,i={error:n,replacementText:n.fixes[e.detail.fixIndex].value,instance:t};this._behaviorTweaks.applyFix(i),this._validateInstanceDebounce.callAfter(100);const{appliedSuggestions:r}=this._storageController.getStatistics();this._storageController.updateStatistics({appliedSuggestions:r+1}),Tracker.trackEvent("Action","check_trigger:apply_suggestion",String(e.detail.fixIndex))},_onTurnOffClicked(e){const t=getMainPageHostname();this._storageController.disableDomain(t),browser.runtime.sendMessage({command:"EXTENSION_STATUS_CHANGED",enabled:!1}),this._showTurnOnHint()},_onAddToDictionaryClicked(e){const t=this._instances.find(t=>!(!e.detail.errorCard||e.detail.errorCard!==t.errorCard)||!(!e.detail.dialog||e.detail.dialog!==t.dialog));this._hideAllErrorCards();const n=e.detail.error,i=this._storageController.getSettings().dictionary;i.push(n.misspelledWord),this._storageController.updateSettings({dictionary:i});const r=t&&t.language?getPrimaryLanguageCode(t.language.code):"unknown";Tracker.trackEvent("Action","check_trigger:add_to_dict",`${r}: ${n.misspelledWord}`)},_onTurnOffRuleClicked(e){this._hideAllErrorCards();const t=e.detail.error,n=this._storageController.getSettings().ignoredRules,i={id:t.rule.id,language:getPrimaryLanguageCode(t.language.code),description:t.rule.description};n.push(i),this._storageController.updateSettings({ignoredRules:n}),Tracker.trackEvent("Action","check_trigger:turn_off_rule",i.id)},_onShowFeedbackForm(){browser.runtime.sendMessage({command:"OPEN_FEEDBACK_FORM",hostName:getCurrentHostname(),url:location.href})},_onMoreDetailsClick(e){window.open(e.detail.url,"_blank"),Tracker.trackEvent("Action","show_rule_details",e.detail.url)},_onToggleDialog(e){const t=this._instances.find(t=>t.toolbar===e.detail.toolbar);if(!t)return;const n=!t.dialog;this._hideAllDialogs(),n&&this._showDialog(t)},_onPremiumIconVisible(e){const t=this._instances.find(t=>t.toolbar===e.detail.toolbar);t&&t.language&&(t.tracking.sawPremiumIcon=!0)},_onErrorCardDestroyed(e){const t=this._instances.find(t=>t.errorCard===e.detail.errorCard);t&&(t.errorCard=null,t.selectedErrorId===e.detail.error.id&&(t.temporaryDisabledErrorId=t.selectedErrorId,setTimeout(()=>t.temporaryDisabledErrorId=null,500),t.selectedErrorId=null,this._highlight(t)))},_onDialogDestroyed(e){const t=this._instances.find(t=>t.dialog===e.detail.dialog);t&&(t.dialog=null,null===t.errorCard&&null!==t.selectedErrorId&&(t.selectedErrorId=null,this._highlight(t)))},_onLanguageChanged(e){const t=this._instances.find(t=>t.dialog===e.detail.dialog);if(!t)return;const n=t.language;if(t.language=e.detail.language,this._revalidateInstance(t,e.detail.language,!0),n&&n.code){if(Tracker.trackEvent("Action","check_trigger:switch_language",`${n.code} -> ${e.detail.language.code}`),n.code.indexOf("-")>-1&&e.detail.language.code.indexOf("-")>-1){const t=n.code.split(/-(.+)/),i=e.detail.language.code.split(/-(.+)/),r=t[0],s=t[1],a=i[0],o=i[1];if(r===a&&s!==o){const t=e.detail.language.code.split(/-/),n=2===t.length?t[0]+"-"+t[1].toUpperCase():t[0]+"-"+t[1].toUpperCase()+"-"+t.splice(2);"en"===a?this._storageController.updateSettings({enVariant:n}):"de"===a?this._storageController.updateSettings({deVariant:n}):"pt"===a?this._storageController.updateSettings({ptVariant:n}):"ca"===a&&this._storageController.updateSettings({caVariant:n})}}}else Tracker.trackEvent("Action","check_trigger:switch_language",`unknown -> ${e.detail.language.code}`)},_onSettingsOpen(){browser.runtime.sendMessage({command:"OPEN_OPTIONS"})},_onSettingsChanged(e){if(e.dictionary||e.ignoredRules)for(const e of this._instances)this._setDisplayedErrors(e,e.allErrors),this._highlight(e),this.updateState(e,e.language&&e.language.code||"");if(e.disabledDomains||e.autoCheck||e.ignoreCheckOnDomains||e.autoCheckOnDomains){const e=this.getDomainState(),t=Array.prototype.slice.call(this._instances);for(const n of t)if(e.isDisabled)this._destroyInstance(n);else if(e.isAutoCheckEnabled){!n.isAutoCheckEnabled&&(n.isAutoCheckEnabled=!0,this._revalidateInstance(n,n.language))}else e.isAutoCheckEnabled?e.shouldCapitalizationBeChecked||this._revalidateInstance(n,n.language):(n.isAutoCheckEnabled=!1,n.allErrors=[],n.displayedErrors=[],n.pendingErrors=[],n.allHiddenErrors=[],n.displayedHiddenErrors=[],n.pendingHiddenErrors=[],this._highlight(n),this.updateState(n),this._hideAllErrorCards(),this._hideAllDialogs())}e.disabledDomainsCapitalization&&this._instances.forEach(e=>{this._revalidateInstance(e,e.language)})},_onUiStateChanged(e){if(e.hasPaidSubscription)for(const e of this._instances)this._revalidateInstance(e,e.language)},_onPermissionRequiredIconClicked(){window.open(config.INSTALL_URL),Tracker.trackEvent("Action","toolbar:open_install_url")},_onPrivacySettingsChanged(e){e.allowRemoteCheck&&e.allowRemoteCheck.newValue&&this._instances.forEach(e=>{e.isRemoteCheckAllowed=!0,this._validateInstance(e)})},_checkExtensionHealth(){isRuntimeConnected()||(this._instances.forEach(e=>{e.isConnected=!1,e.highlighter&&e.highlighter.destroy(),this.updateState(e)}),clearInterval(this._checkExtensionHealthInterval))},_trackInstance(e){(isRuntimeConnected()||e.tracking.hasTracked)&&(e.tracking.hasTracked=!0,e.tracking.hasEnoughText&&browser.runtime.sendMessage({command:"TRACK_EVENT",action:`saw_premium_icon:${e.tracking.sawPremiumIcon}`,label:e.tracking.language}),Math.random()<.1&&browser.runtime.sendMessage({command:"TRACK_TEXT_LENGTH",textLength:e.tracking.textLength}))},_onPageHide(){this._instances.forEach(e=>{this._trackInstance(e)})},destroy(){this._instances.slice(0).forEach(e=>this._destroyInstance(e));try{browser.runtime.onMessage.removeListener(this._onMessage)}catch(e){}window.removeEventListener("blur",this._onWindowBlur),document.removeEventListener("click",this._onDocumentClick,!0),document.removeEventListener("focus",this._onDocumentFocus,!0),document.removeEventListener(InputAreaWrapper.eventNames.textChanged,this._onTextChanged),document.removeEventListener(InputAreaWrapper.eventNames.scroll,this._onInputScroll),document.removeEventListener(Highlighter.eventNames.blockClicked,this._onBlockClicked),document.removeEventListener(Toolbar.eventNames.permissionRequiredIconClicked,this._onPermissionRequiredIconClicked),document.removeEventListener(Toolbar.eventNames.toggleDialog,this._onToggleDialog),document.removeEventListener(Toolbar.eventNames.notifyAboutPremiumIcon,this._onPremiumIconVisible),document.removeEventListener(Dialog.eventNames.changeLanguage,this._onLanguageChanged),document.removeEventListener(Dialog.eventNames.enableHere,this._enableHere),document.removeEventListener(Dialog.eventNames.enableEverywhere,this._enableEverywhere),document.removeEventListener(Dialog.eventNames.errorSelected,this._onErrorSelected),document.removeEventListener(Dialog.eventNames.fixSelected,this._onFixSelected),document.removeEventListener(Dialog.eventNames.turnOff,this._onTurnOffClicked),document.removeEventListener(Dialog.eventNames.addToDictionaryClicked,this._onAddToDictionaryClicked),document.removeEventListener(Dialog.eventNames.turnOffRuleClicked,this._onTurnOffRuleClicked),document.removeEventListener(Dialog.eventNames.moreDetailsClicked,this._onMoreDetailsClick),document.removeEventListener(Dialog.eventNames.openSettings,this._onSettingsOpen),document.removeEventListener(Dialog.eventNames.showFeedbackForm,this._onShowFeedbackForm),document.removeEventListener(Dialog.eventNames.destroyed,this._onDialogDestroyed),document.removeEventListener(ErrorCard.eventNames.fixSelected,this._onFixSelected),document.removeEventListener(ErrorCard.eventNames.addToDictionaryClicked,this._onAddToDictionaryClicked),document.removeEventListener(ErrorCard.eventNames.turnOffRuleClicked,this._onTurnOffRuleClicked),document.removeEventListener(ErrorCard.eventNames.destroyed,this._onErrorCardDestroyed),document.removeEventListener(ErrorCard.eventNames.moreDetailsClicked,this._onMoreDetailsClick),window.removeEventListener("pageshow",this._sendPageLoaded),window.removeEventListener("pagehide",this._onPageHide),this._storageController&&this._storageController.destroy(),clearTimeout(this._initTimeout),clearInterval(this._checkExtensionHealthInterval),this._validateInstanceDebounce&&this._validateInstanceDebounce.cancelCall(),document.documentElement&&document.documentElement.removeAttribute("data-lt-installed"),this._options.onDestroy&&this._options.onDestroy()}}}();