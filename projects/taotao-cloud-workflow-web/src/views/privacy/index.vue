<template>
  <div class="c-con">
    <p
      style="text-align:justify;margin-top:0;margin-bottom:0;border:none"
      class="docData;DOCY;v5;9334;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"
    >
      <span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >隐私政策&nbsp;</span
      ><span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >&nbsp;&nbsp;
      </span>
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      &nbsp;
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family: Calibri;font-size: 14px"
        ><strong>中国xxxx防控系统 </strong></span
      ><span style="font-family: Calibri;font-size: 14px"
        >尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务， </span
      ><span style="font-family: Calibri;font-size: 14px">xxxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app会按照本隐私权政策的规定使用和披露您的个人信息。但</span
      ><span style="font-family: Calibri;font-size: 14px">xxxxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在
        未征得您事先许可的情况下，</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app不会将这些信息对外披露或向第三方提供。</span
      ><span style="font-family: Calibri;font-size: 14px">xxxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app会不时更新本隐私权政策。&nbsp;您在同意</span
      ><span style="font-family: Calibri;font-size: 14px">寻</span
      ><span style="font-family: Calibri;font-size: 14px">联防控</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app服务
        使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app服务使用协议不可分割的一部分。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >1.&nbsp;适用范围&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family: Calibri;font-size: 14px">a)&nbsp;在您使用</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app网络服务，或访问</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px">app平台网页时，</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family: Calibri;font-size: 14px">b)&nbsp;</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app通过合法途径从商业伙伴处取得的用户个人数据。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >2.&nbsp;信息使用&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <span style="font-family: Calibri;font-size: 14px">a)&nbsp;</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px">app（含</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app关联公司）单独或共</span
      ><a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >同为您提供服务，且在该服务结束后，其将被禁止访问包括其以前能够访问的所有这些资料。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">b)&nbsp;</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app平台用户如从事上述活动，一经发现，我司有权立即终止与该用户的服务协议。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >c)&nbsp;为服务用户的目的，</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，或者与我司合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >3.&nbsp;信息披露&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">在如下情况下，</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >a)&nbsp;经您事先同意，向第三方披露；&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >b)&nbsp;为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >c)&nbsp;根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >d) 如您出现违反中国有关法律、法规或者</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app服务协议或相关规则的情况，需要向第三方披露； &nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px"
        >e)
        如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">f) 在</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app平台上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决。
        &nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">g) 其它</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app根据法律、法规或者网站政策认为合适的披露。 &nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >4. 信息存储和交换 &nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app收集的有关您的信息和资料将保存在</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app收集信息和资料所在地的境外并在境外被访问、存储和展示。&nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family:&#39;Calibri&#39;;font-size:14px;color:#ff0000"
        >5. 信息安全 </span
      ><span style="font-family: Calibri;font-size: 14px">&nbsp;</span>
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">a) </span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app帐号均有安全保护功能，请妥善保管您的用户名及密码信息。</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app将通过对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在“完善的安全措施”。
        &nbsp;</span
      >
    </p>
    <p style="text-align:justify;margin-top:0;margin-bottom:0;border:none">
      <a name="_GoBack"></a
      ><span style="font-family: Calibri;font-size: 14px">b) 在使用</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app网
        络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的
        情形下向他人提供。如您发现自己的个人信息泄密，尤其是</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app用户名及密码发生泄露，请您立即联络</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px">app客服，以便</span
      ><span style="font-family: Calibri;font-size: 14px">xxx</span
      ><span style="font-family: Calibri;font-size: 14px"
        >app采取相 应措施。</span
      >
    </p>
    <p
      style="text-align:justify;margin-top:0;margin-bottom:0;border:none;border-left:none;border-top:none;border-right:none;border-bottom:none"
    >
      <a name="_GoBack"></a>&nbsp;
    </p>
    <p>
      <br />
    </p>
  </div>
</template>

<script>
export default {
  name: "Privacy",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.c-con {
  padding: 10px;
}
</style>
