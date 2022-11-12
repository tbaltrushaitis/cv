<h1 align="center">CV, Resume and Portfolio</h1>

<p align="center">
  <a href="https://github.com/tbaltrushaitis/cv/releases"><img src="https://img.shields.io/github/release/tbaltrushaitis/cv.svg?style=flat" alt="GitHub release"></a>
  <a href="https://github.com/tbaltrushaitis/cv/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat" alt="License"></a>
  <a href="https://github.com/tbaltrushaitis/cv/stargazers"><img src="https://img.shields.io/github/stars/tbaltrushaitis/cv.svg?style=flat" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="http://bit.ly/tomascv?ref=readme">
    <img src="assets/img/cv-demo-01.gif" max-width="640px" max-height="360px" alt="Modern CV, Resume and Portfolio website template" />
  </a>
</p>

<!-- ![](assets/img/cv-demo-01.gif) -->

<h4 align="center">Best-in-Class modern CV, Resume and Portfolio website template</h4>
<h5 align="center"><strong>All-in-One-Page</strong> site with fully customizable builder</h5>

<p align="center">
  <code>cv</code>
  <code>resume</code>
  <code>portfolio</code>
  <code>template</code>
  <code>portfolio-website</code>
  <code>cv-template</code>
  <code>IT</code>
  <code>resume-template</code>
  <code>resume-website</code>
</p>

---

## :computer: Live Demo ##
<!-- See it in action at :point_right: [Modern CV](http://bit.ly/tomascv?ref_domain=github.com&ref_section=docs&ref_file=readme) :point_left: -->
See how it look & feel at :point_right: [CV][CV] :point_left:

---

## :runner: Usage ##

### :one: Clone the repository ###
```shell
$ APP_NAME=cv \
&& git clone https://github.com/tbaltrushaitis/${APP_NAME}.git \
&& cd ${APP_NAME}
```

### :two: Install dependencies ###
```shell
$ make setup
```

### :three: Configure ###

Replace values in `config/person.json` with your personal information

### :four: Build ###
```shell
$ make build
```

### :five: Deploy ###
```shell
$ make deploy
```

This will create/update `webroot` directory inside the project root.
Use this directory as DocumentRoot in VirtualHost configuration of your web server.

### :white_check_mark: Enjoy  ###

Post a link to your CV on sites where you need your personal profile page should be discovered by other users and that provide a lots of information about your professional skills and experience.
For example: [Modern CV](http://bit.ly/tomascv)

---

## :label: Components ##

 Name | Version | Scope | Description |
:-----|:-------:|:-----:|:------------|
 [animate.css](http://daneden.github.io/animate.css/) | 4.1.1 | Front | A cross-browser library of CSS animations
 [FontAwesome](https://fontawesome.com/) | 6.2.0 | Front | The iconic Font and CSS toolkit
 [Bootstrap](http://getbootstrap.com) | 3.3.7 | Front | Front-end framework
 [jQuery](http://jquery.com/) | 3.5.1 | Front | JavaScript Library
 [noty](http://ned.im/noty) | 2.4.1 | Front | Notification library
 [waypoints](https://github.com/imakewebthings/waypoints) | 4.0.1 | Front | Easily execute a function when you scroll to an element
 [wow.js](https://wowjs.uk/) | 1.3.0 | Front | Reveal CSS animation as you scroll down a page
 [iamx](https://trendytheme.net/items/i-am-x-html-resume-template/) | 1.2.0 | Front | Trendy Theme

---

## :wrench: Dev Tools ##

 Name | Description |
:-----|:------------|
 [bower](http://bower.io) | A package manager for the web
 [gulp](http://gulpjs.com) | Toolkit for automating tasks in development workflow
 [gulp-token-replace](https://github.com/Pictela/gulp-token-replace) | Token replace plugin for Gulp
 [jimp](https://github.com/oliver-moran/jimp) | An image processing library written entirely in JavaScript for Node
 [terser](https://github.com/terser-js/terser) | A JavaScript parser and mangler/compressor toolkit for ES6+

---

## :pushpin: Todo List ##

- [ ] - upgrade to noty v3
- [ ] - upgrade to bootstrap v4
- [ ] - implement require.js configuration
- [x] - upgrade gulp to v4 (in **v3.0.1**)

See [CHANGELOG][Changelog] for the history of changes and improvements.

---

Be aware of [copyright][License] information and please refer to [FAQ][FAQ] section if you have doubts about *what to Include in a CV*.

<!--/
---
## What Is a Curriculum Vitae? ##

`Curriculum vitae` (CV) provides a summary of one’s experience and skills.

CVs include information on one’s academic background, including teaching experience, degrees, research, awards, publications, presentations, and other achievements. CVs are thus much longer than resumes, and include more information, particularly related to academic background.

A curriculum vitae summary is a one-to-two-page, condensed version of a full curriculum vitae. A CV summary is a way to quickly and concisely convey one’s skills and qualifications. Sometimes large organizations will ask for a `one-page CV` summary when they expect a large pool of applicants.

Full article about what is [Curriculum vitae](http://bit.ly/2QfaIBD)
/-->

---

### :link: More Info ###

 - [GitHub: Basic writing and formatting syntax](https://help.github.com/articles/basic-writing-and-formatting-syntax)
 - [BitBucket: markdown Howto](https://bitbucket.org/tutorials/markdowndemo)
 - [Creating an Automated Build](https://docs.docker.com/docker-hub/builds/)

---
> Developed in **May 2016**

:scorpius:

[FAQ]: FAQ.md
[Changelog]: CHANGELOG.md
[License]: LICENSE.md
[CV]: http://bit.ly/tomascv?ref_domain=github.com&ref_section=docs&ref_file=readme
