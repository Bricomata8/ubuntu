const HistoricPremiumErrorsTeaser=function(r,e,t){this._container=r,this._componentName=e,this._historicPremiumErrorCount=t};HistoricPremiumErrorsTeaser.prototype={render(){loadStylesheet("/teaser/historicPremiumErrors/historicPremiumErrors.css"),loadHTML("/teaser/historicPremiumErrors/historicPremiumErrors.html").then(r=>{this._container.innerHTML=r,this._element=this._container.querySelector("#historic-premium-errors-teaser"),this._text=this._container.querySelector("#lt-historic-premium-errors-teaser-text"),this._translate(),this._observe(),Tracker.trackEvent("Action",`${this._componentName}:historic_premium_teaser`);let e="https://languagetoolplus.com/webextension/upgrade?pk_campaign=addon2-dialog-historic-premium-errors";e+=`&historicMatches=${this._historicPremiumErrorCount}`,this._element.href=e})},_translate(){translateSection(this._container),translateElement(this._text,{key:"historicPremiumErrorsText2",isHTML:!0,interpolations:[this._historicPremiumErrorCount]})},_observe(){this._element.addEventListener("click",()=>{Tracker.trackEvent("Action",`${this._componentName}:historic_premium_teaser:click`)})}};