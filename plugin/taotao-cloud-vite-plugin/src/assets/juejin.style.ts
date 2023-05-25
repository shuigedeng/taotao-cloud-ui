export const style = `
html {
  font-family: sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
main,
menu,
nav,
section,
summary {
  display: block;
}
audio,
canvas,
progress,
video {
  display: inline-block;
}
audio:not([controls]) {
  display: none;
  height: 0;
}
progress {
  vertical-align: baseline;
}
[hidden],
template {
  display: none;
}
a {
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}
a:active,
a:hover {
  outline-width: 0;
}
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
b,
strong {
  font-weight: inherit;
  font-weight: bolder;
}
dfn {
  font-style: italic;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
mark {
  background-color: #ff0;
  color: #000;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
svg:not(:root) {
  overflow: hidden;
}
code,
kbd,
pre,
samp {
  font-family: monospace,monospace;
  font-size: 1em;
}
figure {
  margin: 1em 40px;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
button,
input,
select,
textarea {
  font: inherit;
  margin: 0;
}
optgroup {
  font-weight: 700;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}
[type=reset],
[type=submit],
button,
html [type=button] {
  -webkit-appearance: button;
}
[type=button]::-moz-focus-inner,
[type=reset]::-moz-focus-inner,
[type=submit]::-moz-focus-inner,
button::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
[type=button]:-moz-focusring,
[type=reset]:-moz-focusring,
[type=submit]:-moz-focusring,
button:-moz-focusring {
  outline: 1px dotted ButtonText;
}
fieldset {
  border: 1px solid silver;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em;
}
legend {
  box-sizing: border-box;
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}
textarea {
  overflow: auto;
}
[type=checkbox],
[type=radio] {
  box-sizing: border-box;
  padding: 0;
}
[type=number]::-webkit-inner-spin-button,
[type=number]::-webkit-outer-spin-button {
  height: auto;
}
[type=search] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type=search]::-webkit-search-cancel-button,
[type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
@font-face {
  font-family: iconfont;
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358);
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358#iefix) format("embedded-opentype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.woff?t=1470110358) format("woff"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.ttf?t=1470110358) format("truetype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.svg?t=1470110358#iconfont) format("svg");
}
.iconfont {
  font-family: iconfont!important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-xlcollection:before {
  content: "\e600";
}
.icon-xlchatbox:before {
  content: "\e601";
}
.article-content {
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 15px;
  overflow-x: hidden;
  padding: 0 20px;
}
.article-content h1 {
  margin: 1.3rem 0;
  line-height: 1.2;
}
.article-content p {
  line-height: 2.27rem;
}
.article-content hr {
  border: none;
  border-top: 1px solid #ddd;
  margin-top: 2.7rem;
  margin-bottom: 2.7rem;
}
.article-content embed,
.article-content iframe,
.article-content img:not(.equation),
.article-content video {
  max-width: 100%!important;
  margin: 0;
}
.article-content img.lazyload {
  visibility: hidden;
}
.article-content img.inited {
  background-color: #f8f9fa;
  background-position: 50%;
  background-repeat: no-repeat;
  visibility: visible;
}
.article-content img.loaded {
  background-image: none;
  background-color: transparent;
}
.article-content img.error {
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/image-error.3338abe.png);
}
.article-content img.equation {
  margin: 0 .1em;
  max-width: 100%!important;
  vertical-align: middle;
}
.article-content img:not(.equation) {
  cursor: zoom-in;
}
.article-content figure {
  margin: 2.7rem auto;
  text-align: center;
}
.article-content figure figcaption {
  text-align: center;
  font-size: 1rem;
  line-height: 2.7rem;
  color: #909090;
}
.article-content pre {
  line-height: 1.93rem;
  overflow: auto;
}
.article-content code,
.article-content pre {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace;
}
.article-content code {
  font-size: 1rem;
  padding: .26rem .53em;
  word-break: break-word;
  color: #4e5980;
  background-color: #f8f8f8;
  border-radius: 2px;
  overflow-x: auto;
}
.article-content pre > code {
  font-size: 1rem;
  padding: .67rem 1.3rem;
  margin: 0;
  word-break: normal;
  display: block;
}
.article-content a {
  color: #259;
}
.article-content a:active,
.article-content a:hover {
  color: #275b8c;
}
.article-content table {
  display: inline-block !important;
  font-size: 1rem;
  width: auto;
  max-width: 100%;
  overflow: auto;
  border: 1px solid #f6f6f6;
}
.article-content thead {
  background: #f6f6f6;
  color: #000;
  text-align: left;
}
.article-content tr:nth-child(2n) {
  background-color: #fcfcfc;
}
.article-content td,
.article-content th {
  padding: 1rem .6rem;
  line-height: 2rem;
}
.article-content td {
  min-width: 10rem;
}
.article-content blockquote {
  margin: 1em 0;
  border-left: 4px solid #ddd;
  padding: 0 1.3rem;
}
.article-content blockquote > p {
  margin: 0.6rem 0;
}
.article-content ol,
.article-content ul {
  padding-left: 2.7rem;
}
.article-content ol li,
.article-content ul li {
  margin-bottom: 0.6rem;
}
.article-content ol ol,
.article-content ol ul,
.article-content ul ol,
.article-content ul ul {
  margin-top: 0.27rem;
}
.article-content pre > code {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  color: #333;
  background: #f8f8f8;
}
.article-content .hljs-comment,
.article-content .hljs-quote {
  color: #998;
}
.article-content .hljs-keyword,
.article-content .hljs-selector-tag,
.article-content .hljs-subst {
  color: #333;
  font-weight: 700;
}
.article-content .hljs-literal,
.article-content .hljs-number,
.article-content .hljs-tag .hljs-attr,
.article-content .hljs-template-variable,
.article-content .hljs-variable {
  color: teal;
}
.article-content .hljs-doctag,
.article-content .hljs-string {
  color: #d14;
}
.article-content .hljs-section,
.article-content .hljs-selector-id,
.article-content .hljs-title {
  color: #900;
  font-weight: 700;
}
.article-content .hljs-subst {
  font-weight: 400;
}
.article-content .hljs-class .hljs-title,
.article-content .hljs-type {
  color: #458;
  font-weight: 700;
}
.article-content .hljs-attribute,
.article-content .hljs-name,
.article-content .hljs-tag {
  color: navy;
  font-weight: 400;
}
.article-content .hljs-link,
.article-content .hljs-regexp {
  color: #009926;
}
.article-content .hljs-bullet,
.article-content .hljs-symbol {
  color: #990073;
}
.article-content .hljs-built_in,
.article-content .hljs-builtin-name {
  color: #0086b3;
}
.article-content .hljs-meta {
  color: #999;
  font-weight: 700;
}
.article-content .hljs-deletion {
  background: #fdd;
}
.article-content .hljs-addition {
  background: #dfd;
}
.article-content .hljs-emphasis {
  font-style: italic;
}
.article-content .hljs-strong {
  font-weight: 700;
}
.article-content p {
  line-height: inherit;
  margin-top: 22px;
  margin-bottom: 22px;
}
.article-content img {
  max-height: none;
}
.article-content a {
  color: #0269c8;
  border-bottom: 1px solid #d1e9ff;
}
.article-content code {
  background-color: #fff5f5;
  color: #ff502c;
  font-size: .87em;
  padding: 0.065em 0.4em;
}
.article-content figure {
  margin: 22px auto;
}
.article-content figure figcaption {
  margin-top: 2px;
  line-height: 1.6;
}
.article-content blockquote {
  color: #666;
  padding: 1px 23px;
  margin: 22px 0;
  border-left: 4px solid #cbcbcb;
  background-color: #f8f8f8;
}
.article-content blockquote:after {
  display: block;
  content: "";
}
.article-content blockquote > p {
  margin: 10px 0;
}
.article-content blockquote.warning {
  position: relative;
  border-left-color: #f75151;
  margin-left: 8px;
}
.article-content blockquote.warning:before {
  position: absolute;
  top: 14px;
  left: -12px;
  background: #f75151;
  border-radius: 50%;
  content: "!";
  width: 20px;
  height: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.article-content ol,
.article-content ul {
  padding-left: 28px;
}
.article-content ol li,
.article-content ul li {
  margin-bottom: 0;
  list-style: inherit;
}
.article-content ol li.task-list-item,
.article-content ul li.task-list-item {
  list-style: none;
}
.article-content ol li.task-list-item ol,
.article-content ol li.task-list-item ul,
.article-content ul li.task-list-item ol,
.article-content ul li.task-list-item ul {
  margin-top: 0;
}
.article-content ol li {
  padding-left: 6px;
}
.article-content pre {
  position: relative;
  line-height: 1.75;
}
.article-content pre > code {
  padding: 15px 12px;
}
.article-content pre > code.hljs[lang] {
  padding: 18px 15px 12px;
}
.article-content pre > code.hljs[lang]:before {
  content: attr(lang);
  position: absolute;
  right: 15px;
  top: 2px;
  color: rgba(140, 140, 140, 0.8);
}
.article-content pre > code.hljs[lang][lang=bash]:before {
  content: "";
}
.article-content pre > code.copyable .copy-code-btn {
  position: absolute;
  top: 6px;
  right: 15px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  color: rgba(140, 140, 140, 0.8);
  transition: color 0.1s;
}
.article-content pre > code.copyable .copy-code-btn:hover {
  color: #8c8c8c;
}
.article-content pre > code.copyable.hljs[lang]:before {
  right: 70px;
}
.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  color: #333;
  line-height: 1.5;
  margin-top: 35px;
  margin-bottom: 10px;
  padding-bottom: 5px;
}
.article-content h1 {
  font-size: 30px;
  margin-bottom: 5px;
}
.article-content h2 {
  padding-bottom: 12px;
  font-size: 24px;
  border-bottom: 1px solid #ececec;
}
.article-content h3 {
  font-size: 18px;
  padding-bottom: 0;
}
.article-content h4 {
  font-size: 16px;
}
.article-content h5 {
  font-size: 15px;
}
.article-content h6 {
  margin-top: 5px;
}
.article-content h1.heading + h2.heading {
  margin-top: 20px;
}
.article-content h1.heading + h3.heading {
  margin-top: 15px;
}
.article-content .heading + .heading {
  margin-top: 0;
}
.article-content h1 + :not(.heading) {
  margin-top: 25px;
}
@media (max-width: 720px) {
  .article-content h1 {
    font-size: 24px;
  }
  .article-content h2 {
    font-size: 20px;
  }
  .article-content h3 {
    font-size: 18px;
  }
  .article-content pre > code .copy-code-btn {
    display: none;
  }
  .article-content pre > code.hljs[lang]:before {
    top: 2px;
    right: 15px;
  }
}
@media (max-width: 720px) {
  .article-content pre > code.copyable.hljs[lang]:before {
    right: 1rem;
  }
}
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: #007fff;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px #007fff,0 0 5px #007fff;
  opacity: 1;
  transform: rotate(3deg) translateY(-4px);
}
.nprogress-custom-parent {
  overflow: hidden;
  position: relative;
}
.nprogress-custom-parent #nprogress .bar,
.nprogress-custom-parent #nprogress .spinner {
  position: absolute;
}
@-webkit-keyframes nprogress-spinner {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1turn);
  }
}
@keyframes nprogress-spinner {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1turn);
  }
}
body {
  font-size: 12px;
  line-height: normal;
}
a,
button,
input {
  margin: initial;
}
img {
  width: auto;
  height: auto;
}
#juejin {
  overflow-x: visible;
  overflow-x: initial;
}
html {
  font-size: 12px;
  font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial;
  word-break: break-word;
  text-rendering: optimizeLegibility;
  color: #333;
  background-color: #f4f5f5;
}
html.white {
  background-color: #fff;
}
body {
  word-break: break-word;
  overflow-y: scroll;
}
a {
  text-decoration: none;
  cursor: pointer;
  color: #909090;
}
a:hover {
  color: #007fff;
}
button {
  list-style: 1;
}
button:disabled {
  cursor: not-allowed;
}
button.disabled,
button.disabled:hover {
  background-color: #d2d2d2;
  cursor: not-allowed;
}
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
#juejin-seo-meta {
  display: none;
}
.container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
.container:after {
  display: table;
  content: "";
  clear: both;
}
.hidden {
  display: none;
}
.root-view-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}
.shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}
.align-middle {
  vertical-align: middle;
}
.center {
  margin-left: auto;
  margin-right: auto;
}
.text-normal {
  color: #333;
}
.text-muted {
  color: #666;
}
.text-muted1 {
  color: #909090;
}
.text-muted2 {
  color: #838383;
}
.text-gray {
  color: #909090;
}
.text-light {
  color: #d2d2d2;
}
.text-blue {
  color: #007fff;
}
.text-blue-hover {
  color: #0371df;
}
.text-green {
  color: #37c700;
}
.text-green-hover {
  color: #3cb40e;
}
.text-orange {
  color: #ff8900;
}
.text-red {
  color: #e22323;
}
.text-a,
.text-link {
  cursor: pointer;
  color: #333;
}
.text-link {
  color: #259;
}
.text-pointer {
  cursor: pointer;
}
.line-wrap {
  white-space: pre-wrap;
  word-break: break-all;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-bold,
b,
strong {
  font-weight: 700;
}
.view-nav {
  position: fixed;
  top: 5rem;
  width: 100%;
  height: 3.833rem;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all .2s;
  transform: translateZ(0);
}
.view-nav,
.view-nav:before {
  left: 0;
  background-color: #fff;
}
.view-nav:before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 200%;
  z-index: -1;
}
.view-nav.top {
  transform: translate3d(0, -5rem, 0);
}
.view-nav .nav-list {
  max-width: 960px;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  line-height: 1;
}
.view-nav .nav-list .nav-item {
  height: 100%;
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-size: 1.16rem;
  color: #71777c;
  padding: 0 1rem;
}
.view-nav .nav-list .nav-item:first-child {
  padding: 0 1rem 0 0;
}
.view-nav .nav-list .nav-item:last-child {
  padding: 0 0 0 1rem;
}
.view-nav .nav-list .nav-item.active,
.view-nav .nav-list .nav-item:hover {
  color: #007fff;
}
.view-nav .nav-list .nav-item a {
  color: inherit;
}
.nav-item {
  position: relative;
  cursor: pointer;
}
.nav-item > a:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
@media (max-width: 980px) {
  .view-nav .nav-list {
    width: auto;
    overflow-x: auto;
  }
  .view-nav .nav-list .nav-item:first-child,
  .view-nav .nav-list .nav-item:last-child {
    padding: 0 1.5rem;
  }
}
.list-header {
  padding: 1.3rem 1rem;
  border-bottom: 1px solid rgba(151, 151, 151, 0.1);
}
.list-header .list-nav,
.list-header .nav-list {
  display: flex;
  justify-content: space-between;
}
.list-header .nav-list {
  align-items: center;
  line-height: 1;
}
.list-header .nav-list .nav-item.active a,
.list-header .nav-list .nav-item a:hover {
  color: #007fff;
}
.list-header .left .nav-item {
  padding: 0 1.2rem;
  font-size: 1.16rem;
  border-right: 1px solid rgba(151, 151, 151, 0.2);
}
.list-header .left .nav-item:last-child {
  border: none;
}
.list-header .right .nav-item {
  font-size: 1.16rem;
  padding: 0 .7rem;
  position: relative;
}
.list-header .right .nav-item:not(:last-child):after {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  content: "";
  position: absolute;
  left: 100%;
  top: 50%;
  background-color: #2b445d;
  transform: translateY(-50%);
  opacity: 0.5;
}
@media (max-width: 600px) {
  .list-header .right {
    display: none;
  }
}
.button,
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #007fff;
  color: #fff;
  border-radius: 2px;
  border: none;
  padding: .5rem 1.3rem;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}
.button:hover,
button:hover {
  background-color: #0371df;
  color: #fff;
}
i + span {
  margin-left: 0.6rem;
}
button + button {
  margin-left: 0.8rem;
}
.subscribe-btn {
  border: 1px solid #37c700;
  background-color: #fff;
  color: #37c700;
  margin: 1rem auto;
  font-size: 1.1rem;
}
.subscribe-btn:hover {
  background-color: #fff;
  color: #3cb40e;
  border-color: #3cb40e;
}
.subscribe-btn.subscribed {
  background-color: #37c700;
  color: #fff;
}
.subscribe-btn.subscribed:hover {
  background-color: #3cb40e;
}
.radio-group {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.radio-group .radio-label {
  margin-left: 6px;
}
input[type=radio] {
  width: 16px;
  height: 16px;
  border: 1px solid #bfcbd9;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input[type=radio]:after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6);
}
input[type=radio]:checked {
  border-color: #20a0ff;
  background: #3a9afc;
}
input[type=radio]:checked:after {
  transform: translate(-50%, -50%) scale(1);
}
input[type=radio]:disabled {
  background-color: #eef1f6;
  border-color: #d1dbe5;
  cursor: not-allowed;
}
input[type=radio]:disabled:checked {
  border-color: #d1dbe5;
  background-color: #d1dbe5;
}
input[name=registerSmsCode]::-webkit-contacts-auto-fill-button {
  display: none;
  visibility: hidden;
}
.editable,
input[type=password],
input[type=text],
input[type=url],
textarea {
  resize: none;
  outline: none;
  width: 100%;
  display: block;
  box-shadow: none;
  border: 1px solid #ddd;
  border-radius: 2px;
  transition: border .3s;
  background-color: #fff;
  box-sizing: border-box;
}
.aside-top-section {
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  margin-bottom: 1.3rem;
  font-size: 1.16rem;
  line-height: 1.29;
  color: #333;
}
.aside-top-section .aside-header {
  padding: 1rem 1.3rem;
  border-bottom: 1px solid rgba(151, 151, 151, 0.1);
  color: #333;
  font-size: 1.16rem;
}
.aside-top-section .aside-list {
  padding: 1rem 1.3rem;
}
.aside-top-section .aside-list .item {
  margin-bottom: 1.5rem;
}
.request-health-alert[data-v-ded0787a] {
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  padding: 1rem;
  max-width: 50%;
  color: #e33;
  background-color: #f6e3e3;
  border: 1px solid #e99;
  z-index: 10000;
}
@media (max-width: 600px) {
  .request-health-alert[data-v-ded0787a] {
    display: none;
  }
}
.title[data-v-ded0787a] {
  margin: 0 0 .4em;
  font-size: 1.5em;
}
.content[data-v-ded0787a] {
  line-height: 1.5;
}
.btn[data-v-ded0787a] {
  color: inherit;
  text-decoration: underline;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.close[data-v-ded0787a] {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  opacity: 0.5;
}
.close[data-v-ded0787a]:hover {
  opacity: 1;
}
.emoji-barrage .full-screen[data-v-68506677] {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  overflow: hidden;
}
.emoji-inner-screen[data-v-68506677] {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate3d(-100%, -100%, 0);
}
.emoji-inner-screen .template[data-v-68506677] {
  position: relative;
  width: 100%;
  height: 100%;
}
.emojin-inner-screen__0.animate[data-v-68506677] {
  -webkit-animation: left-data-v-68506677 6s ease-in;
  animation: left-data-v-68506677 6s ease-in;
}
.emojin-inner-screen__1.animate[data-v-68506677] {
  -webkit-animation: 6s ease-in normal-data-v-68506677;
  animation: 6s ease-in normal-data-v-68506677;
}
.emojin-inner-screen__2.animate[data-v-68506677] {
  -webkit-animation: right-data-v-68506677 6s ease-in;
  animation: right-data-v-68506677 6s ease-in;
}
@-webkit-keyframes left-data-v-68506677 {
  0% {
    transform: translate3d(-50%, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes left-data-v-68506677 {
  0% {
    transform: translate3d(-50%, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes normal-data-v-68506677 {
  0% {
    transform: translate3d(0, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes normal-data-v-68506677 {
  0% {
    transform: translate3d(0, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes right-data-v-68506677 {
  0% {
    transform: translate3d(50%, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes right-data-v-68506677 {
  0% {
    transform: translate3d(50%, -100%, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
}
.modal-mask[data-v-5f0a982f] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 501;
}
.bind-phone-number-form[data-v-5f0a982f] {
  position: fixed;
  padding: 1.83rem 2.08rem;
  width: 26.5rem;
  max-width: 100%;
  font-size: 1.167rem;
  background-color: #fff;
  border-radius: 3px;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  z-index: 502;
  transform: translate(-50%, -60%);
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.close-btn[data-v-5f0a982f] {
  float: right;
  cursor: pointer;
  opacity: 0.4;
}
.close-btn[data-v-5f0a982f]:hover {
  opacity: 1;
}
.title[data-v-5f0a982f] {
  font-size: 1.42rem;
  color: #000;
  font-weight: 600;
  margin: 0 0 1rem;
}
.hint[data-v-5f0a982f] {
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 400;
  color: #000;
  margin-bottom: 2rem;
}
.hint > a[data-v-5f0a982f] {
  color: #007fff;
}
.input-group[data-v-5f0a982f] {
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.input-box[data-v-5f0a982f] {
  position: relative;
  margin-bottom: 0.8rem;
}
.input[data-v-5f0a982f] {
  padding: .67rem;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
}
.input[data-v-5f0a982f]:focus {
  border-color: #007fff;
}
.btn[data-v-5f0a982f] {
  width: 100%;
  height: 2.92rem;
  color: #fff;
  background-color: #007fff;
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
}
.btn[data-v-5f0a982f]:disabled {
  background-color: #909090;
  cursor: default;
}
.vcode-box[data-v-5f0a982f] {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vcode-box .input[data-v-5f0a982f] {
  width: auto;
  flex-grow: 1;
  overflow: hidden;
}
.vcode-box .img-vcode[data-v-5f0a982f] {
  border: 1px solid #ddd;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 0;
  width: 160px;
  color: #333;
  height: 40px;
  margin-left: 15px;
  flex-shrink: 0;
}
.vcode-box .img-vcode img[data-v-5f0a982f] {
  max-height: 46px;
}
.vcode-box .img-vcode .hint[data-v-5f0a982f] {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.send-vcode-btn[data-v-5f0a982f] {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  color: #007fff;
  font-size: 1.25rem;
  line-height: 1;
  background-color: transparent;
}
.send-vcode-btn[data-v-5f0a982f]:disabled {
  color: #909090;
  cursor: default;
}
.send-vcode-btn[data-v-5f0a982f]:hover(:not(:disabled)) {
  opacity: 0.8;
}
.masker-fade-enter-active[data-v-5f0a982f],
.masker-fade-leave-active[data-v-5f0a982f] {
  transition: opacity 0.3s;
}
.masker-fade-enter[data-v-5f0a982f],
.masker-fade-leave-to[data-v-5f0a982f] {
  opacity: 0;
}
.form-fade-enter-active[data-v-5f0a982f],
.form-fade-leave-active[data-v-5f0a982f] {
  transition: 0.3s;
}
.form-fade-enter[data-v-5f0a982f],
.form-fade-leave-to[data-v-5f0a982f] {
  transform: translate(-50%, -52%);
  opacity: 0;
}
@font-face {
  font-family: iconfont;
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358);
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358#iefix) format("embedded-opentype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.woff?t=1470110358) format("woff"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.ttf?t=1470110358) format("truetype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.svg?t=1470110358#iconfont) format("svg");
}
.iconfont[data-v-3c33b992] {
  font-family: iconfont!important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-xlcollection[data-v-3c33b992]:before {
  content: "\e600";
}
.icon-xlchatbox[data-v-3c33b992]:before {
  content: "\e601";
}
.column-view[data-v-3c33b992] {
  padding: 0 0 8rem;
}
.main-area[data-v-3c33b992] {
  position: relative;
  width: 700px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.main-area[data-v-3c33b992]:after {
  display: table;
  content: "";
  clear: both;
}
.article-area[data-v-3c33b992] {
  margin-bottom: 1.5rem;
  padding: 0 2rem;
}
.article[data-v-3c33b992] {
  margin-bottom: 3rem;
  padding: 2rem 0 0;
}
.article-placeholder[data-v-3c33b992] {
  width: 100%;
}
.author-info-block[data-v-3c33b992] {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.author-info-block .avatar-link[data-v-3c33b992] {
  font-size: 0;
}
.author-info-block .avatar[data-v-3c33b992] {
  flex: 0 0 auto;
  margin-right: 1rem;
  width: 3.333rem;
  height: 3.333rem;
  border-radius: 50%;
}
.author-info-block .author-info-box[data-v-3c33b992] {
  min-width: 0;
  flex-grow: 1;
  flex: 1;
}
.author-info-block .username[data-v-3c33b992] {
  display: inline-block;
  width: 100%;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}
.author-info-block .meta-box[data-v-3c33b992] {
  font-size: 1.1rem;
  color: #909090;
}
.author-info-block .time[data-v-3c33b992] {
  letter-spacing: 1px;
}
.author-info-block .views-count[data-v-3c33b992] {
  margin-left: 0.5em;
}
.author-info-block .dot[data-v-3c33b992] {
  margin: 0 0.5em;
}
@media (max-width: 600px) {
  .author-info-block .dot[data-v-3c33b992] {
    margin: 0 0.2em;
  }
}
@media (max-width: 600px) {
  .author-info-block .follow[data-v-3c33b992] {
    margin-top: 12px;
  }
}
.author-info-block .edit-btn[data-v-3c33b992] {
  color: #1264b6;
  cursor: pointer;
}
.author-info-block .edit-btn[data-v-3c33b992]:hover {
  text-decoration: underline;
}
.article-hero[data-v-3c33b992] {
  margin-bottom: 2rem;
  width: 100%;
}
.article-hero[data-v-3c33b992]:after {
  content: "";
  display: block;
  padding-top: 56.29%;
  width: 100%;
  pointer-events: none;
}
.article-title[data-v-3c33b992] {
  margin: .67em 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.5;
}
@media (max-width: 600px) {
  .article-title[data-v-3c33b992] {
    font-size: 2rem;
  }
}
.tag-list-box[data-v-3c33b992] {
  margin-bottom: 2rem;
}
.tag-list-box .tag-list-title[data-v-3c33b992] {
  margin-bottom: 2rem;
  padding: 0 0 0 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  border-left: 6px solid #ddd;
}
.tag-list-box .tag-list[data-v-3c33b992] {
  display: flex;
  flex-wrap: wrap;
}
.tag-list-box .tag-list .item[data-v-3c33b992] {
  display: flex;
  align-items: center;
  margin: 0 1.25rem 1rem 0;
  padding: .167rem;
  background-color: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 2px;
}
.tag-list-box .tag-list .tag-icon[data-v-3c33b992] {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 2px;
}
@media (max-width: 600px) {
  .tag-list-box .tag-list .tag-icon[data-v-3c33b992] {
    display: none;
  }
}
.tag-list-box .tag-list .tag-title[data-v-3c33b992] {
  padding: 0 .75rem;
  font-size: 1rem;
  line-height: 1.75rem;
  color: #919191;
}
.wechat-banner[data-v-3c33b992] {
  margin-bottom: 2rem;
}
@media (min-width: 960px) {
  .wechat-banner[data-v-3c33b992] {
    display: none;
  }
}
.book-box[data-v-3c33b992] {
  margin-bottom: 2rem;
}
@media (min-width: 960px) {
  .book-box[data-v-3c33b992] {
    display: none;
  }
}
.footer-author-block[data-v-3c33b992] {
  padding: 15px 17px;
  border-radius: 2px;
  background-color: #f4f5f5;
  margin-bottom: 2rem;
}
@media (max-width: 600px) {
  .footer-author-block[data-v-3c33b992] {
    padding: 15px 1rem;
  }
}
.article-banner[data-v-3c33b992] {
  margin-bottom: 2.5rem;
  padding: 0 0 0 2rem;
  border-left: 6px solid #ddd;
}
.article-banner .banner-title[data-v-3c33b992] {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #007fff;
}
.article-banner .banner-content[data-v-3c33b992] {
  margin-top: .2rem;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #909090;
}
.comment-box[data-v-3c33b992] {
  padding: 0 2rem;
}
.comment-box.extended[data-v-3c33b992] {
  padding-bottom: 2rem;
}
@media (max-width: 600px) {
  .comment-box[data-v-3c33b992] {
    padding: 0;
  }
}
.comment-box .comment-title[data-v-3c33b992] {
  margin-bottom: 1.3rem;
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;
  color: #909090;
}
.comment-box .comment-form[data-v-3c33b992] {
  margin-bottom: 1rem;
}
.recommended-entry-list-title[data-v-3c33b992] {
  padding: 1.3rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #909090;
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
}
.sidebar[data-v-3c33b992] {
  position: absolute;
  top: 0;
  right: 0;
  width: 20rem;
}
.article-suspended-panel[data-v-3c33b992] {
  position: fixed;
  margin-left: -7rem;
  top: 16rem;
}
.action-bar[data-v-3c33b992] {
  position: fixed;
  z-index: 1;
  bottom: 0;
  width: 100%;
}
@media (max-width: 960px) {
  .sidebar[data-v-3c33b992] {
    display: none;
  }
  .main-area[data-v-3c33b992] {
    width: 100%;
  }
  .article-area[data-v-3c33b992] {
    margin-bottom: 0;
  }
  .open-in-app[data-v-3c33b992] {
    bottom: 6rem;
  }
}
.border[data-v-3c33b992] {
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
}
.main-header-box[data-v-6a3e47cf] {
  position: relative;
  height: 5rem;
}
.main-header[data-v-6a3e47cf] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all .2s;
  transform: translate3d(0, -100%, 0);
}
.main-header.visible[data-v-6a3e47cf] {
  transform: translateZ(0);
}
.main-container > .view[data-v-6a3e47cf] {
  margin-top: 1.767rem;
}
.main-container.with-view-nav > .view[data-v-6a3e47cf] {
  margin-top: 4.67rem;
}
.main-container.tight > .view[data-v-6a3e47cf] {
  margin-top: 0;
}
.main-container.tight.with-view-nav > .view[data-v-6a3e47cf] {
  margin-top: 3.833rem;
}
@font-face {
  font-family: iconfont;
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358);
  src: url(https://b-gold-cdn.xitu.io/fonts/iconfont.eot?t=1470110358#iefix) format("embedded-opentype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.woff?t=1470110358) format("woff"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.ttf?t=1470110358) format("truetype"), url(https://b-gold-cdn.xitu.io/fonts/iconfont.svg?t=1470110358#iconfont) format("svg");
}
.iconfont[data-v-20709686] {
  font-family: iconfont!important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-xlcollection[data-v-20709686]:before {
  content: "\e600";
}
.icon-xlchatbox[data-v-20709686]:before {
  content: "\e601";
}
.logo[data-v-20709686] {
  min-width: 98px;
  margin-right: 2rem;
}
.nav-item a[data-v-20709686] {
  color: #71777c;
}
.nav-item.active > .icon[data-v-20709686],
.nav-item.active > a[data-v-20709686] {
  color: #007fff;
}
.nav-item.discount[data-v-20709686]:after {
  content: "";
  position: absolute;
  width: 35px;
  height: 28px;
  background: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/half_discount.3daad5d.gif);
  background-size: 35px 28px;
  right: -14px;
  top: 10px;
}
.nav-menu-item > a[data-v-20709686] {
  display: block;
  color: #71777c;
}
.avatar[data-v-20709686] {
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
}
.avatar[data-v-20709686],
.badge[data-v-20709686] {
  border-radius: 50%;
}
.badge[data-v-20709686] {
  position: absolute;
  top: 10px;
  right: -5px;
  width: 11px;
  height: 11px;
  background-color: #2f74e9;
}
.main-header[data-v-20709686] {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
  height: 5rem;
  z-index: 250;
}
.main-header .container[data-v-20709686] {
  max-width: 960px;
  margin: auto;
}
.container[data-v-20709686] {
  display: flex;
  align-items: center;
  height: 100%;
}
.main-nav[data-v-20709686] {
  height: 100%;
  flex: 1 0 auto;
}
.main-nav-list[data-v-20709686] {
  display: flex;
}
.phone-show-menu[data-v-20709686] {
  cursor: pointer;
  display: none;
}
.phone-hide[data-v-20709686] {
  display: flex;
}
.nav-list[data-v-20709686] {
  justify-content: flex-end;
  position: relative;
}
.nav-item[data-v-20709686],
.nav-list[data-v-20709686] {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0;
}
.nav-item[data-v-20709686] {
  color: #71777c;
  padding: 0 1.2rem;
  font-size: 1.33rem;
  justify-content: center;
  cursor: pointer;
}
.nav-item.activities .tip[data-v-20709686] {
  z-index: 2;
  cursor: auto;
  width: 17rem;
  background: #fff;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 4.5rem;
  left: -50%;
  margin-left: -3.7rem;
  color: #17181a;
  font-size: 15px;
  border-radius: 2px;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.12);
}
.nav-item.activities .tip .panfish[data-v-20709686] {
  height: 63px;
  width: 57px;
  flex: 0 0 auto;
  background-repeat: no-repeat;
  background-size: contain;
}
.nav-item.activities .tip .content[data-v-20709686] {
  display: flex;
  flex-direction: column;
  padding: .5rem 0 0 .5rem;
  color: #17181a;
}
.nav-item.activities .tip .content button[data-v-20709686] {
  padding: 0;
  width: 6.41rem;
  height: 2rem;
  color: #fff;
  font-size: 13px;
  border-radius: 12px;
  margin-top: 0.5rem;
}
.nav-item.activities .tip .triangle[data-v-20709686] {
  display: block;
  position: absolute;
  top: 0;
  left: 50%;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%, -50%) rotate(45deg);
  background: #fff;
  border-top: 1px solid #f4f5f5;
  border-left: 1px solid #f4f5f5;
}
.nav-item.activities .tip .close[data-v-20709686] {
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: .5rem;
  right: .5rem;
  border-radius: 50%;
  background: #fff;
  transform: rotate(45deg);
}
.nav-item.activities .tip .close[data-v-20709686]:after,
.nav-item.activities .tip .close[data-v-20709686]:before {
  content: "";
  width: .8rem;
  height: 2px;
  display: block;
  position: absolute;
  background: #c5c5c5;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.nav-item.activities .tip .close[data-v-20709686]:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.nav-item.activities .tip .close[data-v-20709686]:hover {
  opacity: 0.8;
}
.nav-item .login-button[data-v-20709686] {
  border: 1px solid #007fff;
  background-color: #fff;
  padding: .3rem 1.6rem;
  color: #007fff;
  line-height: 1.9rem;
}
.nav-item:hover > a[data-v-20709686] {
  color: #007fff;
}
.nav-item[data-v-20709686]:last-child {
  padding-right: 0;
}
.nav-item.link-item[data-v-20709686] {
  padding: 0 1.5rem;
  height: 5rem;
}
.nav-item.book.new-year a[data-v-20709686]:after {
  left: 0;
  top: 0;
  position: absolute;
  content: "";
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 60px auto;
  width: 100%;
  height: 100%;
}
.nav-item.search[data-v-20709686] {
  flex: 1 1 auto;
  justify-content: flex-end;
  cursor: auto;
}
.nav-item.add[data-v-20709686] {
  cursor: default;
}
.nav-item.notification:hover .icon[data-v-20709686] {
  color: #007fff;
}
.nav-item.menu[data-v-20709686],
.nav-item.submit[data-v-20709686] {
  position: relative;
}
.nav-item.submit[data-v-20709686] {
  color: #007fff;
}
.nav-item.submit[data-v-20709686]:hover {
  color: #0371df;
}
.nav-item.submit[data-v-20709686]:after {
  content: "|";
  position: absolute;
  top: 20px;
  left: 100%;
  color: rgba(151, 151, 151, 0.4);
}
.nav-item.submit .submit-panel[data-v-20709686] {
  position: absolute;
  top: 101%;
  left: -123px;
  width: 326px;
  box-sizing: border-box;
  padding: 2.5rem 2rem;
  border-radius: 2px;
  color: #909090;
  font-size: 1.1rem;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(178, 181, 187, 0.5);
  cursor: default;
  z-index: 11;
}
.nav-item.submit .submit-panel[data-v-20709686]:before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 1rem;
  height: 1rem;
  border-top: 1px solid rgba(178, 181, 187, 0.5);
  border-left: 1px solid rgba(178, 181, 187, 0.5);
  background-color: #fff;
  transform: rotate(45deg) translate(-50%, -50%);
  transform-origin: 0 0;
}
.nav-item.submit .submit-panel .title[data-v-20709686] {
  font-size: 1.4rem;
  line-height: 1;
  font-weight: 700;
  color: #000;
  text-align: center;
  margin-bottom: 2rem;
}
.nav-item.submit .submit-panel .benefit-list[data-v-20709686] {
  margin-left: 2rem;
}
.nav-item.submit .submit-panel .item[data-v-20709686] {
  list-style: disc outside none;
  list-style: initial;
  margin-bottom: 1rem;
}
.nav-item.submit .submit-panel .link[data-v-20709686] {
  color: #6cbd45;
  text-decoration: underline;
}
.nav-item.submit .submit-panel button[data-v-20709686] {
  display: block;
  margin: 2rem auto 0;
  background-color: #83c73a;
  font-size: 1.2rem;
  padding: 1rem 4rem;
}
.nav-item.auth[data-v-20709686] {
  color: #007fff;
  padding: 0;
}
.nav-item.auth span[data-v-20709686]:hover {
  color: #0371df;
}
.nav-item.auth .login[data-v-20709686]:after {
  content: "·";
  margin: 0 0.4rem;
}
.nav-item .icon[data-v-20709686] {
  font-size: 2rem;
  color: #71777c;
}
.nav-item .icon[data-v-20709686]:hover {
  color: #007fff;
}
.submit-fixed-bg[data-v-20709686] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  z-index: 10;
}
.search-form[data-v-20709686] {
  border: 1px solid rgba(151, 151, 151, 0.2);
  background-color: rgba(227, 231, 236, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px;
}
.search-form.active[data-v-20709686] {
  background-color: #fff;
  border: 1px solid #007fff;
}
.search-form .search-icon[data-v-20709686] {
  padding: 0 .5rem;
  cursor: pointer;
}
.search-form .search-input[data-v-20709686] {
  border: none;
  width: 11rem;
  padding: .6rem 0 .6rem 1rem;
  box-shadow: none;
  outline: none;
  font-size: 1.1rem;
  color: #666;
  background-color: transparent;
}
.nav-menu[data-v-20709686] {
  position: absolute;
  width: 11rem;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(177, 180, 185, 0.45);
  border-radius: 4px;
  font-size: 1.2rem;
}
.nav-menu .nav-menu-item-group[data-v-20709686] {
  padding: 1rem 0;
}
.nav-menu .nav-menu-item[data-v-20709686] {
  font-size: 1.3rem;
  cursor: pointer;
}
.nav-menu .nav-menu-item[data-v-20709686]:hover {
  background-color: rgba(242, 242, 242, 0.5);
}
.nav-menu .nav-menu-item > a[data-v-20709686] {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}
.nav-menu .nav-menu-item > a > span[data-v-20709686] {
  margin-left: 0;
  flex-grow: 1;
}
.nav-menu .nav-menu-item > a.link-icon[data-v-20709686] {
  padding-right: 0.5rem;
}
.nav-menu .nav-menu-item .collect[data-v-20709686],
.nav-menu .nav-menu-item .zan[data-v-20709686] {
  margin-right: .8rem;
  width: 18.72px;
  height: 18px;
}
.nav-menu .nav-menu-item .icon-2018[data-v-20709686] {
  width: 38px;
  height: 20px;
  border-radius: 1rem;
  margin-left: 2px;
  background-image: url(https://gold-cdn.xitu.io/asset/2018/2018-icon.png);
  background-size: 102% 100%;
  background-repeat: no-repeat;
  box-shadow: 3px 3px 6px -3px #999;
}
.nav-menu .nav-menu-item .icon-2018[data-v-20709686]:hover {
  opacity: 0.9;
}
.nav-menu .more[data-v-20709686] {
  position: relative;
}
.nav-menu .more:hover .more-dropdown-list[data-v-20709686] {
  display: block;
}
.nav-menu .more .more-icon[data-v-20709686] {
  float: right;
  color: #b2bac2;
  font-size: 1.2rem;
  line-height: 2rem;
}
.nav-menu.user-dropdown-list[data-v-20709686] {
  width: 13.1rem;
  right: 0;
  left: auto;
  transform: translateX(0);
}
.nav-menu.user-dropdown-list .nav-menu-item-group[data-v-20709686]:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
.add-group[data-v-20709686] {
  display: flex;
  align-items: center;
  position: relative;
  height: 2.667rem;
  cursor: pointer;
}
.add-group.active .more-list[data-v-20709686] {
  display: block;
}
.add-group .add-btn[data-v-20709686],
.add-group .more[data-v-20709686] {
  height: 100%;
  color: #fff;
  background-color: #007fff;
  border-radius: 3px;
}
.add-group .add-btn.active[data-v-20709686],
.add-group .add-btn[data-v-20709686]:hover,
.add-group .more.active[data-v-20709686],
.add-group .more[data-v-20709686]:hover {
  background-color: #0876e4;
}
.add-group .add-btn[data-v-20709686] {
  padding: 0 .9rem;
  font-size: 1.167rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.add-group .more[data-v-20709686] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.add-group .more .more-icon[data-v-20709686] {
  margin-top: .2rem;
  font-size: 1rem;
}
.add-group .more-list[data-v-20709686] {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: .417rem 0;
  font-size: 1.167rem;
  color: #3b76c5;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: none;
  z-index: 1;
}
.add-group .more-list .item[data-v-20709686] {
  padding: 0 0 0 .8rem;
  line-height: 1.9;
}
.add-group .more-list .item[data-v-20709686]:hover {
  background-color: #f9f9f9;
}
.more-dropdown-list[data-v-20709686] {
  position: absolute;
  left: auto;
  top: 0;
  right: 102%;
  transform: translateX(0);
  display: none;
}
.more-dropdown-list[data-v-20709686]:after {
  content: "";
  position: absolute;
  top: 0;
  left: 100%;
  width: 1.3rem;
  height: 4rem;
}
.notification[data-v-20709686] {
  position: relative;
}
.notification.active .icon[data-v-20709686] {
  color: #007fff;
}
.notification .count[data-v-20709686] {
  position: absolute;
  left: 50%;
  bottom: 43%;
  margin: 0;
  font-size: 1rem;
  line-height: 1;
  text-align: center;
  background-color: #007fff;
  border-radius: 3rem;
  word-break: normal;
  display: inline-block;
  color: #f1f1f1;
  transform: scale(0.8);
  font-size: 13px;
  font-weight: 500;
  padding: 3px 6px;
  background: #f03535;
  border-radius: 100px;
  border: 2px solid #fff;
}
.fengwei[data-v-20709686] {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: .8rem;
  font-size: 1.2em;
  vertical-align: middle;
  color: #b2bac2;
}
.fix-bg[data-v-20709686] {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
}
.mobile[data-v-20709686] {
  display: none;
}
@media (max-width: 980px) {
  .logo[data-v-20709686] {
    margin-right: 0;
    margin-left: 0.67rem;
  }
  .container[data-v-20709686] {
    width: 96%;
  }
  .main-nav-list[data-v-20709686] {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
  .phone-show-menu[data-v-20709686] {
    height: 5rem;
    display: flex;
    align-items: center;
    color: #007fff;
    font-size: 1.33rem;
    justify-content: center;
    padding: 0;
    width: 5.66rem;
  }
  .phone-show-menu span[data-v-20709686] {
    margin-right: 0.6rem;
  }
  .phone-hide[data-v-20709686] {
    display: none;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(177, 180, 185, 0.45);
    border-radius: 4px;
    font-size: 1.2rem;
  }
  .phone-hide.show[data-v-20709686] {
    display: block;
  }
  .nav-item.link-item[data-v-20709686] {
    height: 4rem;
  }
  .nav-item.add[data-v-20709686],
  .nav-item.submit[data-v-20709686],
  .pinTip[data-v-20709686] {
    display: none;
  }
  .tip[data-v-20709686] {
    display: none !important;
  }
  .nav-menu .nav-menu-item .icon-2018[data-v-20709686] {
    width: 35px;
    margin-left: 0;
  }
}
@media (max-width: 700px) {
  .nav-item.search[data-v-20709686] {
    display: flex;
    padding-right: 1.2rem;
  }
  .nav-item .search-form .search-input[data-v-20709686] {
    width: 11rem;
    padding: 0.6rem;
  }
  .nav-item .search-form .search-icon[data-v-20709686] {
    display: none;
  }
  .logo[data-v-20709686] {
    min-width: 3.75rem;
  }
  .logo-img[data-v-20709686] {
    display: none;
  }
  .mobile[data-v-20709686] {
    display: block;
  }
  .notification[data-v-20709686] {
    padding: 0 0.8rem;
  }
}
@media (max-width: 375px) {
  .nav-item .search-form .search-input[data-v-20709686] {
    width: 10rem;
  }
}
@media (max-width: 330px) {
  .nav-item.search[data-v-20709686] {
    display: none;
  }
  .nav-item.search .search-form .search-input[data-v-20709686] {
    width: 5rem;
  }
}
.tip-fade-enter-active[data-v-20709686],
.tip-fade-leave-active[data-v-20709686] {
  transition: 0.3s;
}
.tip-fade-enter[data-v-20709686],
.tip-fade-leave-to[data-v-20709686] {
  transform: translateY(-10px);
  opacity: 0;
}
.avatar[data-v-1c418ef0] {
  display: inline-block;
  position: relative;
  background-size: cover;
  background-color: #eee;
}
.avatar[data-v-1c418ef0],
.avatar.xmas[data-v-1c418ef0]:after {
  background-position: 50%;
  background-repeat: no-repeat;
}
.avatar.xmas[data-v-1c418ef0]:after {
  content: "";
  position: absolute;
  left: 25%;
  bottom: 30%;
  width: 90%;
  height: 90%;
  background-size: contain;
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/hats.12a740a.svg);
  transform: rotate(15deg);
  transform-origin: bottom right;
  transition: all 0.2s;
}
.avatar.xmas[data-v-1c418ef0]:hover:after {
  transform: rotate(20deg);
}
.lazy[data-v-47cc2604] {
  position: relative;
}
.lazy[data-v-47cc2604]:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: inherit;
  border-radius: inherit;
}
.lazy[data-v-47cc2604]:not(.immediate):before {
  transition: opacity 0.2s;
}
.lazy.loaded[data-v-47cc2604]:before {
  opacity: 0;
  pointer-events: none;
}
.username[data-v-7ffb1b68] {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2e3135;
}
.username .name[data-v-7ffb1b68] {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recommend-author-block .username .name[data-v-7ffb1b68] {
  max-width: 130px;
}
.recommendation-index-view .username .name[data-v-7ffb1b68] {
  max-width: 200px;
}
.follow-button[data-v-7828ec04] {
  margin: 0 0 0 auto;
  padding: 0;
  width: 55px;
  height: 26px;
  font-size: 13px;
  border: 1px solid #6cbd45;
  color: #6cbd45;
  background-color: #fff;
}
.follow-button[data-v-7828ec04]:hover {
  opacity: 0.8;
}
.follow-button.followed[data-v-7828ec04] {
  color: #fff;
  border-color: #6cbd45;
  background-color: #6cbd45;
}
.thumb[data-v-7b344634] {
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
}
[data-v-78c9b824] .image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}
[data-v-78c9b824] .image-viewer.loading:after {
  content: "";
  position: absolute;
  top: 0;
  right: 100%;
  width: 50%;
  height: .2rem;
  background-color: #007fff;
  z-index: 1;
  -webkit-animation: pro-data-v-78c9b824 1s ease-in-out infinite;
  animation: pro-data-v-78c9b824 1s ease-in-out infinite;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
@-webkit-keyframes pro-data-v-78c9b824 {
  0% {
    transform: translateZ(0);
  }
  to {
    transform: translate3d(300%, 0, 0);
  }
}
@keyframes pro-data-v-78c9b824 {
  0% {
    transform: translateZ(0);
  }
  to {
    transform: translate3d(300%, 0, 0);
  }
}
.panel-btn[data-v-19356a56] {
  position: relative;
  margin-bottom: .75rem;
  width: 3rem;
  height: 3rem;
  background-color: #fff;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  cursor: pointer;
}
.panel-btn:not(.share-btn).active.with-badge[data-v-19356a56]:after {
  background-color: #74ca46;
}
.panel-btn.with-badge[data-v-19356a56]:after {
  content: attr(badge);
  position: absolute;
  top: 0;
  left: 75%;
  padding: .1rem .4rem;
  font-size: 1rem;
  text-align: center;
  line-height: 1;
  white-space: nowrap;
  color: #fff;
  background-color: #b2bac2;
  border-radius: .7rem;
  transform-origin: left top;
  transform: scale(0.75);
}
.panel-btn.like-btn[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
}
.panel-btn.like-btn[data-v-19356a56]:hover {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
}
.panel-btn.like-btn.active[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiM2Q0JENDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
}
.panel-btn.like-btn.like-adjust[data-v-19356a56] {
  background-position: 53% 46%;
}
.panel-btn.comment-btn[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDE0IDEzIj4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDB2OS4yM0g4LjgxNUwzLjM3IDEzVjkuMjNIMFYweiIvPgo8L3N2Zz4K);
}
.panel-btn.comment-btn[data-v-19356a56]:hover {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDE0IDEzIj4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDB2OS4yM0g4LjgxNUwzLjM3IDEzVjkuMjNIMFYweiIvPgo8L3N2Zz4K);
}
.panel-btn.comment-btn.comment-adjust[data-v-19356a56] {
  background-position: 50% 55%;
}
.panel-btn.collect-btn[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
}
.panel-btn.collect-btn[data-v-19356a56]:hover {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
}
.panel-btn.collect-btn.active[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiNGRkMzNDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
}
.panel-btn.weibo-btn[data-v-19356a56] {
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/weibo.2076a57.svg);
}
.panel-btn.weibo-btn[data-v-19356a56]:hover {
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/weibo-hover.9abf502.svg);
}
.panel-btn.qq-btn[data-v-19356a56] {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE1IDE2Ij4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0LjQ2OCAxMC4zMTJjLS4wMS0uOTU3LS4zOC0xLjQ3Ni0uODA3LTIuMTUzLS4xOTEtLjI4My0uNDEzLS40NzMtLjYwNS0uNzU1LS4wMy0uMTU0LjAzMy0uMjY4LS4wMTItLjY3MS0uMDQyLS42MDQtLjI2My0uODM4LS4zMS0uOTEyLjAyLS4xNi0uMDQzLTEuNDg1LS41MjMtMi4yNjhDMTAuNzUxLjk0MSA3Ljk4Mi44NDYgNy42NDMuODQ0SDcuNjRjLS4zMzkuMDAyLTMuMTA3LjA5Ny00LjU2OCAyLjcxLS40NzkuNzgyLS41NDMgMi4xMDYtLjUyMyAyLjI2Ny0uMDQ2LjA3NC0uMjY3LjMwOC0uMzEuOTEyLS4wNDQuNDAzLjAxOC41MTctLjAxMi42Ny0uMTkyLjI4NC0uNDEzLjQ3My0uNjA1Ljc1Ni0uNDI2LjY3Ny0uNzk3IDEuMTk2LS44MDYgMi4xNTMtLjAwNy43MTQuMTYyIDEuNjg3LjY2MyAxLjcuMTU4LS4wMTIuMjkyLS4xMTcuNTY2LS40MjQuMDgyLS4wOTIuMzctLjQ4LjQyOS0uNTg3LjA1Ni4xNDguMTkgMS4xODMgMS4xMiAxLjcyMy0uOTU2LjQ1LTEuNDI0LjczNS0xLjQ0IDEuMzE5LjAyLjMzOC40MjMuNzg3IDEuMTY1Ljk5NmE2LjA1IDYuMDUgMCAwIDAgMi45MjcuMDVjLjUzNS0uMTMuNjk2LS4yNiAxLjM5Ni0uNjQ0LjcuMzg1Ljg2LjUxNCAxLjM5NS42NDNhNi4wNTIgNi4wNTIgMCAwIDAgMi45MjctLjA0OWMuNzQyLS4yMDkgMS4xNDYtLjY1OCAxLjE2Ni0uOTk2LS4wMTYtLjU4NC0uNDg0LS44Ny0xLjQ0LTEuMzIuOTMtLjUzOCAxLjA2My0xLjU3NCAxLjEyLTEuNzIyLjA1OC4xMDcuMzQ2LjQ5NS40MjguNTg3LjI3NC4zMDcuNDA5LjQxMi41NjcuNDI0LjUtLjAxMy42Ny0uOTg2LjY2My0xLjd6Ii8+Cjwvc3ZnPgo=);
}
.panel-btn.qq-btn[data-v-19356a56]:hover {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE1IDE2Ij4KICAgIDxwYXRoIGZpbGw9IiM1NUIyRjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0LjQ2OCAxMC4zMTJjLS4wMS0uOTU3LS4zOC0xLjQ3Ni0uODA3LTIuMTUzLS4xOTEtLjI4My0uNDEzLS40NzMtLjYwNS0uNzU1LS4wMy0uMTU0LjAzMy0uMjY4LS4wMTItLjY3MS0uMDQyLS42MDQtLjI2My0uODM4LS4zMS0uOTEyLjAyLS4xNi0uMDQzLTEuNDg1LS41MjMtMi4yNjhDMTAuNzUxLjk0MSA3Ljk4Mi44NDYgNy42NDMuODQ0SDcuNjRjLS4zMzkuMDAyLTMuMTA3LjA5Ny00LjU2OCAyLjcxLS40NzkuNzgyLS41NDMgMi4xMDYtLjUyMyAyLjI2Ny0uMDQ2LjA3NC0uMjY3LjMwOC0uMzEuOTEyLS4wNDQuNDAzLjAxOC41MTctLjAxMi42Ny0uMTkyLjI4NC0uNDEzLjQ3My0uNjA1Ljc1Ni0uNDI2LjY3Ny0uNzk3IDEuMTk2LS44MDYgMi4xNTMtLjAwNy43MTQuMTYyIDEuNjg3LjY2MyAxLjcuMTU4LS4wMTIuMjkyLS4xMTcuNTY2LS40MjQuMDgyLS4wOTIuMzctLjQ4LjQyOS0uNTg3LjA1Ni4xNDguMTkgMS4xODMgMS4xMiAxLjcyMy0uOTU2LjQ1LTEuNDI0LjczNS0xLjQ0IDEuMzE5LjAyLjMzOC40MjMuNzg3IDEuMTY1Ljk5NmE2LjA1IDYuMDUgMCAwIDAgMi45MjcuMDVjLjUzNS0uMTMuNjk2LS4yNiAxLjM5Ni0uNjQ0LjcuMzg1Ljg2LjUxNCAxLjM5NS42NDNhNi4wNTIgNi4wNTIgMCAwIDAgMi45MjctLjA0OWMuNzQyLS4yMDkgMS4xNDYtLjY1OCAxLjE2Ni0uOTk2LS4wMTYtLjU4NC0uNDg0LS44Ny0xLjQ0LTEuMzIuOTMtLjUzOCAxLjA2My0xLjU3NCAxLjEyLTEuNzIyLjA1OC4xMDcuMzQ2LjQ5NS40MjguNTg3LjI3NC4zMDcuNDA5LjQxMi41NjcuNDI0LjUtLjAxMy42Ny0uOTg2LjY2My0xLjd6Ii8+Cjwvc3ZnPgo=);
}
.panel-btn.wechat-btn[data-v-19356a56] {
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/wechat.63e1ce0.svg);
}
.panel-btn.wechat-btn[data-v-19356a56]:hover {
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/wechat-hover.c8ce019.svg);
}
.panel-btn.wechat-btn:hover .wechat-qr-code-img[data-v-19356a56] {
  display: block;
}
.share-title[data-v-19356a56] {
  margin: 2.5rem 0 1rem;
  font-size: 1rem;
  text-align: center;
  color: #c6c6c6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.wechat-qr-code-img[data-v-19356a56] {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 8rem;
  height: 8rem;
  margin-top: 1rem;
  border: .5rem solid #fff;
  transform: translateX(-50%);
  display: none;
}
.extension[data-v-7e9c74a6] {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 180px;
  cursor: pointer;
  display: none;
}
.extension[data-v-7e9c74a6]:before {
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 0;
  height: 148px;
  z-index: -1;
  content: "";
  background-color: #fff;
}
.extension .link[data-v-7e9c74a6] {
  width: 100%;
  height: 100%;
  color: #000;
  background-repeat: no-repeat;
  background-image: url(//s3.pstatp.com/toutiao/xitu_juejin_web/img/extension.c1307da.png);
  background-position: bottom;
  background-size: auto 180px;
  image-rendering: -webkit-optimize-contrast;
}
.extension .link .price[data-v-7e9c74a6] {
  margin-left: 5px;
  margin-right: 5px;
  color: #007fff;
}
.extension .link .description[data-v-7e9c74a6],
.extension .link .title[data-v-7e9c74a6] {
  font-size: 26px;
  padding-top: 50px;
  box-sizing: border-box;
  width: 960px;
  margin: 0 auto;
  padding-left: 22px;
}
.extension .link .description[data-v-7e9c74a6] {
  color: rgba(0, 0, 0, 0.7);
  font-size: 13px;
  padding-top: 8px;
}
.extension .ion-close[data-v-7e9c74a6] {
  position: absolute;
  top: 45px;
  right: 15px;
  font-size: 12px;
  color: #bbb;
}
.extension .ion-close[data-v-7e9c74a6]:hover {
  color: #999;
}
.books[data-v-7e9c74a6] {
  display: none;
  left: 15px;
  right: 15px;
  position: fixed;
  bottom: 15px;
  z-index: 900;
}
.books.book--mobile[data-v-7e9c74a6] {
  bottom: 55px;
}
.books .book-inner[data-v-7e9c74a6] {
  width: 100%;
  height: 50px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fd4243;
  box-sizing: border-box;
  border-radius: 2px;
  background: linear-gradient(108deg, #f87554, #f0232f);
  background: -webkit-linear-gradient(-12deg, #f87554, #f0232f);
}
.books .book-inner .icon[data-v-7e9c74a6] {
  width: 38px;
}
.books .book-inner .icon img[data-v-7e9c74a6] {
  width: 100%;
  display: block;
}
.books .book-inner .title[data-v-7e9c74a6] {
  flex-grow: 1;
  padding-left: 15px;
  color: #fff;
  font-size: 15px;
}
.books .book-inner .btn-get[data-v-7e9c74a6] {
  padding-left: 15px;
  padding-right: 15px;
  height: 26px;
  line-height: 26px;
  border-radius: 2px;
  border: 1px solid #fff;
  color: #fff;
}
@media (max-width: 960px) {
  .books[data-v-7e9c74a6] {
    display: block;
  }
}
@media (min-width: 960px) {
  .extension[data-v-7e9c74a6] {
    display: block;
  }
}
`