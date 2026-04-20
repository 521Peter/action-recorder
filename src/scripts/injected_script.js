/* build: 0.2.6 .2 */
!(function (e) {
  "function" == typeof define && define.amd ? define(e) : e();
})(function () {
  "use strict";
  function e(e, t, i) {
    return (
      (t = (function (e) {
        var t = (function (e, t) {
          if ("object" != typeof e || !e) return e;
          var i = e[Symbol.toPrimitive];
          if (void 0 !== i) {
            var n = i.call(e, t || "default");
            if ("object" != typeof n) return n;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" == typeof t ? t : t + "";
      })(t)) in e
        ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = i),
      e
    );
  }
  function t(e, t) {
    if (e !== t) throw new TypeError("Cannot instantiate an arrow function");
  }
  function i(e, t) {
    var i = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        i.push.apply(i, n);
    }
    return i;
  }
  function n(t) {
    for (var n = 1; n < arguments.length; n++) {
      var o = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? i(Object(o), !0).forEach(function (i) {
            e(t, i, o[i]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o))
        : i(Object(o)).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(o, e));
          });
    }
    return t;
  }
  class o {
    constructor() {
      (this.fieldHandlers = {
        text: this.fillTextField.bind(this),
        email: this.fillEmailField.bind(this),
        password: this.fillPasswordField.bind(this),
        number: this.fillNumberField.bind(this),
        tel: this.fillPhoneField.bind(this),
        date: this.fillDateField.bind(this),
        url: this.fillUrlField.bind(this),
        textarea: this.fillTextareaField.bind(this),
        select: this.fillSelectField.bind(this),
        checkbox: this.fillCheckboxField.bind(this),
        radio: this.fillRadioField.bind(this),
        color: this.fillColorField.bind(this),
        range: this.fillRangeField.bind(this),
      }),
        (this.fieldPatterns = {
          name: { type: "text", generator: this.generateName.bind(this) },
          firstname: {
            type: "text",
            generator: this.generateFirstName.bind(this),
          },
          lastname: {
            type: "text",
            generator: this.generateLastName.bind(this),
          },
          username: {
            type: "text",
            generator: this.generateUsername.bind(this),
          },
          email: { type: "email", generator: this.generateEmail.bind(this) },
          phone: { type: "tel", generator: this.generatePhone.bind(this) },
          address: { type: "text", generator: this.generateAddress.bind(this) },
          city: { type: "text", generator: this.generateCity.bind(this) },
          state: { type: "text", generator: this.generateState.bind(this) },
          zip: { type: "text", generator: this.generateZip.bind(this) },
          country: { type: "text", generator: this.generateCountry.bind(this) },
          password: {
            type: "password",
            generator: this.generatePassword.bind(this),
          },
          birthday: {
            type: "date",
            generator: this.generateBirthday.bind(this),
          },
          age: { type: "number", generator: this.generateAge.bind(this) },
          website: { type: "url", generator: this.generateWebsite.bind(this) },
          comment: {
            type: "textarea",
            generator: this.generateComment.bind(this),
          },
        });
    }
    fillForm(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      this.getFormFields(e).forEach(
        function (e) {
          t(this, i);
          const o = this.getFieldName(e),
            s = e.type.toLowerCase();
          if (void 0 !== n[o]) return void this.setFieldValue(e, n[o]);
          (this.fieldHandlers[s] || this.fieldHandlers.text)(e);
        }.bind(this)
      );
    }
    getFormFields(e) {
      var i = this;
      return Array.from(e.querySelectorAll("input,textarea,select")).filter(
        function (e) {
          return (
            t(this, i),
            !e.disabled &&
              !["button", "submit", "reset", "hidden", "image"].includes(e.type)
          );
        }.bind(this)
      );
    }
    getFieldName(e) {
      return e.name || e.id || "";
    }
    setFieldValue(e, i) {
      var n = this;
      if (e) {
        if ((e.focus(), "INPUT" === e.tagName && "checkbox" === e.type))
          e.checked = Boolean(i);
        else if ("INPUT" === e.tagName && "radio" === e.type)
          e.checked = e.value === i;
        else if ("SELECT" === e.tagName) {
          const o = Array.from(e.options).find(
            function (e) {
              return t(this, n), e.value === i;
            }.bind(this)
          );
          o && (o.selected = !0);
        } else {
          let t;
          (t =
            "TEXTAREA" === e.tagName
              ? Object.getOwnPropertyDescriptor(
                  window.HTMLTextAreaElement.prototype,
                  "value"
                ).set
              : Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value"
                ).set),
            t.call(e, i);
          const n = new Event("input", { bubbles: !0 });
          e.dispatchEvent(n),
            e.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
        this.triggerInputEvents(e), e.blur();
      }
    }
    fillSelectField(e) {
      var i = this;
      if ((e.focus(), e.multiple)) {
        const n = Array.from(e.options).filter(
            function (e) {
              return t(this, i), !e.disabled && e.value;
            }.bind(this)
          ),
          o = Math.min(Math.floor(Math.random() * n.length) + 1, n.length);
        this.getRandomElements(n, o).forEach(
          function (e) {
            return t(this, i), (e.selected = !0);
          }.bind(this)
        );
      } else {
        const n = Array.from(e.options).filter(
          function (e) {
            return t(this, i), !e.disabled && e.value;
          }.bind(this)
        );
        if (n.length > 0) {
          n[Math.floor(Math.random() * n.length)].selected = !0;
        }
      }
      this.triggerInputEvents(e), e.blur();
    }
    triggerInputEvents(e) {
      var i = this;
      ["input", "change", "blur"].forEach(
        function (n) {
          t(this, i);
          const o = new Event(n, { bubbles: !0 });
          e.dispatchEvent(o);
        }.bind(this)
      );
    }
    fillTextField(e) {
      const t = this.getFieldName(e),
        i = this.guessFieldValue(t, e) || this.generateText();
      this.setFieldValue(e, i);
    }
    fillEmailField(e) {
      this.setFieldValue(e, this.generateEmail());
    }
    fillPasswordField(e) {
      this.setFieldValue(e, this.generatePassword());
    }
    fillNumberField(e) {
      const t = parseInt(e.min) || 0,
        i = parseInt(e.max) || t + 100;
      this.setFieldValue(e, this.generateNumber(t, i));
    }
    fillPhoneField(e) {
      this.setFieldValue(e, this.generatePhone());
    }
    fillDateField(e) {
      this.setFieldValue(e, this.generateDate());
    }
    fillUrlField(e) {
      this.setFieldValue(e, this.generateWebsite());
    }
    fillTextareaField(e) {
      const t = this.getFieldName(e),
        i = this.guessFieldValue(t, e) || this.generateParagraph();
      this.setFieldValue(e, i);
    }
    fillSelectField(e) {
      var i = this;
      if (e.multiple) {
        const n = Array.from(e.options).filter(
            function (e) {
              return t(this, i), !e.disabled;
            }.bind(this)
          ),
          o = Math.min(Math.floor(Math.random() * n.length) + 1, n.length);
        this.getRandomElements(n, o).forEach(
          function (e) {
            return t(this, i), (e.selected = !0);
          }.bind(this)
        );
      } else {
        const n = Array.from(e.options).filter(
          function (e) {
            return t(this, i), !e.disabled && e.value;
          }.bind(this)
        );
        if (n.length > 0) {
          n[Math.floor(Math.random() * n.length)].selected = !0;
        }
      }
      this.triggerInputEvents(e);
    }
    fillCheckboxField(e) {
      (e.checked = Math.random() > 0.5), this.triggerInputEvents(e);
    }
    fillRadioField(e) {
      const t = document.querySelectorAll(
          'input[type="radio"][name="' + e.name + '"]'
        ),
        i = t[Math.floor(Math.random() * t.length)];
      (i.checked = !0), this.triggerInputEvents(i);
    }
    fillColorField(e) {
      this.setFieldValue(e, this.generateColor());
    }
    fillRangeField(e) {
      const t = parseInt(e.min) || 0,
        i = parseInt(e.max) || 100;
      this.setFieldValue(e, this.generateNumber(t, i));
    }
    guessFieldValue(e, t) {
      if (!e) return null;
      const i = e.toLowerCase();
      for (const [e, t] of Object.entries(this.fieldPatterns))
        if (i.includes(e)) return t.generator();
      if (t.placeholder) {
        const e = t.placeholder.toLowerCase();
        for (const [t, i] of Object.entries(this.fieldPatterns))
          if (e.includes(t)) return i.generator();
      }
      if (t.id) {
        const e = document.querySelector('label[for="' + t.id + '"]');
        if (e) {
          const t = e.textContent.toLowerCase();
          for (const [e, i] of Object.entries(this.fieldPatterns))
            if (t.includes(e)) return i.generator();
        }
      }
      return null;
    }
    generateText() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 8;
      const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let i = "";
      for (let n = 0; n < e; n++) i += t.charAt(Math.floor(52 * Math.random()));
      return i;
    }
    generateName() {
      return (
        this.getRandomElement([
          "John",
          "Jane",
          "Michael",
          "Emily",
          "David",
          "Sarah",
          "Robert",
          "Jennifer",
        ]) +
        " " +
        this.getRandomElement([
          "Smith",
          "Johnson",
          "Williams",
          "Brown",
          "Jones",
          "Miller",
          "Davis",
        ])
      );
    }
    generateFirstName() {
      return this.getRandomElement([
        "John",
        "Jane",
        "Michael",
        "Emily",
        "David",
        "Sarah",
        "Robert",
        "Jennifer",
      ]);
    }
    generateLastName() {
      return this.getRandomElement([
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
      ]);
    }
    generateUsername() {
      return (
        this.getRandomElement([
          "happy",
          "sunny",
          "clever",
          "brave",
          "gentle",
          "wild",
          "quiet",
        ]) +
        "_" +
        this.getRandomElement([
          "cat",
          "dog",
          "lion",
          "tiger",
          "bear",
          "wolf",
          "eagle",
        ]) +
        Math.floor(100 * Math.random())
      );
    }
    generateEmail() {
      return (
        this.generateUsername() +
        "@" +
        this.getRandomElement([
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "example.com",
          "domain.com",
        ])
      );
    }
    generatePassword() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12;
      const t =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let i = "";
      for (let n = 0; n < e; n++) i += t.charAt(Math.floor(70 * Math.random()));
      return i;
    }
    generatePhone() {
      return (
        "+1" +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(1e3 + 9e3 * Math.random())
      );
    }
    generateAddress() {
      return (
        this.getRandomElement(["123", "456", "789", "100", "200", "300"]) +
        " " +
        this.getRandomElement([
          "Main St",
          "Oak Ave",
          "Pine Rd",
          "Elm St",
          "Maple Dr",
          "Cedar Ln",
        ])
      );
    }
    generateCity() {
      return this.getRandomElement([
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
      ]);
    }
    generateState() {
      return this.getRandomElement([
        "California",
        "Texas",
        "Florida",
        "New York",
        "Illinois",
        "Pennsylvania",
      ]);
    }
    generateZip() {
      return Math.floor(1e4 + 9e4 * Math.random()).toString();
    }
    generateCountry() {
      return this.getRandomElement([
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
      ]);
    }
    generateBirthday() {
      const e = new Date(1970, 0, 1),
        t = new Date(2e3, 0, 1);
      return new Date(e.getTime() + Math.random() * (t.getTime() - e.getTime()))
        .toISOString()
        .split("T")[0];
    }
    generateAge() {
      return Math.floor(18 + 50 * Math.random());
    }
    generateWebsite() {
      return (
        "https://www." +
        this.getRandomElement([
          "example.com",
          "test.org",
          "demo.net",
          "website.dev",
          "mysite.io",
        ])
      );
    }
    generateComment() {
      return this.getRandomElement([
        "This is a great product!",
        "Very satisfied with the service.",
        "Could be better, but overall good.",
        "Excellent experience overall.",
        "Would recommend to others.",
        "Needs some improvements.",
      ]);
    }
    generateParagraph() {
      return this.getRandomElement([
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ]);
    }
    generateDate() {
      const e = new Date(2e3, 0, 1),
        t = new Date();
      return new Date(e.getTime() + Math.random() * (t.getTime() - e.getTime()))
        .toISOString()
        .split("T")[0];
    }
    generateColor() {
      let e = "#";
      for (let t = 0; t < 6; t++)
        e += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
      return e;
    }
    generateNumber() {
      let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100;
      return Math.floor(e + Math.random() * (t - e + 1));
    }
    getRandomElement(e) {
      return e[Math.floor(Math.random() * e.length)];
    }
    getRandomElements(e, i) {
      var n = this;
      return []
        .concat(e)
        .sort(
          function () {
            return t(this, n), 0.5 - Math.random();
          }.bind(this)
        )
        .slice(0, i);
    }
  }
  var s,
    l,
    r,
    a,
    d = void 0;
  const c = {
    setOffer: function (e, i, n, o, s, l, r, a) {
      var c, h, u;
      t(this, d);
      const f = JSON.stringify({
        sessionCode: e,
        offerKey: i,
        offerUrl: n,
        offerTemplateUrl: o,
        offerDomainUrl: s,
        offerType: l,
        offerIndex: r,
        offerTemplateId: a,
      });
      if (
        (console.log("setOffer", f),
        null !== (c = window.webkit) &&
          void 0 !== c &&
          null !== (c = c.messageHandlers) &&
          void 0 !== c &&
          null !== (c = c.onOfferTask) &&
          void 0 !== c &&
          c.postMessage)
      ) {
        var v;
        null === (v = window.webkit) ||
          void 0 === v ||
          null === (v = v.messageHandlers) ||
          void 0 === v ||
          null === (v = v.onOfferTask) ||
          void 0 === v ||
          v.postMessage(f);
      } else {
        var m, g;
        if (
          null !== (h = window) &&
          void 0 !== h &&
          null !== (h = h.OSDK) &&
          void 0 !== h &&
          h.onOfferTask
        )
          return null === (m = window) ||
            void 0 === m ||
            null === (m = m.OSDK) ||
            void 0 === m
            ? void 0
            : m.onOfferTask(f);
        if (
          null !== (u = window) &&
          void 0 !== u &&
          null !== (u = u.WVSDK) &&
          void 0 !== u &&
          u.onOfferTask
        )
          return null === (g = window) ||
            void 0 === g ||
            null === (g = g.WVSDK) ||
            void 0 === g
            ? void 0
            : g.onOfferTask(f);
      }
    }.bind(void 0),
    onOfferLocation: function (e, i) {
      var n, o, s, l;
      return (
        t(this, d),
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.onOfferLocation
          ? null === (s = window) ||
            void 0 === s ||
            null === (s = s.OSDK) ||
            void 0 === s
            ? void 0
            : s.onOfferLocation(e, i)
          : null !== (o = window) &&
            void 0 !== o &&
            null !== (o = o.WVSDK) &&
            void 0 !== o &&
            o.onOfferLocation
          ? null === (l = window) ||
            void 0 === l ||
            null === (l = l.WVSDK) ||
            void 0 === l
            ? void 0
            : l.onOfferLocation(e, i)
          : void 0
      );
    }.bind(void 0),
    offerSend: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.onOfferSend) &&
          void 0 !== i &&
          i.postMessage)
      ) {
        var s;
        null === (s = window.webkit) ||
          void 0 === s ||
          null === (s = s.messageHandlers) ||
          void 0 === s ||
          null === (s = s.onOfferSend) ||
          void 0 === s ||
          s.postMessage(e);
      } else {
        var l, r;
        if (
          null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.onOfferSend
        )
          return null === (l = window) ||
            void 0 === l ||
            null === (l = l.OSDK) ||
            void 0 === l
            ? void 0
            : l.onOfferSend(e);
        if (
          null !== (o = window) &&
          void 0 !== o &&
          null !== (o = o.WVSDK) &&
          void 0 !== o &&
          o.onOfferSend
        )
          return null === (r = window) ||
            void 0 === r ||
            null === (r = r.WVSDK) ||
            void 0 === r
            ? void 0
            : r.onOfferSend(e);
      }
    }.bind(void 0),
    offerCancel: function (e, i) {
      var n, o, s, l, r;
      if (
        (t(this, d),
        i &&
          null !== (n = window.webkit) &&
          void 0 !== n &&
          null !== (n = n.messageHandlers) &&
          void 0 !== n &&
          null !== (n = n.onOfferOut) &&
          void 0 !== n &&
          n.postMessage)
      )
        null === (r = window.webkit) ||
          void 0 === r ||
          null === (r = r.messageHandlers) ||
          void 0 === r ||
          null === (r = r.onOfferOut) ||
          void 0 === r ||
          r.postMessage(e);
      else if (
        null !== (o = window.webkit) &&
        void 0 !== o &&
        null !== (o = o.messageHandlers) &&
        void 0 !== o &&
        null !== (o = o.onOfferCancel) &&
        void 0 !== o &&
        o.postMessage
      ) {
        var a;
        null === (a = window.webkit) ||
          void 0 === a ||
          null === (a = a.messageHandlers) ||
          void 0 === a ||
          null === (a = a.onOfferCancel) ||
          void 0 === a ||
          a.postMessage(e);
      } else {
        var c, h;
        if (
          null !== (s = window) &&
          void 0 !== s &&
          null !== (s = s.OSDK) &&
          void 0 !== s &&
          s.onOfferCancel
        )
          return null === (c = window) ||
            void 0 === c ||
            null === (c = c.OSDK) ||
            void 0 === c
            ? void 0
            : c.onOfferCancel(e);
        if (
          null !== (l = window) &&
          void 0 !== l &&
          null !== (l = l.WVSDK) &&
          void 0 !== l &&
          l.onOfferCancel
        )
          return null === (h = window) ||
            void 0 === h ||
            null === (h = h.WVSDK) ||
            void 0 === h
            ? void 0
            : h.onOfferCancel(e);
      }
    }.bind(void 0),
    offerFinish: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.onOfferFinish) &&
          void 0 !== i &&
          i.postMessage)
      ) {
        var s;
        null === (s = window.webkit) ||
          void 0 === s ||
          null === (s = s.messageHandlers) ||
          void 0 === s ||
          null === (s = s.onOfferFinish) ||
          void 0 === s ||
          s.postMessage(e);
      } else {
        var l, r;
        if (
          null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.offerFinish
        )
          return null === (l = window) ||
            void 0 === l ||
            null === (l = l.OSDK) ||
            void 0 === l
            ? void 0
            : l.offerFinish(e);
        if (
          null !== (o = window) &&
          void 0 !== o &&
          null !== (o = o.WVSDK) &&
          void 0 !== o &&
          o.offerFinish
        )
          return null === (r = window) ||
            void 0 === r ||
            null === (r = r.WVSDK) ||
            void 0 === r
            ? void 0
            : r.offerFinish(e);
      }
    }.bind(void 0),
    offerClose: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.onOfferClose) &&
          void 0 !== i &&
          i.postMessage)
      ) {
        var s;
        null === (s = window.webkit) ||
          void 0 === s ||
          null === (s = s.messageHandlers) ||
          void 0 === s ||
          null === (s = s.onOfferClose) ||
          void 0 === s ||
          s.postMessage(e);
      } else {
        var l, r;
        if (
          null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.onOfferClose
        )
          return null === (l = window) ||
            void 0 === l ||
            null === (l = l.OSDK) ||
            void 0 === l
            ? void 0
            : l.onOfferClose(e);
        if (
          null !== (o = window) &&
          void 0 !== o &&
          null !== (o = o.WVSDK) &&
          void 0 !== o &&
          o.onOfferClose
        )
          return null === (r = window) ||
            void 0 === r ||
            null === (r = r.WVSDK) ||
            void 0 === r
            ? void 0
            : r.onOfferClose(e);
      }
    }.bind(void 0),
    getWinConfig: function () {
      var e, i, n, o, s, l, r, a, c, h;
      return (
        t(this, d),
        null !== (e = window.webkit) &&
        void 0 !== e &&
        null !== (e = e.messageHandlers) &&
        void 0 !== e &&
        null !== (e = e.adGetWinConfig) &&
        void 0 !== e &&
        e.postMessage
          ? null === (l = window.webkit) ||
            void 0 === l ||
            null === (l = l.messageHandlers) ||
            void 0 === l ||
            null === (l = l.adGetWinConfig) ||
            void 0 === l
            ? void 0
            : l.postMessage(1)
          : null !== (i = window.webkit) &&
            void 0 !== i &&
            null !== (i = i.messageHandlers) &&
            void 0 !== i &&
            null !== (i = i.getWinConfig) &&
            void 0 !== i &&
            i.postMessage
          ? null === (r = window.webkit) ||
            void 0 === r ||
            null === (r = r.messageHandlers) ||
            void 0 === r ||
            null === (r = r.getWinConfig) ||
            void 0 === r
            ? void 0
            : r.postMessage(1)
          : null !== (n = window) &&
            void 0 !== n &&
            null !== (n = n.OSDK) &&
            void 0 !== n &&
            n.getWinConfig
          ? null === (a = window) ||
            void 0 === a ||
            null === (a = a.OSDK) ||
            void 0 === a
            ? void 0
            : a.getWinConfig()
          : null !== (o = window) &&
            void 0 !== o &&
            null !== (o = o.WVSDK) &&
            void 0 !== o &&
            o.getWinConfig
          ? null === (c = window) ||
            void 0 === c ||
            null === (c = c.WVSDK) ||
            void 0 === c
            ? void 0
            : c.getWinConfig()
          : null !== (s = window) &&
            void 0 !== s &&
            null !== (s = s.electronAPI) &&
            void 0 !== s &&
            s.getWinConfig
          ? null === (h = window) ||
            void 0 === h ||
            null === (h = h.electronAPI) ||
            void 0 === h
            ? void 0
            : h.getWinConfig()
          : ""
      );
    }.bind(void 0),
    setWinConfig: function () {
      var e, i, n, o, s, l, r, a, c, h;
      t(this, d);
      for (var u = arguments.length, f = new Array(u), v = 0; v < u; v++)
        f[v] = arguments[v];
      return null !== (e = window.webkit) &&
        void 0 !== e &&
        null !== (e = e.messageHandlers) &&
        void 0 !== e &&
        null !== (e = e.adSetWinConfig) &&
        void 0 !== e &&
        e.postMessage
        ? null === (l = window.webkit) ||
          void 0 === l ||
          null === (l = l.messageHandlers) ||
          void 0 === l ||
          null === (l = l.adSetWinConfig) ||
          void 0 === l
          ? void 0
          : l.postMessage.apply(l, f)
        : null !== (i = window.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.setWinConfig) &&
          void 0 !== i &&
          i.postMessage
        ? null === (r = window.webkit) ||
          void 0 === r ||
          null === (r = r.messageHandlers) ||
          void 0 === r ||
          null === (r = r.setWinConfig) ||
          void 0 === r
          ? void 0
          : r.postMessage.apply(r, f)
        : null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.setWinConfig
        ? null === (a = window) ||
          void 0 === a ||
          null === (a = a.OSDK) ||
          void 0 === a
          ? void 0
          : a.setWinConfig.apply(a, f)
        : null !== (o = window) &&
          void 0 !== o &&
          null !== (o = o.WVSDK) &&
          void 0 !== o &&
          o.setWinConfig
        ? null === (c = window) ||
          void 0 === c ||
          null === (c = c.WVSDK) ||
          void 0 === c
          ? void 0
          : c.setWinConfig.apply(c, f)
        : null !== (s = window) &&
          void 0 !== s &&
          null !== (s = s.electronAPI) &&
          void 0 !== s &&
          s.setWinConfig
        ? null === (h = window) ||
          void 0 === h ||
          null === (h = h.electronAPI) ||
          void 0 === h
          ? void 0
          : h.setWinConfig.apply(h, f)
        : void 0;
    }.bind(void 0),
    notifyClick: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window) &&
          void 0 !== i &&
          null !== (i = i.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.notifyClick) &&
          void 0 !== i &&
          i.postMessage)
      )
        if ("jscode_no_ads_href" == e) {
          var s;
          console.dir("notifyClick:::::: " + e),
            null === (s = window.webkit) ||
              void 0 === s ||
              s.messageHandlers.notifyClick.postMessage(e);
        } else {
          var l;
          function c(e) {
            try {
              return decodeURIComponent(e);
            } catch (t) {
              return console.warn("Failed to decode URI component:", e, t), e;
            }
          }
          let h = e ? c(e).split(/adurl=|url=/) : [];
          (e = h[h.length - 1] || e),
            console.dir("notifyClick:::::: " + e),
            null === (l = window.webkit) ||
              void 0 === l ||
              l.messageHandlers.notifyClick.postMessage(e);
        }
      else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.notifyClick
      ) {
        var r;
        null === (r = window) ||
          void 0 === r ||
          null === (r = r.OSDK) ||
          void 0 === r ||
          r.notifyClick(e);
      } else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.notifyClick
      ) {
        var a;
        null === (a = window) ||
          void 0 === a ||
          null === (a = a.WVSDK) ||
          void 0 === a ||
          a.notifyClick(e);
      }
    }.bind(void 0),
    notifyNext: function () {
      var e, i, n, o;
      if (
        (t(this, d),
        null !== (e = window) &&
          void 0 !== e &&
          null !== (e = e.webkit) &&
          void 0 !== e &&
          null !== (e = e.messageHandlers) &&
          void 0 !== e &&
          null !== (e = e.notifyNext) &&
          void 0 !== e &&
          e.postMessage)
      )
        null === (o = window.webkit) ||
          void 0 === o ||
          o.messageHandlers.notifyNext.postMessage(1);
      else if (
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.WVSDK) &&
        void 0 !== i &&
        i.notifyNext
      ) {
        var s;
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.notifyNext();
      } else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.notifyNext
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.OSDK) ||
          void 0 === l ||
          l.notifyNext();
      }
    }.bind(void 0),
    addDomainJSReplace: function (e) {
      var i, n, o, s, l;
      if (
        (t(this, d),
        null !== (i = window) &&
          void 0 !== i &&
          null !== (i = i.WVSDK) &&
          void 0 !== i &&
          i.addDomainJSReplace)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.addDomainJSReplace(e);
      else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.addDomainJSReplace
      ) {
        var r;
        null === (r = window) ||
          void 0 === r ||
          null === (r = r.OSDK) ||
          void 0 === r ||
          r.addDomainJSReplace(e);
      }
      null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.webkit) &&
        void 0 !== o &&
        null !== (o = o.messageHandlers) &&
        void 0 !== o &&
        null !== (o = o.addDomainJSReplace) &&
        void 0 !== o &&
        o.postMessage &&
        (null === (l = window.webkit) ||
          void 0 === l ||
          l.messageHandlers.addDomainJSReplace.postMessage(e));
    }.bind(void 0),
    addDomainReset: function (e) {
      var i, n, o, s, l;
      if (
        (t(this, d),
        null !== (i = window) &&
          void 0 !== i &&
          null !== (i = i.WVSDK) &&
          void 0 !== i &&
          i.addDomainReset)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.addDomainReset(e);
      else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.addDomainJSReplace
      ) {
        var r;
        null === (r = window) ||
          void 0 === r ||
          null === (r = r.OSDK) ||
          void 0 === r ||
          r.addDomainReset(e);
      }
      null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.webkit) &&
        void 0 !== o &&
        null !== (o = o.messageHandlers) &&
        void 0 !== o &&
        null !== (o = o.addDomainReset) &&
        void 0 !== o &&
        o.postMessage &&
        (null === (l = window.webkit) ||
          void 0 === l ||
          l.messageHandlers.addDomainReset.postMessage(e));
    }.bind(void 0),
    notifyGoAD: function () {
      var e, i, n;
      let o =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "1";
      var s, l;
      if (
        (t(this, d),
        null !== (e = window) &&
          void 0 !== e &&
          null !== (e = e.WVSDK) &&
          void 0 !== e &&
          e.notifyGoAD)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.notifyGoAD(o);
      else if (
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.OSDK) &&
        void 0 !== i &&
        i.notifyGoAD
      ) {
        var r;
        null === (r = window) ||
          void 0 === r ||
          null === (r = r.OSDK) ||
          void 0 === r ||
          r.notifyGoAD(o);
      }
      null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.webkit) &&
        void 0 !== n &&
        null !== (n = n.messageHandlers) &&
        void 0 !== n &&
        null !== (n = n.notifyGoAD) &&
        void 0 !== n &&
        n.postMessage &&
        (console.dir("notifyGoAD..............>>>>>>>>>>>>>>"),
        null === (l = window.webkit) ||
          void 0 === l ||
          l.messageHandlers.notifyGoAD.postMessage(o));
    }.bind(void 0),
    onOfferShow: function (e) {
      var i, n;
      (t(this, d),
      null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.webkit) &&
        void 0 !== i &&
        null !== (i = i.messageHandlers) &&
        void 0 !== i &&
        null !== (i = i.onOfferShow) &&
        void 0 !== i &&
        i.postMessage) &&
        (null === (n = window.webkit) ||
          void 0 === n ||
          n.messageHandlers.onOfferShow.postMessage(e));
    }.bind(void 0),
    cancelADTimer: function () {
      var e, i, n, o;
      if (
        (t(this, d),
        null !== (e = window) &&
          void 0 !== e &&
          null !== (e = e.WVSDK) &&
          void 0 !== e &&
          e.cancelADTimer)
      )
        null === (o = window) ||
          void 0 === o ||
          null === (o = o.WVSDK) ||
          void 0 === o ||
          o.cancelADTimer();
      else if (
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.OSDK) &&
        void 0 !== i &&
        i.cancelADTimer
      ) {
        var s;
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.cancelADTimer();
      } else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.webkit) &&
        void 0 !== n &&
        null !== (n = n.messageHandlers) &&
        void 0 !== n &&
        null !== (n = n.cancelADTimer) &&
        void 0 !== n &&
        n.postMessage
      ) {
        var l;
        null === (l = window.webkit) ||
          void 0 === l ||
          null === (l = l.messageHandlers) ||
          void 0 === l ||
          null === (l = l.cancelADTimer) ||
          void 0 === l ||
          l.postMessage(1);
      }
    }.bind(void 0),
    startAdtimer: function () {
      var e, i, n, o;
      if (
        (t(this, d),
        null !== (e = window) &&
          void 0 !== e &&
          null !== (e = e.WVSDK) &&
          void 0 !== e &&
          e.startADTimer)
      )
        null === (o = window) ||
          void 0 === o ||
          null === (o = o.WVSDK) ||
          void 0 === o ||
          o.startADTimer();
      else if (
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.OSDK) &&
        void 0 !== i &&
        i.startADTimer
      ) {
        var s;
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.startADTimer();
      } else if (
        null !== (n = window.webkit) &&
        void 0 !== n &&
        null !== (n = n.messageHandlers) &&
        void 0 !== n &&
        null !== (n = n.startADTimer) &&
        void 0 !== n &&
        n.postMessage
      ) {
        var l;
        null === (l = window.webkit) ||
          void 0 === l ||
          null === (l = l.messageHandlers) ||
          void 0 === l ||
          null === (l = l.startADTimer) ||
          void 0 === l ||
          l.postMessage(1);
      }
      console.dir("listen start Adtime .........");
    }.bind(void 0),
    getPlanScript: async function (e) {
      var i = this;
      return (
        t(this, d),
        new Promise(
          function (n) {
            var o,
              s,
              l = this;
            (t(this, i),
            null !== (o = window.webkit) &&
              void 0 !== o &&
              null !== (o = o.messageHandlers) &&
              void 0 !== o &&
              o.getConfigPlan)
              ? (null === (s = window.webkit) ||
                  void 0 === s ||
                  null === (s = s.messageHandlers) ||
                  void 0 === s ||
                  null === (s = s.getConfigPlan) ||
                  void 0 === s ||
                  s.postMessage(e),
                setTimeout(
                  function () {
                    t(this, l), n(window.getConfigPlan);
                  }.bind(this),
                  2e3
                ))
              : n(window.getConfigPlan);
          }.bind(this)
        )
      );
    }.bind(void 0),
    waitForScriptLoadUtil: function (e) {
      var i = this;
      return (
        t(this, d),
        new Promise(
          async function (e) {
            var n = this;
            t(this, i);
            let o = 0,
              s = async function () {
                t(this, n);
                let i = await c.getPlanScript();
                var l;
                ((i = await c.getPlanScript()),
                console.log("to insert::::=>", i, "--"),
                (i = await c.getPlanScript()),
                i)
                  ? (null === (l = i) || void 0 === l ? void 0 : l.length) < 50
                    ? e("")
                    : (e(i), (window.getConfigPlan = ""))
                  : o > 10
                  ? ((o = 0), e(""))
                  : ((o += 1), setTimeout(s, 1e3));
              }.bind(this);
            await s();
          }.bind(this)
        )
      );
    }.bind(void 0),
    loadScript: function (e) {
      var i,
        n,
        o,
        s,
        l,
        r = this;
      if (
        (t(this, d),
        null !== (i = window.webkit) &&
          void 0 !== i &&
          null !== (i = i.messageHandlers) &&
          void 0 !== i &&
          null !== (i = i.loadConfigPlan) &&
          void 0 !== i &&
          i.postMessage)
      ) {
        var a;
        console.dir(
          "window.webkit?.messageHandlers?.loadConfigPlan.....clentAPi11........." +
            e
        ),
          null === (a = window.webkit) ||
            void 0 === a ||
            null === (a = a.messageHandlers) ||
            void 0 === a ||
            null === (a = a.loadConfigPlan) ||
            void 0 === a ||
            a.postMessage(e);
        const t = "getConfigPlan";
        return c.waitForScriptLoadUtil(t);
      }
      return null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.loadConfigPlan
        ? (console.dir(
            "window?.OSDK?.loadConfigPlan.....clentAPi........." + e
          ),
          null === (s = window) ||
            void 0 === s ||
            null === (s = s.OSDK) ||
            void 0 === s ||
            s.loadConfigPlan(e),
          new Promise(
            function (i) {
              var n = this;
              t(this, r);
              let o = 0,
                s = function () {
                  var l;
                  t(this, n);
                  let r =
                    null === (l = window) ||
                    void 0 === l ||
                    null === (l = l.OSDK) ||
                    void 0 === l
                      ? void 0
                      : l.getConfigPlan(e);
                  r
                    ? (null == r ? void 0 : r.length) < 50
                      ? i("")
                      : i(r)
                    : o > 10
                    ? i("")
                    : ((o += 1), setTimeout(s, 1e3));
                }.bind(this);
              s();
            }.bind(this)
          ))
        : null !== (o = window) &&
          void 0 !== o &&
          null !== (o = o.WVSDK) &&
          void 0 !== o &&
          o.loadConfigPlan
        ? (console.dir(
            "window?.WVSDK?.loadConfigPlan.....clentAPi........." + e
          ),
          null === (l = window) ||
            void 0 === l ||
            null === (l = l.WVSDK) ||
            void 0 === l ||
            l.loadConfigPlan(e),
          new Promise(
            function (i) {
              var n = this;
              t(this, r);
              let o = 0,
                s = function () {
                  var l;
                  t(this, n);
                  let r =
                    null === (l = window) ||
                    void 0 === l ||
                    null === (l = l.WVSDK) ||
                    void 0 === l
                      ? void 0
                      : l.getConfigPlan(e);
                  r
                    ? (null == r ? void 0 : r.length) < 50
                      ? i("")
                      : i(r)
                    : o > 10
                    ? i("")
                    : ((o += 1), setTimeout(s, 1e3));
                }.bind(this);
              s();
            }.bind(this)
          ))
        : (console.dir("script.....noclentAPi.............."),
          new Promise(
            function (i) {
              var n = this;
              t(this, r),
                fetch(e)
                  .then(
                    function (e) {
                      return t(this, n), e.text();
                    }.bind(this)
                  )
                  .then(
                    function (e) {
                      t(this, n), e && e.length < 50 ? i("") : i(e);
                    }.bind(this)
                  )
                  .catch(
                    function (e) {
                      t(this, n), i("");
                    }.bind(this)
                  );
            }.bind(this)
          ));
    }.bind(void 0),
    track: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.track)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.track(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.track
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.track(e, i);
      }
    }.bind(void 0),
    scrollToIsCheck:
      (null === (s = window) ||
      void 0 === s ||
      null === (s = s.OSDK) ||
      void 0 === s
        ? void 0
        : s.scrollTo) ||
      (null === (l = window) ||
      void 0 === l ||
      null === (l = l.WVSDK) ||
      void 0 === l
        ? void 0
        : l.scrollTo),
    scrollTo: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.scrollTo)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.scrollTo(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.scrollTo
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.scrollTo(e, i);
      }
    }.bind(void 0),
    setThemeOnce: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.setThemeOnce)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.setThemeOnce(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.setThemeOnce
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.setThemeOnce(e, i);
      }
    }.bind(void 0),
    clientIsOs: function () {
      return t(this, d), !(window.OSDK || window.HyperSDK || window.WVSDK);
    }.bind(void 0),
    setThemeEnable: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window) &&
          void 0 !== i &&
          null !== (i = i.OSDK) &&
          void 0 !== i &&
          i.setThemeEnable)
      )
        null === (o = window) ||
          void 0 === o ||
          null === (o = o.OSDK) ||
          void 0 === o ||
          o.setThemeEnable(e);
      else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.WVSDK) &&
        void 0 !== n &&
        n.setThemeEnable
      ) {
        var s;
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.setThemeEnable(e);
      }
    }.bind(void 0),
    goAd: function (e) {
      var i, n, o;
      if (
        (t(this, d),
        null !== (i = window) &&
          void 0 !== i &&
          null !== (i = i.OSDK) &&
          void 0 !== i &&
          i.goAd)
      )
        null === (o = window) ||
          void 0 === o ||
          null === (o = o.OSDK) ||
          void 0 === o ||
          o.goAd(e);
      else if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.WVSDK) &&
        void 0 !== n &&
        n.goAd
      ) {
        var s;
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.WVSDK) ||
          void 0 === s ||
          s.goAd(e);
      }
    }.bind(void 0),
    setThemePoint: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.setThemePoint)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.setThemePoint(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.setThemePoint
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.setThemePoint(e, i);
      }
    }.bind(void 0),
    setTheme: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.setTheme)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.setTheme(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.setTheme
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.setTheme(e, i);
      }
    }.bind(void 0),
    goback: function () {
      var e, i, n;
      if (
        (t(this, d),
        null !== (e = window) &&
          void 0 !== e &&
          null !== (e = e.OSDK) &&
          void 0 !== e &&
          e.goback)
      )
        null === (n = window) ||
          void 0 === n ||
          null === (n = n.OSDK) ||
          void 0 === n ||
          n.goback();
      else if (
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.WVSDK) &&
        void 0 !== i &&
        i.goback
      ) {
        var o;
        null === (o = window) ||
          void 0 === o ||
          null === (o = o.WVSDK) ||
          void 0 === o ||
          o.goback();
      }
    }.bind(void 0),
    trackImmediately: function (e, i) {
      var n, o, s;
      if (
        (t(this, d),
        null !== (n = window) &&
          void 0 !== n &&
          null !== (n = n.OSDK) &&
          void 0 !== n &&
          n.trackImmediately)
      )
        null === (s = window) ||
          void 0 === s ||
          null === (s = s.OSDK) ||
          void 0 === s ||
          s.trackImmediately(e, i);
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.trackImmediately
      ) {
        var l;
        null === (l = window) ||
          void 0 === l ||
          null === (l = l.WVSDK) ||
          void 0 === l ||
          l.trackImmediately(e, i);
      }
    }.bind(void 0),
    getPackageName: function () {
      var e, i, n, o;
      return (
        t(this, d),
        null !== (e = window) &&
        void 0 !== e &&
        null !== (e = e.OSDK) &&
        void 0 !== e &&
        e.getPackageName
          ? null === (n = window) ||
            void 0 === n ||
            null === (n = n.OSDK) ||
            void 0 === n
            ? void 0
            : n.getPackageName()
          : null !== (i = window) &&
            void 0 !== i &&
            null !== (i = i.WVSDK) &&
            void 0 !== i &&
            i.getPackageName
          ? null === (o = window) ||
            void 0 === o ||
            null === (o = o.WVSDK) ||
            void 0 === o
            ? void 0
            : o.getPackageName()
          : void 0
      );
    }.bind(void 0),
    checkOnReqCallback:
      (null === (r = window) ||
      void 0 === r ||
      null === (r = r.OSDK) ||
      void 0 === r
        ? void 0
        : r.onReqCallback) ||
      (null === (a = window) ||
      void 0 === a ||
      null === (a = a.WVSDK) ||
      void 0 === a
        ? void 0
        : a.onReqCallback),
    onReqCallback: function (e) {
      var i, n, o, s;
      return (
        t(this, d),
        null !== (i = window) &&
        void 0 !== i &&
        null !== (i = i.OSDK) &&
        void 0 !== i &&
        i.onReqCallback
          ? null === (o = window) ||
            void 0 === o ||
            null === (o = o.OSDK) ||
            void 0 === o
            ? void 0
            : o.onReqCallback(e)
          : null !== (n = window) &&
            void 0 !== n &&
            null !== (n = n.WVSDK) &&
            void 0 !== n &&
            n.onReqCallback
          ? null === (s = window) ||
            void 0 === s ||
            null === (s = s.WVSDK) ||
            void 0 === s
            ? void 0
            : s.onReqCallback(e)
          : void 0
      );
    }.bind(void 0),
    onOfferLocationSuc: function () {
      var e, i, n, o;
      return (
        t(this, d),
        null !== (e = window) &&
        void 0 !== e &&
        null !== (e = e.OSDK) &&
        void 0 !== e &&
        e.onOfferLocationSuc
          ? null === (n = window) ||
            void 0 === n ||
            null === (n = n.OSDK) ||
            void 0 === n
            ? void 0
            : n.onOfferLocationSuc()
          : null !== (i = window) &&
            void 0 !== i &&
            null !== (i = i.WVSDK) &&
            void 0 !== i &&
            i.onOfferLocationSuc
          ? null === (o = window) ||
            void 0 === o ||
            null === (o = o.WVSDK) ||
            void 0 === o
            ? void 0
            : o.onOfferLocationSuc()
          : void 0
      );
    }.bind(void 0),
    getAppTheme: function () {
      var e, i, n, o;
      return (
        t(this, d),
        null !== (e = window) &&
        void 0 !== e &&
        null !== (e = e.OSDK) &&
        void 0 !== e &&
        e.getAppTheme
          ? null === (n = window) ||
            void 0 === n ||
            null === (n = n.OSDK) ||
            void 0 === n
            ? void 0
            : n.getAppTheme()
          : null !== (i = window) &&
            void 0 !== i &&
            null !== (i = i.WVSDK) &&
            void 0 !== i &&
            i.getAppTheme
          ? null === (o = window) ||
            void 0 === o ||
            null === (o = o.WVSDK) ||
            void 0 === o
            ? void 0
            : o.getAppTheme()
          : void 0
      );
    }.bind(void 0),
    refresh: function () {
      var e, i, n, o, s, l, r;
      if (
        (t(this, d),
        null !== (e = window.webkit) &&
          void 0 !== e &&
          null !== (e = e.messageHandlers) &&
          void 0 !== e &&
          null !== (e = e.adRefresh) &&
          void 0 !== e &&
          e.postMessage)
      )
        return null === (s = window.webkit) ||
          void 0 === s ||
          null === (s = s.messageHandlers) ||
          void 0 === s ||
          null === (s = s.adRefresh) ||
          void 0 === s
          ? void 0
          : s.postMessage(1);
      if (
        null !== (i = window.webkit) &&
        void 0 !== i &&
        null !== (i = i.messageHandlers) &&
        void 0 !== i &&
        null !== (i = i.refresh) &&
        void 0 !== i &&
        i.postMessage
      )
        return null === (l = window.webkit) ||
          void 0 === l ||
          null === (l = l.messageHandlers) ||
          void 0 === l ||
          null === (l = l.refresh) ||
          void 0 === l
          ? void 0
          : l.postMessage(1);
      if (
        null !== (n = window) &&
        void 0 !== n &&
        null !== (n = n.OSDK) &&
        void 0 !== n &&
        n.refresh
      )
        null === (r = window) ||
          void 0 === r ||
          null === (r = r.OSDK) ||
          void 0 === r ||
          r.refresh();
      else if (
        null !== (o = window) &&
        void 0 !== o &&
        null !== (o = o.WVSDK) &&
        void 0 !== o &&
        o.refresh
      ) {
        var a;
        null === (a = window) ||
          void 0 === a ||
          null === (a = a.WVSDK) ||
          void 0 === a ||
          a.refresh();
      }
    }.bind(void 0),
  };
  class h {
    constructor() {
      (this.pendingFetches = []), (this.failedFetches = []), (this.tier = null);
    }
    customFetch(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return fetch(e, n)
        .then(
          function (o) {
            var s = this;
            t(this, i);
            const l = this.pendingFetches.findIndex(
              function (i) {
                return (
                  t(this, s),
                  i.url === e && JSON.stringify(i.options) === JSON.stringify(n)
                );
              }.bind(this)
            );
            return l > -1 && this.pendingFetches.splice(l, 1), o;
          }.bind(this)
        )
        .catch(
          function (o) {
            var s = this;
            t(this, i), console.error("Fetch for " + e + " failed:", o);
            const l = this.pendingFetches.findIndex(
              function (i) {
                return (
                  t(this, s),
                  i.url === e && JSON.stringify(i.options) === JSON.stringify(n)
                );
              }.bind(this)
            );
            return (
              l > -1 &&
                (this.pendingFetches.splice(l, 1),
                this.failedFetches.push({ url: e, options: n })),
              o
            );
          }.bind(this)
        );
    }
    performFetch(e, t) {
      return (
        this.pendingFetches.push({ url: e, options: t }), this.customFetch(e, t)
      );
    }
    getPendingCount() {
      return this.pendingFetches.length;
    }
    getPendingCountEnd() {
      var e = this;
      let i = new Date();
      return (
        this.tier && (clearInterval(this.tier), (this.tier = null)),
        new Promise(
          function (n) {
            var o = this;
            t(this, e),
              (this.tier = setInterval(
                function () {
                  t(this, o),
                    this.pendingFetches.length
                      ? new Date() - i > 4e3 &&
                        (n(!0), clearInterval(this.tier))
                      : n(!0);
                }.bind(this),
                1e3
              ));
          }.bind(this)
        )
      );
    }
    retryFailedFetches() {
      var e = this;
      const i = [].concat(this.failedFetches);
      return (
        (this.failedFetches = []),
        new Promise(
          function (n) {
            var o = this;
            t(this, e);
            let s = i.length;
            s
              ? i.forEach(
                  function (e) {
                    var i = this;
                    t(this, o),
                      this.performFetch(e.url, e.options)
                        .then(
                          function () {
                            t(this, i), 0 == --s && n(s);
                          }.bind(this)
                        )
                        .catch(
                          function (o) {
                            t(this, i),
                              console.error(
                                "Retry of failed fetch for " +
                                  e.url +
                                  " failed again:",
                                o
                              ),
                              0 == --s && n(s);
                          }.bind(this)
                        );
                  }.bind(this)
                )
              : n(0);
          }.bind(this)
        )
      );
    }
  }
  var u = "0.2.6";
  class f {
    constructor(e) {
      var i = this;
      (this.CHILD_LEVEL_NAME = "sdk_chlid_level"),
        (this.fetchManager = new h()),
        (this.authorization = ""),
        (this.TEMPLATE_ID = this.getOfferKey()
          ? this.getOfferKey().split("/")[0]
            ? "" + this.getOfferKey().split("/")[0]
            : this.getOfferTpl() + "_tpl"
          : this.getWinConfig().templateId),
        (this.ABVERSION = ""),
        (this.DEV = !1),
        (this.openOfferClick = !1),
        (this.openOffer = !1),
        (this.offerClickType = ""),
        (this.PLUGIN = !1),
        (this.cacheChildLevel = Number(
          this.getCache(this.CHILD_LEVEL_NAME)
            ? this.getCache(this.CHILD_LEVEL_NAME)
            : "0"
        )),
        (this.START_VERIFY_LIST = window.offerView
          ? JSON.parse(window.offerView)
          : null),
        (this.groupWith = 0),
        (this.LOG_TEST = !1),
        (this.startInterAction = new Date()),
        (this.tardom = null),
        (this.LEVEL_TIME_COUNT_NAME = "sdk_time_level"),
        (this.streanTime = this.getCache(this.LEVEL_TIME_COUNT_NAME)
          ? new Date(this.getCache(this.LEVEL_TIME_COUNT_NAME))
          : new Date()),
        (this.version = u),
        (this.cache = "tp_sdk"),
        (this.BALCK_TAGIDS = ["btn", "abgcp", "abgl", "open-survey"]),
        (this.ADS_ORIGIN = ["doubleclick.net", "googleadservices.com"]),
        (this.STAT_INFO = {}),
        (this.URL = window.location.href),
        (this.whiteIframeTrackList = ["jscode_ads_show_detail"]),
        (this.webviewVisible = !0),
        (this.SESSION_CODE = ""),
        (this.OFFSET_INDEX = ""),
        (this.custerSeting = Object.assign(
          {
            SDK_MESSAGE: function (e) {
              t(this, i), console.log(e);
            }.bind(this),
          },
          (null == e ? void 0 : e.custerSeting) || []
        )),
        (this.platform = this.isIOS() ? "ios" : "android"),
        (this.enumType = {
          version: "VERSION",
          childRate: "CHILD_RATE",
          passClickOpen: "PASS_CLICK_OPEN",
          limit: "AD_LIMIT_TO_SEND_TIME",
          inView: "VIEW_TIME_IF_IN_WINDOW_LIMIT",
          viewWait: "VIEW_WAIT",
          scrollAdRate: "SCROLL_AD_RATE",
          scrollCount: "SCROLL_RATE_LIMIT",
          name: "UP_STREARN",
          compat: "COMPAT",
          toTop: "TO_TOP",
          scrollTo: "SCROLL_TO",
          scrollList: "SCROLL_LIST",
          scrollTime: "SCROLL_TIME",
          toEnd: "TO_END",
          level: "TO_LEVEL",
          isFullRate: "CHANGE_FULL_RATE",
          fullShowRate: "VIEW_FULL_RATE",
          scrollAdInterval: "SCROLL_AD_INTERVAL",
          adSolut: "AD_SOLUTIONS",
          scheme: "SCHEME_TYPE",
          hotRate: "HOT_RATE",
          pingTime: "PING_TIME",
          schemeTime: "SCHEME_TIME",
          fullShowTime: "FULL_SHOW_TIME",
          dev: "DEV",
          actions: "PAGE_ACTIONS",
          defaultAt: "DEFAULT_AT",
          secActions: "SEC_ACTIONS",
          resetActions: "RESET_ACTIONS",
          groupRate: "GROUP_RATE",
          logTest: "LOG_TEST",
          limitWait: "LIMIT_WAIT",
          transformRate: "TRANSFORM_RATE",
          transformUrl: "TRANSFORM_URL",
        }),
        (this.TRACK_NOW_EVENT_NAME_LIST = [
          "jscode_open_webview",
          "jscode_init_sdk",
          "jscode_loading_timeout",
          "jscode_init_sdk_wait",
          "jscode_ads_show_ad",
          "jscode_custom_transform_start_news",
          "jscode_custom_transform_start_website",
          "jscode_custom_transform_start_form",
          "jscode_custom_transform_start_shop",
          "jscode_custom_transform_start_other",
          "jscode_time_ended",
          "jscode_ads_click",
          "jscode_collect_click_ads",
          "jscode_no_allow_click",
          "jscode_ads_click_client",
          "jscode_ad_confirm_client",
          "jscode_pass_click",
          "jscode_dsp_error_type",
          "jscode_stan_click",
          "jscode_ads_fill_all",
          "jscode_custom_transform_start",
          "jscode_host_url_suc",
          "jscode_get_info_success",
          "jscode_ad_confirm",
          "jscode_ad_offer",
          "jscode_reset_transform",
          "jscode_reset_refresh",
          "jscode_finish_action",
          "jscode_finish_action_click",
          "jscode_finish_action_monitor",
          "jscode_finish_action_machine",
          "jscode_finish_action_code",
          "jscode_finish_action_error",
          "jscode_finish_action_form",
          "jscode_finish_action_timeout",
          "jscode_finish_action_normal",
          "jscode_finish_action_view",
          "jscode_ads_refresh",
          "jscode_offer_finish",
          "jscode_ad_load",
          "jscode_offer_close",
          "jscode_offer_send",
          "jscode_offer_send_cancel",
          "jscode_collect_offer",
          "jscode_task_onFound",
          "jscode_offer_cancel",
        ]),
        (this.CUSTOMIZE_AD = {}),
        (this.CUSTOMIZE_AD_MAP = new Map([
          [
            "beesads",
            {
              platform: "beesads",
              adPlatformRule: function (e) {
                return t(this, i), e.querySelector("iframe");
              }.bind(this),
              getAdStatus: function (e) {
                return (
                  t(this, i), e.querySelector("iframe") ? "filled" : "unfilled"
                );
              }.bind(this),
              checkInsertAd: function () {
                var e = this;
                t(this, i);
                const n = document.querySelectorAll("div[data-ads-id]"),
                  o = [];
                return (
                  n.forEach(
                    function (i) {
                      var n;
                      t(this, e);
                      i.querySelector("div[id^=google_ads_iframe]") ||
                        i.querySelector("iframe[id^=google_ads_iframe]") ||
                        (null == i || null === (n = i.id) || void 0 === n
                          ? void 0
                          : n.includes("google_ads_iframe")) ||
                        o.push(i);
                    }.bind(this)
                  ),
                  o
                );
              }.bind(this),
              click: function (e, n, o) {
                t(this, i), e.doClick(n, o);
              }.bind(this),
            },
          ],
        ])),
        (this.DEFAULT_PARAMS = {}),
        (this.tplId = this.getTopLevelDomain().split(".").join("-"));
    }
    checkIsTranformMonited() {
      var e;
      return null === (e = this.START_VERIFY_LIST) || void 0 === e
        ? void 0
        : e.offerId;
    }
    getOfferId() {
      var e;
      return null === (e = this.START_VERIFY_LIST) || void 0 === e
        ? void 0
        : e.offerId;
    }
    getOfferTpl() {
      var e;
      return null === (e = this.START_VERIFY_LIST) || void 0 === e
        ? void 0
        : e.offerTemplateUrl;
    }
    getOfferKey() {
      var e;
      return null === (e = this.START_VERIFY_LIST) || void 0 === e
        ? void 0
        : e.offerKey;
    }
    updateOfferView(e) {
      this.START_VERIFY_LIST = e;
    }
    getCapIsActive() {
      return window.rapGrecaptchaIsActive;
    }
    updateGrupWidth(e) {
      this.groupWith = e;
    }
    updateTEST(e) {
      this.LOG_TEST = "1" == e;
    }
    setabVer(e) {
      this.ABVERSION = e;
    }
    setConfigUrl(e) {
      this.URL = e;
    }
    setISOpenOfferClick(e) {
      this.openOfferClick = e;
    }
    setISOpenOffer(e) {
      this.openOffer = e;
    }
    getOpenOffer() {
      return this.openOffer;
    }
    getOfferClickType() {
      return this.offerClickType;
    }
    setClickType(e) {
      this.offerClickType = e;
    }
    getOpenOfferClick() {
      return this.openOfferClick;
    }
    setISDev(e) {
      this.DEV = e;
    }
    setTemplateId(e) {
      this.TEMPLATE_ID = e;
    }
    getTemplateId() {
      return this.TEMPLATE_ID;
    }
    setISPlugin(e) {
      this.PLUGIN = e;
    }
    setSessionCode(e) {
      this.SESSION_CODE = e;
    }
    setOffsetIndex(e) {
      this.OFFSET_INDEX = e;
    }
    setAdProbabilityEvents(e) {
      console.log("", e), (this.STAT_INFO = e);
    }
    adTypeCallback(e) {
      var t;
      let i = "",
        n = window.innerHeight,
        o =
          null != e && e.closest("ins")
            ? e.closest("ins")
            : null != e && e.closest("div")
            ? null == e
              ? void 0
              : e.closest("div")
            : e,
        s = null == o ? void 0 : o.getBoundingClientRect(),
        l =
          null !== (t = e.style) && void 0 !== t && t.height
            ? parseFloat(e.style.height)
            : 250;
      if (e && s) {
        var r, a, d;
        i =
          (n != s.height &&
            "100vh" !=
              (null === (r = o.style) || void 0 === r ? void 0 : r.height) &&
            l != n) ||
          "fixed" !=
            (null === (a = o.style) || void 0 === a ? void 0 : a.position)
            ? "fixed" ==
                (null === (d = o.style) || void 0 === d
                  ? void 0
                  : d.position) || s.height <= 55
              ? "banner"
              : (s.height >= 150 || s.height, "other")
            : "full";
      }
      return i;
    }
    setCache(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : this.cache;
      sessionStorage.setItem(t, e);
    }
    getCache() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : this.cache;
      return sessionStorage.getItem(e);
    }
    removeCache() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : this.cache;
      sessionStorage.removeItem(e);
    }
    awaitReportThenGo() {
      var e = this;
      return (
        this.log("------------------------------------"),
        new Promise(
          async function (i, n) {
            var o = this;
            t(this, e),
              this.setTry(
                function () {
                  t(this, o);
                  const e = new Date(),
                    i = e - this.startInterAction + 2e3;
                  this.log("", i),
                    this.track("jscode_action_time_ended", { timeEnd: i }),
                    this.setCache(e, this.LEVEL_TIME_COUNT_NAME);
                  const n = e - this.streanTime + 2e3;
                  this.track("jscode_time_ended", { timeEnd: n });
                }.bind(this)
              ),
              this.log("------------------------------------"),
              i(!0);
          }.bind(this)
        )
      );
    }
    async asyncOperation(e, i, n) {
      var o = this;
      return new Promise(
        async function (s, l) {
          t(this, o);
          try {
            await this.promiseAwait(1e3),
              await e(),
              n
                ? (await this.promiseAwait(1e3), s("ok"))
                : (await this.promiseAwait(i), s("ok"));
          } catch (e) {
            console.dir(e), this.track("jscode_stream_error"), s("error");
          }
        }.bind(this)
      );
    }
    insertCheckReset() {
      var e, t, i, n, o;
      return (
        (null === (e = document.head) ||
        void 0 === e ||
        null === (e = e.querySelectorAll("meta")) ||
        void 0 === e
          ? void 0
          : e.length) > 0 &&
        (null === (t = document.head) ||
        void 0 === t ||
        null === (t = t.querySelectorAll("script")) ||
        void 0 === t
          ? void 0
          : t.length) &&
        (null === (i = document) ||
        void 0 === i ||
        null === (i = i.body) ||
        void 0 === i
          ? void 0
          : i.children.length) > 0 &&
        !(
          null !== (n = location) &&
          void 0 !== n &&
          n.hostname.endsWith("safeframe.googlesyndication.com")
        ) &&
        "locale" == this.tipEnv() &&
        (null === (o = document) ||
        void 0 === o ||
        null === (o = o.querySelector("html")) ||
        void 0 === o
          ? void 0
          : o.offsetHeight) > 100
      );
    }
    async createOriginClick(e, i) {
      var o = this;
      this.log("click from>>>>>>>>>", e);
      let s = e.getAttribute("target");
      s
        ? this.track("jscode_collect_a_" + s, {
            href: null == e ? void 0 : e.href,
          })
        : this.track("jscode_collect_a_default", {
            href: null == e ? void 0 : e.href,
          }),
        null != e && e.href && null != c && c.notifyClick
          ? c.notifyClick(null == e ? void 0 : e.href)
          : (c.notifyClick("jscode_no_ads_href"),
            this.track("jscode_no_ads_href")),
        await this.awaitReportThenGo(),
        i &&
          this.track("jscode_ads_click", {
            turn_type: this.POINT_CLICK,
            type: i.type,
            adsId: null == i ? void 0 : i.id,
            platform: i.platform,
          });
      var l = this.getAdClientMouseInfo(e),
        r = new MouseEvent("click", n({ bubbles: !0, cancelable: !0 }, l));
      if ((e.dispatchEvent(r), c.startAdtimer(), !i))
        try {
          setTimeout(
            function () {
              t(this, o),
                window.top.postMessage(
                  { eventName: "link", href: null == e ? void 0 : e.href },
                  "*"
                );
            }.bind(this),
            15e3
          );
        } catch (e) {
          window.top.postMessage({ eventName: "refresh" }, "*");
        }
    }
    clearCache() {
      sessionStorage.clear();
    }
    setTry(e) {
      try {
        e();
      } catch (e) {
        try {
          this.track("jscode_ads_message", { message: e });
        } catch (e) {
          this.log("ï¼ï¼ï¼", e), this.track("jscode_ads_send_message_error");
        }
        this.log("my test is error:: ", e);
      }
    }
    check_from_iframe() {
      let e = !1;
      try {
        window.top.location.origin, window.location.origin, (e = !0);
      } catch (t) {
        e = !1;
      }
      return e;
    }
    tipEnv() {
      return this.check_from_iframe() ? "locale" : "iframe";
    }
    log() {
      var e;
      const { log: t, warn: i, error: n } = window.originalConsole || console,
        o = { log: t, warn: i, error: n };
      for (var s = arguments.length, l = new Array(s), r = 0; r < s; r++)
        l[r] = arguments[r];
      return (
        console && l && l[0] && console.dir(l[0]),
        null === (e = o.log) || void 0 === e
          ? void 0
          : e.call.apply(e, [this, this.tipEnv() + " [31m [sdk] [0m"].concat(l))
      );
    }
    isIOS() {
      return c.clientIsOs();
    }
    setDefaultParams(e) {
      this.DEFAULT_PARAMS = e;
    }
    getDefaultParams() {
      let e = {};
      try {
        var t, i, o;
        (e.sessionCode = this.SESSION_CODE),
          (e.offer_index = this.OFFSET_INDEX),
          (e.packageName =
            (null === (t = window) || void 0 === t ? void 0 : t.packageName) ||
            c.getPackageName()),
          (e.url = this.URL),
          (e.offerTemplateId = this.getTemplateId()),
          (e.templateId = this.getTemplateId()),
          (e.tplId = this.getTopLevelDomain().split(".").join("-")),
          (e.abVersion = this.ABVERSION),
          (e.groupWith = this.groupWith),
          (e.offerId =
            null === (i = this.START_VERIFY_LIST) || void 0 === i
              ? void 0
              : i.offerId),
          (e.author =
            null === (o = window.DefInfo) || void 0 === o ? void 0 : o.author),
          (e.href = this.getTopLevelUrl()),
          (e.version = this.version),
          (e.cacheLevel = this.cacheChildLevel || 0),
          (e.lang = window.navigator.language),
          (e.time = new Date().getTime()),
          (e = n(n({}, e), this.DEFAULT_PARAMS));
      } catch (e) {
        this.log("error", e);
      }
      return e;
    }
    getLogTime() {
      let e = new Date(),
        t = e.getTimezoneOffset() + 480,
        i = new Date(e.getTime() - 60 * t * 1e3),
        n = i.getFullYear(),
        o = i.getMonth() + 1;
      o = o < 10 ? "0" + o : o;
      let s = i.getDate();
      s = s < 10 ? "0" + s : s;
      let l = i.getHours();
      l = l < 10 ? "0" + l : l;
      let r = i.getMinutes();
      r = r < 10 ? "0" + r : r;
      let a = i.getSeconds();
      a = a < 10 ? "0" + a : a;
      let d = i.getMilliseconds();
      return (
        n +
        ":" +
        o +
        ":" +
        s +
        " " +
        l +
        ":" +
        r +
        ":" +
        a +
        "." +
        (d < 10 ? "00" + d : d < 100 ? "0" + d : d)
      );
    }
    generate32BitRandom() {
      let e = "";
      for (let t = 0; t < 8; t++)
        for (let t = 0; t < 4; t++)
          e += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
      return e;
    }
    createback(e, i, n) {
      var o = this,
        s = document.createElement("script");
      let l = e.replace("__random_code__", this.generate32BitRandom());
      if (i) {
        if (
          ((l = l.replace("__ad_placement__", n.type)),
          "jscode_ad_confirm_client" == i &&
            ((l = l.replace("__machine_room__", "app")), c.checkOnReqCallback))
        )
          return void c.onReqCallback(l);
        if (
          "jscode_ads_click_client" == i &&
          ((l = l.replace("__machine_room__", "web")), c.checkOnReqCallback)
        )
          return void c.onReqCallback(l);
      }
      (s.src = l),
        (s.onload = function () {
          t(this, o),
            console.log("dsp callback --------"),
            this.trackWater("jscode_dsp_callback");
        }.bind(this)),
        (s.onerror = function () {
          t(this, o),
            console.log("dsp callback -------- 1"),
            this.trackWater("jscode_dsp_callback");
        }.bind(this)),
        document.body.appendChild(s);
    }
    getAdPlatform(e) {
      return null != e &&
        e.hasAttribute("id") &&
        null != e &&
        e.id.includes("google_ads_iframe")
        ? "adx"
        : e.classList && e.classList.value.includes("adsbygoogle")
        ? "adsence"
        : e.hasAttribute("data-zoneid")
        ? "foremedia"
        : this.CUSTOMIZE_AD.adPlatformRule(e)
        ? this.CUSTOMIZE_AD.platform
        : "unknow";
    }
    getAdsenceAdStatus(e) {
      return e.getAttribute("data-ad-status")
        ? "filled" == e.getAttribute("data-ad-status") ||
          e.getAttribute("data-slotcar-rewarded")
          ? "filled"
          : "unfilled"
        : "none";
    }
    getForeMediaAdStatus(e) {
      return e.querySelector("iframe") ? "filled" : "unfilled";
    }
    getAdxAdStatus(e) {
      return e.querySelector("iframe")
        ? "true" == e.querySelector("iframe").getAttribute("data-load-complete")
          ? "filled"
          : "unfilled"
        : "none";
    }
    lookAdsStatus(e) {
      var i = this;
      let n = [];
      return (
        e.forEach(
          function (e, o) {
            var s,
              l = this;
            t(this, i), e.setAttribute("data-index", o);
            const r =
              "IFRAME" == e.nodeName
                ? e
                : null == e
                ? void 0
                : e.querySelector("iframe");
            let a =
              (null == r ? void 0 : r.id) ||
              (null == e || null === (s = e.dataset) || void 0 === s
                ? void 0
                : s.adsId) ||
              (null == e ? void 0 : e.id);
            var d;
            n.find(
              function (e) {
                return t(this, l), e.id == a;
              }.bind(this)
            ) ||
              n.push({
                status:
                  "adx" == this.getAdPlatform(e)
                    ? this.getAdxAdStatus(e)
                    : "adsence" == this.getAdPlatform(e)
                    ? this.getAdsenceAdStatus(e)
                    : "foremedia" == this.getAdPlatform(e)
                    ? this.getForeMediaAdStatus(e)
                    : null === (d = this.CUSTOMIZE_AD) || void 0 === d
                    ? void 0
                    : d.getAdStatus(e),
                dom: e,
                id: a,
                iframeDom: r,
                platform: this.getAdPlatform(e),
                type: this.adTypeCallback(e),
                index: o,
              });
          }.bind(this)
        ),
        n
      );
    }
    trackWater(e, t) {
      switch ((console.log("eventName", e), e)) {
        case "jscode_ad_show":
          for (let e in this.STAT_INFO.imp_callback) {
            let t = this.STAT_INFO.imp_callback[e];
            t && this.createback(t);
          }
          break;
        case "jscode_ads_click":
          for (let e in this.STAT_INFO.click_callback) {
            let t = this.STAT_INFO.click_callback[e];
            t && this.createback(t);
          }
      }
      try {
        var i, o, s, l;
        if (
          ((t = Object.assign(
            n({}, this.getDefaultParams()),
            { tag: "HyperSDK" },
            t
          )),
          this.isIOS() &&
            null !== (i = window) &&
            void 0 !== i &&
            null !== (i = i.webkit) &&
            void 0 !== i &&
            i.messageHandlers)
        ) {
          if (
            this.TRACK_NOW_EVENT_NAME_LIST.includes(e) &&
            null !== (o = window.webkit) &&
            void 0 !== o &&
            null !== (o = o.messageHandlers) &&
            void 0 !== o &&
            null !== (o = o.trackNow) &&
            void 0 !== o &&
            o.postMessage
          )
            null === (s = window.webkit) ||
              void 0 === s ||
              null === (s = s.messageHandlers) ||
              void 0 === s ||
              null === (s = s.trackNow) ||
              void 0 === s ||
              s.postMessage([e, JSON.stringify(t)]);
          else if (this.LOG_TEST) {
            var r;
            null === (r = window.webkit) ||
              void 0 === r ||
              null === (r = r.messageHandlers) ||
              void 0 === r ||
              null === (r = r.trackImmediately) ||
              void 0 === r ||
              r.postMessage([e, JSON.stringify(t)]);
          }
        } else window.HyperSDK && (null === (l = HyperSDK) || void 0 === l ? void 0 : l.trackImmediately) && HyperSDK.trackImmediately(e, JSON.stringify(t));
      } catch (e) {
        console.log("");
      }
    }
    track(e, t) {
      switch (e) {
        case "jscode_ads_show_ad":
          for (let e in this.STAT_INFO.imp_callback) {
            let i = this.STAT_INFO.imp_callback[e];
            i &&
              ((t = Object.assign(n({}, this.getDefaultParams()), t)),
              this.createback(i, "jscode_ads_show_ad", t));
          }
          break;
        case "jscode_ad_confirm_client":
          for (let e in this.STAT_INFO.click_callback) {
            let i = this.STAT_INFO.click_callback[e];
            i && this.createback(i, "jscode_ad_confirm_client", t);
          }
          break;
        case "jscode_ads_click":
          for (let e in this.STAT_INFO.click_callback) {
            let t = this.STAT_INFO.click_callback[e];
            t && this.createback(t);
          }
      }
      if (this.DEV && this.isIOS() && !window.appTheme)
        try {
          const i = "32D97C41A86EE53459F5D0A8",
            o = "8712DE6FB023428D84A25E84FA26E93C";
          if (i && o) {
            const s = btoa(i + ":" + o);
            t = Object.assign(
              n(n({}, this.getDefaultParams()), {}, { appkey: i }),
              t
            );
            const l = {
              eventName: e + "_h5",
              eventInfo: JSON.stringify(t),
              productVersion: "1.0",
              token: s,
              googleId: "3f6c3b1e7e8f4e9dba6f1e72f3b2a4e8",
            };
            this.log(e + " h5-> message::::", t),
              fetch("https://api.weixiangltd.net/simpleStat", {
                method: "post",
                body: JSON.stringify(l),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Basic " + s,
                },
              });
          }
        } catch (e) {
          this.log("h5", e);
        }
      try {
        var i, o, s, l;
        if (
          ((t = Object.assign(n({}, this.getDefaultParams()), t)),
          this.log(e + " -> message::::", t),
          this.isIOS() &&
            null !== (i = window) &&
            void 0 !== i &&
            null !== (i = i.webkit) &&
            void 0 !== i &&
            i.messageHandlers)
        ) {
          if (
            this.TRACK_NOW_EVENT_NAME_LIST.includes(e) &&
            null !== (o = window.webkit) &&
            void 0 !== o &&
            null !== (o = o.messageHandlers) &&
            void 0 !== o &&
            null !== (o = o.trackNow) &&
            void 0 !== o &&
            o.postMessage
          )
            null === (l = window.webkit) ||
              void 0 === l ||
              null === (l = l.messageHandlers) ||
              void 0 === l ||
              null === (l = l.trackNow) ||
              void 0 === l ||
              l.postMessage([e, JSON.stringify(t)]);
          else if (
            this.LOG_TEST &&
            null !== (s = window.webkit) &&
            void 0 !== s &&
            null !== (s = s.messageHandlers) &&
            void 0 !== s &&
            null !== (s = s.trackImmediately) &&
            void 0 !== s &&
            s.postMessage
          ) {
            var r;
            null === (r = window.webkit) ||
              void 0 === r ||
              null === (r = r.messageHandlers) ||
              void 0 === r ||
              null === (r = r.trackImmediately) ||
              void 0 === r ||
              r.postMessage([e, JSON.stringify(t)]);
          } else if (this.LOG_TEST) {
            var a;
            null === (a = window.webkit) ||
              void 0 === a ||
              null === (a = a.messageHandlers) ||
              void 0 === a ||
              null === (a = a.tracker) ||
              void 0 === a ||
              a.postMessage(e);
          }
        } else this.TRACK_NOW_EVENT_NAME_LIST.includes(e) && null != c && c.track ? c.track(e, JSON.stringify(t)) : this.LOG_TEST && c.trackImmediately(e, JSON.stringify(t));
      } catch (e) {
        this.log("error !!!!!!!!!!", e);
      }
    }
    scrollElement() {
      var e,
        i = this;
      let n =
        "HTML" ==
        (null === (e = document.scrollingElement) || void 0 === e
          ? void 0
          : e.tagName)
          ? window
          : document.scrollingElement || window;
      const o = window.innerHeight;
      if (n.scrollHeight && o == n.scrollHeight) {
        document.querySelectorAll("*").forEach(
          function (e) {
            t(this, i);
            const s = e.scrollHeight;
            s > o &&
              s != e.offsetHeight &&
              ((n = e.parentNode), n.scrollHeight == o && (n = e));
          }.bind(this)
        );
      }
      return n;
    }
    async scrollToPosition() {
      var e = this;
      let i =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : window,
        n = arguments.length > 1 ? arguments[1] : void 0,
        o =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2e3;
      return new Promise(
        function (s) {
          var l = this;
          t(this, e);
          let r = n,
            a = performance.now(),
            d = this.randomTime(o);
          if (!c.clientIsOs() && c.scrollToIsCheck && c.scrollTo) {
            var h, u, f;
            let v =
                (null === (h = this.deviceScrollWindow) || void 0 === h
                  ? void 0
                  : h.scrollHeight) ||
                (null === (u = this.deviceScrollWindow) ||
                void 0 === u ||
                null === (u = u.document) ||
                void 0 === u ||
                null === (u = u.scrollingElement) ||
                void 0 === u
                  ? void 0
                  : u.scrollHeight) ||
                (null === (f = document.body) || void 0 === f
                  ? void 0
                  : f.scrollHeight),
              m = 0 == r ? 0.01 : r / v == 1 ? 0.99 : r / v;
            return (
              this.track("jscode_scroll_client", { window: v, percent: m }),
              c.scrollTo(m, d),
              void setTimeout(
                function () {
                  t(this, l), s();
                }.bind(this),
                d + 1e3
              )
            );
          }
          {
            function g() {
              let e = i.pageYOffset || document.documentElement.scrollTop;
              const t = performance.now() - a;
              if (t >= d) i.scrollTo({ top: r, behavior: "smooth" }), s();
              else {
                const n = e + (t / d) * (r - e);
                i.scrollTo({ top: n, behavior: "smooth" }),
                  requestAnimationFrame(g);
              }
            }
            requestAnimationFrame(g);
          }
        }.bind(this)
      );
    }
    getAdClientMouseInfo(e) {
      var t;
      const i = (e && (null == e ? void 0 : e.querySelector("iframe"))) || e;
      if (!i) return;
      const n = i.getBoundingClientRect(),
        o =
          Math.random() > 0.3
            ? 0.5 * Math.random() + 0.3
            : 0.2 * Math.random() + 0.3,
        s =
          Math.random() > 0.3
            ? Math.random() > 0.7
              ? 0.5 * Math.random() + 0.2
              : 0.5 * Math.random() + 0.3
            : 0.2 * Math.random() + 0.3,
        l = { clientX: o * n.width + n.x, clientY: s * n.height + n.y };
      var r;
      null !== (t = this.scrollElement()) &&
        void 0 !== t &&
        t.scrollTop &&
        (l.clientY =
          l.clientY +
          (null === (r = this.scrollElement()) || void 0 === r
            ? void 0
            : r.scrollTop));
      return this.log("clientRect::", n, l), l;
    }
    getDomMouseInfo(e) {
      const t = null == e ? void 0 : e.getBoundingClientRect(),
        i =
          Math.random() > 0.3
            ? 0.5 * Math.random() + 0.3
            : 0.2 * Math.random() + 0.3,
        n =
          Math.random() > 0.3
            ? Math.random() > 0.7
              ? 0.5 * Math.random() + 0.2
              : 0.5 * Math.random() + 0.3
            : 0.2 * Math.random() + 0.3,
        o = {
          linkType: null == e ? void 0 : e.target,
          clientX:
            i * (null == t ? void 0 : t.width) + (null == t ? void 0 : t.x),
          clientY:
            n * (null == t ? void 0 : t.height) + (null == t ? void 0 : t.y),
        };
      return this.log("clientRect::", t, o), o;
    }
    filterNoClickCheck(e) {
      var i = this;
      let n = !0;
      return (
        "none" == (null == e ? void 0 : e.style["pointer-events"]) && (n = !1),
        Array.from(null == e ? void 0 : e.querySelectorAll("iframe")).length &&
          Array.from(null == e ? void 0 : e.querySelectorAll("iframe")).find(
            function (e) {
              return t(this, i), "about:blank" == e.src;
            }.bind(this)
          ) &&
          (n = !1),
        "none" == (null == e ? void 0 : e.style["pointer-events"]) && (n = !1),
        n
      );
    }
    async createClick(e) {
      try {
        var t = this.getAdClientMouseInfo(e),
          i = new MouseEvent("click", n({ bubbles: !0, cancelable: !0 }, t));
        this.log("-frame", e, t), e.dispatchEvent(i);
      } catch (t) {
        e && e.click();
      }
    }
    promiseAwait(e) {
      var i = this;
      let n =
        !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
          ? this.randomTime(e)
          : e;
      return new Promise(
        function (e, o) {
          var s = this;
          t(this, i),
            setTimeout(
              function () {
                t(this, s), e(n);
              }.bind(this),
              n
            );
        }.bind(this)
      );
    }
    async pointerEvent(e) {
      var t = this.getAdClientMouseInfo(e),
        i = new PointerEvent(
          "pointerdown",
          n(
            {
              bubbles: !0,
              cancelable: !0,
              pointerId: 1,
              pointerType: "touch",
              isPrimary: !0,
            },
            t
          )
        );
      e.dispatchEvent(i), await this.promiseAwait(100);
      var o = new PointerEvent(
        "pointerup",
        n(
          {
            bubbles: !0,
            cancelable: !0,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: !0,
          },
          t
        )
      );
      e.dispatchEvent(o);
      var s = new MouseEvent("click", n({ bubbles: !0, cancelable: !0 }, t));
      e.dispatchEvent(s);
    }
    getAdsInfo() {
      var e = this;
      let i = { img: "", title: "", desc: "", href: "" };
      if ("iframe" !== this.tipEnv()) return i;
      let n = document.querySelector(".GoogleActiveViewElement"),
        o = document.querySelector("#google_image_div");
      if (n || o) {
        let s = (n || o).querySelectorAll(
          'a[href^="https://www.googleadservices.com/pagead/aclk"], a[href^="https://ad.doubleclick.net/pcs/click"], a[href^="https://googleads.g.doubleclick.net/aclk"]'
        );
        if (
          (s && (s = Array.from(s)),
          s.forEach(
            function (n) {
              var o, s, l, r, a;
              if (
                (t(this, e), n.dataset && n.dataset.asochTargets) &&
                (null !== (o = n.dataset.asochTargets) &&
                  void 0 !== o &&
                  o.includes("titleClk") &&
                  (i.title += n.innerHTML + " "),
                null !== (s = n.dataset.asochTargets) &&
                  void 0 !== s &&
                  s.includes("bodyClk") &&
                  (i.desc = n.innerHTML),
                null !== (l = n.dataset.asochTargets) &&
                  void 0 !== l &&
                  l.includes("ochTitle") &&
                  (i.title += n.innerHTML + " "),
                null !== (r = n.dataset.asochTargets) &&
                  void 0 !== r &&
                  r.includes("ochUrl") &&
                  (i.desc = n.innerHTML),
                null !== (a = n.dataset.asochTargets) &&
                  void 0 !== a &&
                  a.includes("ochImage") &&
                  n.querySelector(".image"))
              ) {
                var d;
                let e = n.querySelector(".image"),
                  t =
                    null === (d = window) || void 0 === d
                      ? void 0
                      : d.getComputedStyle(e);
                i.img = null == t ? void 0 : t.backgroundImage;
              }
              if (n.querySelector('img[alt="Advertisement"]')) {
                let e = n.querySelector('img[alt="Advertisement"]');
                i.img = e.src;
              }
              if (n.querySelector('img[class^="i-amphtml-fill-content"]')) {
                let e = n.querySelector('img[class^="i-amphtml-fill-content"]');
                i.img = e.src;
              }
              i.href = n.href;
            }.bind(this)
          ),
          i.img)
        ) {
          const e = /url\(["']([^"']+)["']\)/.exec(i.img);
          i.img = e ? e[1] : i.img;
        }
        return i;
      }
    }
    setMuted() {
      var e = this;
      this.setTry(
        function () {
          t(this, e);
          for (
            var i = document.getElementsByTagName("audio"), n = 0;
            n < (null == i ? void 0 : i.length);
            n++
          )
            i[n].muted = !0;
          var o = document.getElementsByTagName("video");
          for (n = 0; n < (null == o ? void 0 : o.length); n++) o[n].muted = !0;
          (window.AudioContext = {}), (window.webkitAudioContext = {});
        }.bind(this)
      );
    }
    randomTime(e) {
      const t = 0.4 * e,
        i = 1.6 * e;
      return Math.random() * (i - t) + t;
    }
    cteateDiv(e, t) {
      const i = document.querySelector("html"),
        n = document.createElement("div");
      (n.className = "iddddddd---cccc"),
        (n.style.position = "fixed"),
        (n.style.width = "30px"),
        (n.style.height = "30px"),
        (n.style.zIndex = "9999"),
        (n.style.backgroundColor = "green"),
        (n.style.borderRadius = "0"),
        (n.style.left = e + "px"),
        (n.style.top = t + "px"),
        console.log("cteateDivï¼š", e, t, window.devicePixelRatio),
        i.appendChild(n);
    }
    createDivByDom(e) {
      const t = e.getBoundingClientRect().x + 1,
        i = e.getBoundingClientRect().y + 1;
      this.cteateDiv(t, i);
    }
    getClickDom() {
      var e = this;
      let i =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : document,
        n = arguments.length > 1 ? arguments[1] : void 0,
        o = arguments.length > 2 ? arguments[2] : void 0;
      var s = Array.from(i.querySelectorAll("a")),
        l = this.ADS_ORIGIN,
        r = ["HTML", "SCRIPT", "META", "LINK", "P"];
      let a = [],
        d = null;
      const c = function (i) {
        for (t(this, e); i; ) {
          if (this.BALCK_TAGIDS.includes(i.id)) return !0;
          i = i.parentNode;
        }
        return !1;
      }.bind(this);
      if ((console.log("allADomA2", s), "foremedia" === o))
        a = s = s.filter(
          function (i) {
            return t(this, e), null == i ? void 0 : i.href;
          }.bind(this)
        );
      else
        for (let i in s) {
          let o = s[i];
          if (!r.includes(o.nodeName)) {
            if (c(o)) continue;
            if (
              o.href &&
              !n &&
              l.find(
                function (i) {
                  return (
                    t(this, e),
                    o.href.includes(i) &&
                      (o.href.includes("adurl=") || o.href.includes("url="))
                  );
                }.bind(this)
              )
            ) {
              a.push(o);
              continue;
            }
            o.href && n && a.push(o);
          }
        }
      if ((console.log("validDoms------\x3e>>>>>", a), a.length > 0)) {
        a = a.filter(
          function (i) {
            t(this, e);
            const { x: n, y: o } = i.getBoundingClientRect();
            return n >= 0 && o >= 0;
          }.bind(this)
        );
        const i = Math.floor(Math.random() * a.length);
        console.log("validDoms------\x3e>>>>>", i, a), (d = a[i]);
      }
      return d;
    }
    isParentHidden(e) {
      let t = e.closest("*");
      for (; t; ) {
        var i;
        const e =
          null === (i = window) || void 0 === i
            ? void 0
            : i.getComputedStyle(t);
        if (e && "none" === e.display) return !0;
        t = t.parentElement;
      }
      return !1;
    }
    debounce(e, i) {
      var n = this;
      let o;
      return function () {
        t(this, n), clearTimeout(o), (o = setTimeout(e, i));
      }.bind(this);
    }
    parseUrlParams(e) {
      const t = e ? e.split("?")[1] : window.location.search.substring(1);
      if (!t) return {};
      const i = {},
        n = t.split("&");
      for (let e = 0; e < n.length; e++) {
        const t = n[e].split("="),
          o = this.safeDecodeURIComponent(t[0]),
          s = t.length > 1 ? this.safeDecodeURIComponent(t[1]) : "";
        if (o.endsWith("[]")) {
          const e = o.slice(0, -2);
          (i[e] = i[e] || []), i[e].push(s);
        } else i[o] = s;
      }
      return i;
    }
    safeDecodeURIComponent(e) {
      try {
        return decodeURIComponent(e);
      } catch (t) {
        return console.warn("Failed to decode URI component:", e, t), e;
      }
    }
    getTopLevelDomain() {
      var e,
        i = this;
      let n = this.ADS_ORIGIN.find(
          function (e) {
            return t(this, i), window.location.hostname.includes(e);
          }.bind(this)
        ),
        o = location.href
          ? this.safeDecodeURIComponent(location.href).split(/adurl=|url=/)
          : [],
        s = o[o.length - 1];
      const l = n && s ? s : window.location.hostname,
        r = n ? l.split("/") : l.split(".");
      let a = function (e) {
        return (
          t(this, i),
          e.length > 2 && "www" == e[0]
            ? e.slice(1).join(".")
            : e.slice(0).join(".")
        );
      }.bind(this);
      return a(
        n ? (null === (e = r[2]) || void 0 === e ? void 0 : e.split(".")) : r
      );
    }
    getTopLevelUrl() {
      var e = this;
      let i = this.ADS_ORIGIN.find(
          function (i) {
            return t(this, e), window.location.hostname.includes(i);
          }.bind(this)
        ),
        n = location.href
          ? this.safeDecodeURIComponent(location.href).split(/adurl=|url=/)
          : [],
        o = n[n.length - 1];
      return i ? o : window.location.href;
    }
    parseConfig(e) {
      var i = this;
      let n;
      if (e && e.split(",").length > 1) {
        const o = {};
        e
          .split(" ")
          .join("")
          .split(",")
          .forEach(
            function (e) {
              t(this, i);
              const n = e && e.split(":");
              n &&
                this.enumType[n[0]] &&
                ("name" === n[0] && (n[1] = n[1].toLowerCase()),
                (o[this.enumType[n[0]]] = n[1] || this[this.enumType[n[0]]]));
            }.bind(this)
          ),
          (o.CONFIG_NAME = e),
          (n = o);
      } else e && (n = { UP_STREARN: e && e.toLowerCase() });
      return n;
    }
    clearWinConfig() {
      c.setWinConfig &&
        (this.log("clear>>>>>>> winConfig"),
        (window.defaultWinCnfig = ""),
        c.setWinConfig(JSON.stringify({})));
    }
    setWinConfig(e) {
      if (c.setWinConfig) {
        const t = (null == this ? void 0 : this.getWinConfig()) || {};
        console.log("dir.....set>>>>>>>>>>", t, e);
        const i = JSON.stringify(Object.assign(t, e));
        (window.defaultWinCnfig = i), c.setWinConfig(i);
      }
    }
    async parseBannerContent(e) {
      if (e) {
        const t = e.match(/<iframe[^>]+src="([^"]+)"/);
        if (t && t[1]) return t[1];
      }
    }
    getCacheWinConfig() {
      var e = this;
      return (
        c.getWinConfig(),
        new Promise(
          function (i) {
            var n = this;
            t(this, e),
              c.getWinConfig(),
              setTimeout(
                function () {
                  t(this, n);
                  let e = "";
                  if (
                    "string" == typeof window.getWinConfig &&
                    window.getWinConfig
                  )
                    try {
                      e = JSON.parse(window.getWinConfig);
                    } catch (e) {
                      console.dir(e);
                    }
                  else e = window.getWinConfig;
                  i(e);
                }.bind(this),
                2e3
              );
          }.bind(this)
        )
      );
    }
    getWinConfig() {
      let e = window.defaultWinCnfig;
      if ("string" == typeof e && e)
        try {
          e = JSON.parse(e);
        } catch (e) {
          console.dir(e);
        }
      return e || {};
    }
    setCookie(e, t) {
      let i =
        encodeURIComponent(e) + "=" + encodeURIComponent(JSON.stringify(t));
      (i += "; domain=" + this.getTopLevelDomain()), (document.cookie = i);
    }
    deleteCookie(e) {
      try {
        document.cookie =
          encodeURIComponent(e) +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
          location.origin.split(".").splice(1).join(".");
      } catch (e) {
        console.log(e);
      }
    }
    getCookie(e) {
      const t = document.cookie.split("; ");
      for (const i of t) {
        const [t, n] = i.split("=");
        if (this.safeDecodeURIComponent(t) === e) {
          let e = "";
          try {
            e = JSON.parse(this.safeDecodeURIComponent(n));
          } catch (t) {
            e = this.safeDecodeURIComponent(n);
          }
          return e;
        }
      }
      return null;
    }
    listenerBeforeUnload(e) {
      var i = this;
      window.addEventListener(
        "beforeunload",
        function (n) {
          t(this, i),
            console.log("be refrsh tooltip back >>>>>>>>>>> ", n),
            e && e();
        }.bind(this)
      );
    }
  }
  class v extends f {
    constructor(e) {
      super(e);
    }
    setDomAttrVisit(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "block";
      e.style.setProperty("display", t, "important");
    }
    checkCookieTipDialog() {
      var e = this;
      let i =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0.9;
      this.setTry(
        function () {
          var n = this;
          t(this, e);
          const o = async function () {
            t(this, n);
            let e = document.querySelector(
                ".fc-footer-buttons-container .fc-footer-buttons"
              ),
              s = document.querySelector(".cc-btn.cc-dismiss");
            e
              ? (i > Math.random()
                  ? this.createClick(e.querySelector(".fc-primary-button"))
                  : (this.createClick(e.querySelector(".fc-secondary-button")),
                    await this.promiseAwait(2e3),
                    this.createClick(
                      document.querySelector(".fc-data-preferences-accept-all")
                    )),
                (this.checkCookieCache = null),
                cancelAnimationFrame(this.checkCookieCache))
              : s
              ? s.click()
              : (this.checkCookieCache = requestAnimationFrame(o));
          }.bind(this);
          this.checkCookieCache = requestAnimationFrame(o);
        }.bind(this)
      );
    }
    closeAdsPopup() {
      var e = this;
      this.setTry(
        function () {
          t(this, e),
            document.querySelector(".ads-popup") &&
              "none" != document.querySelector(".ads-popup").style.display &&
              this.pointerEvent(
                document.querySelector(".van-popup__close-icon")
              ),
            document.querySelector("#dialogAd") &&
              "none" != document.querySelector("#dialogAd").style.display &&
              this.pointerEvent(document.querySelector("#closeButton")),
            document.querySelector(".uni-modal") &&
              "none" != document.querySelector(".uni-modal").style.display &&
              this.pointerEvent(
                document.querySelector(".uni-modal__btn_default")
              ),
            document.querySelector(".uni-modal__btn_default") &&
              document.querySelector(".uni-modal__btn_default").click(),
            document.querySelector("#m2_bot_captcha") &&
              (document.querySelector("#m2_bot_captcha").style.display =
                "none"),
            document.querySelector("#ats-interstitial-button") &&
              this.pointerEvent(
                document.querySelector("#ats-interstitial-button")
              );
        }.bind(this)
      );
    }
    setCacheDefault(e) {
      (this.isCahceDefault = !0), (this.cacheId = e), this.setCache(e);
    }
    deviceRectWhereDom(e) {
      var i = this;
      let n = [],
        o = window.innerHeight;
      return (
        this.lookAdsStatus(e).forEach(
          function (e) {
            var s = this;
            t(this, i),
              this.setTry(
                function () {
                  if (
                    (t(this, s),
                    e.dom &&
                      e.dom.style &&
                      "none" != e.dom.style.display &&
                      "filled" == e.status)
                  ) {
                    let t = e.dom.getBoundingClientRect();
                    t.top >= 0 && t.top <= o - t.height / 2 && n.push(e);
                  }
                }.bind(this)
              );
          }.bind(this)
        ),
        n
      );
    }
    deviceRectWhereDomUnSetAd(e) {
      var i = this;
      let n = [],
        o = window.innerHeight;
      return (
        e.forEach(
          function (e) {
            var s = this;
            t(this, i),
              this.setTry(
                function () {
                  if (
                    (t(this, s),
                    e.dom &&
                      e.dom.style &&
                      "none" != e.dom.style.display &&
                      "filled" == e.status)
                  ) {
                    let t = e.dom.getBoundingClientRect();
                    t.top >= 0 && t.top <= o - t.height / 2 && n.push(e);
                  }
                }.bind(this)
              );
          }.bind(this)
        ),
        n
      );
    }
    scrollAdTo(e) {
      if (e)
        if ("number" == typeof e) {
          var t;
          null === (t = this.deviceScrollWindow) ||
            void 0 === t ||
            t.scrollTo({ top: e, behavior: "smooth" });
        } else {
          var i;
          let t = e.getBoundingClientRect().top;
          null === (i = this.deviceScrollWindow) ||
            void 0 === i ||
            i.scrollTo({ top: t, behavior: "smooth" }),
            this.custerSeting.SCROLL_AD_CALLBACK(e);
        }
      else this.log("");
    }
    createfromCLientClick(e) {
      if (c.setThemeOnce) {
        const t = e.getBoundingClientRect(),
          i = Number(
            ((t.x + t.width * Math.random()) * window.devicePixelRatio).toFixed(
              5
            )
          ),
          n = Number(
            (
              (t.y + t.height * Math.random()) *
              window.devicePixelRatio
            ).toFixed(5)
          );
        this.track("jscode_stan_click"), c.setThemeOnce(i, n);
      }
    }
    scrollTo(e) {
      var t;
      null === (t = this.deviceScrollWindow) ||
        void 0 === t ||
        t.scrollTo({ top: e, left: 0, behavior: "smooth" });
    }
    getElementTop(e) {
      const t = e.getBoundingClientRect(),
        i = this.scrollElement(),
        n = window.pageYOffset || (null == i ? void 0 : i.scrollTop) || 1;
      return t.top + n;
    }
    debounce(e, i) {
      let n;
      return function () {
        var o = this;
        const s = this,
          l = arguments;
        clearTimeout(n),
          (n = setTimeout(
            function () {
              t(this, o), e.apply(s, l);
            }.bind(this),
            i
          ));
      };
    }
    getElesParams(e) {
      var i = this;
      return {
        num: e.length,
        adsId: e.map(
          function (e) {
            var n;
            return (
              t(this, i),
              null === (n = e.iframeDom) || void 0 === n ? void 0 : n.id
            );
          }.bind(this)
        ),
        type: e.map(
          function (e) {
            return t(this, i), e.type;
          }.bind(this)
        ),
      };
    }
    getIframeById(e) {
      const t =
        document.querySelector('[data-google-query-id="' + e + '"]') ||
        document.querySelector("#" + CSS.escape(e));
      return "IFRAME" == (null == t ? void 0 : t.nodeName)
        ? t
        : null == t
        ? void 0
        : t.querySelector("iframe");
    }
    getNodeTypeById(e) {
      const t = this.getIframeById(e);
      return (
        console.dir(t),
        console.dir(this.adTypeCallback(t)),
        this.adTypeCallback(t)
      );
    }
    getAdsId(e) {
      var t, i, n;
      let { data: o, source: s = {} } = e;
      if ("string" == typeof o)
        try {
          o = JSON.parse(o);
        } catch (e) {}
      return (
        (null === (t = o) || void 0 === t ? void 0 : t.adId) ||
        (null == s || null === (i = s.frameElement) || void 0 === i
          ? void 0
          : i.id) ||
        (null == s ||
        null === (n = s.frameElement) ||
        void 0 === n ||
        null === (n = n.previousElementSibling) ||
        void 0 === n
          ? void 0
          : n.getAttribute("data-google-query-id"))
      );
    }
    collectLeaveTimeInterval() {
      var e = this;
      console.log("webview"),
        window.addEventListener(
          "visibilitychange",
          function () {
            t(this, e),
              console.log("webview", document.visibilityState),
              "hidden" === document.visibilityState
                ? (console.log("webview"), (this.webviewVisible = !1))
                : "visible" === document.visibilityState &&
                  (console.log("webview"), (this.webviewVisible = !0));
          }.bind(this)
        );
    }
  }
  class m {
    constructor() {
      (this.callbacks = {}),
        (this.intervalId = null),
        (this.activeCallbackNames = []);
    }
    addCallback(e, i) {
      var n = this;
      this.intervalId ||
        (this.intervalId = setInterval(
          function () {
            t(this, n);
            for (const e of this.activeCallbackNames)
              this.activeCallbackNames.includes(e) && this.callbacks[e]();
          }.bind(this),
          1e3
        )),
        (this.callbacks[e] = i),
        this.activeCallbackNames.push(e);
    }
    removeCallback(e) {
      var i = this;
      (this.activeCallbackNames = this.activeCallbackNames.filter(
        function (n) {
          return t(this, i), n !== e;
        }.bind(this)
      )),
        0 === this.activeCallbackNames.length &&
          (clearInterval(this.intervalId), (this.intervalId = null));
    }
  }
  class g extends f {
    constructor(e) {
      super(e),
        (this.target = e.target),
        (this.blacksLinks = [
          "Privacy",
          "privacy",
          "AboutUs",
          "terms",
          "Terms",
          "contact",
          "javascript:;",
          "about",
          "terms-of",
        ]),
        (this.cookieTextList = [
          "Accept all",
          "Allow all",
          "Accept Cookies",
          "Accept and Continue",
          "I agree",
        ]),
        this.getActionList(),
        (this.streamList = [[{ rate: [0, 1], type: "click" }]]);
    }
    async getActionList() {
      this.target.setWinConfig({ startId: this.generate32BitRandom() }),
        this.findDialogAndClick(),
        await this.toAwait(1e3);
      let e = 0;
      window.reset_is_click_action = !1;
      for (let t of this.streamList)
        await this.awaitAction(t), console.log("wait............ i "), (e += 1);
      console.log("await action end"),
        e == this.streamList.length &&
          (window.reset_is_click_action
            ? c.startAdtimer()
            : this.target.refresh());
    }
    awaitAction(e) {
      var i = this;
      return new Promise(
        async function (n, o) {
          t(this, i);
          const s = Math.random();
          try {
            for (let t of e)
              s < t.rate[1] && s >= t.rate[0]
                ? "click" === t.type
                  ? ((window.reset_is_click_action = !0),
                    await this.clickElement(),
                    this.track("jscode_reset_main_click", {
                      level: this.target.pageLevel,
                    }),
                    n(!0))
                  : "scroll" === t.type
                  ? (await this.scrollTo(t.value, t.time),
                    this.track("jscode_reset_main_scroll", {
                      value: t.value,
                      time: t.time,
                      level: this.target.pageLevel,
                    }),
                    n(!0))
                  : "wait" === t.type
                  ? (await this.toAwait(t.time),
                    this.track("jscode_reset_main_wait", {
                      time: t.time,
                      level: this.target.pageLevel,
                    }),
                    n(!0))
                  : "refresh" === t.type
                  ? (await this.target.refresh(),
                    this.track("jscode_reset_main_refresh", {
                      level: this.target.pageLevel,
                    }),
                    n(!0))
                  : n(!0)
                : n(!0);
          } catch (e) {
            this.target.refresh();
          }
        }.bind(this)
      );
    }
    scrollTo(e, i) {
      var n = this;
      return new Promise(
        async function (o, s) {
          var l, r, a;
          t(this, n);
          let d =
            (null === (l = this.target.deviceScrollWindow) || void 0 === l
              ? void 0
              : l.scrollHeight) ||
            (null === (r = this.target.deviceScrollWindow) ||
            void 0 === r ||
            null === (r = r.document) ||
            void 0 === r ||
            null === (r = r.scrollingElement) ||
            void 0 === r
              ? void 0
              : r.scrollHeight) ||
            (null === (a = document.body) || void 0 === a
              ? void 0
              : a.scrollHeight) ||
            window;
          if (e.includes("%")) {
            let t = e.split("%");
            e = 0.01 * d * t[0];
          }
          await this.target.scrollToPosition(
            this.target.deviceScrollWindow,
            Number(e),
            i
          ),
            o();
        }.bind(this)
      );
    }
    isObscured(e) {
      if (!e || null === e.offsetParent) return !0;
      const t = e.getBoundingClientRect();
      if (0 === t.width || 0 === t.height) return !0;
      const i = t.left + t.width / 2,
        n = t.top + t.height / 2,
        o = document.elementFromPoint(i, n);
      if (!o) return !0;
      let s = o;
      for (; s; ) {
        if (s === e) return !1;
        s = s.parentElement;
      }
      return !0;
    }
    findPotentialPopups() {
      const e = [],
        t = document.getElementsByTagName("*");
      for (let i = 0; i < t.length; i++) {
        const n = t[i],
          o = window.getComputedStyle(n);
        if (
          ("fixed" === o.position || "absolute" === o.position) &&
          parseInt(o.zIndex, 10) > 100 &&
          "none" !== o.display &&
          "hidden" !== o.visibility &&
          n.offsetWidth > 0 &&
          n.offsetHeight > 0 &&
          this.isElementInViewport(n)
        ) {
          const t = n.getBoundingClientRect(),
            i = t.left + t.width / 2,
            o = t.top + t.height / 2,
            s = n.style.pointerEvents;
          n.style.pointerEvents = "none";
          const l = document.elementFromPoint(i, o);
          (n.style.pointerEvents = s),
            l &&
              l !== document.body &&
              l !== document.documentElement &&
              !n.contains(l) &&
              e.push(n);
        }
      }
      return e;
    }
    isElementInViewport(e) {
      const t = e.getBoundingClientRect();
      return (
        t.bottom > 0 &&
        t.right > 0 &&
        t.top < (window.innerHeight || document.documentElement.clientHeight) &&
        t.left < (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    findAllByText(e, i) {
      var n = this;
      if (!e) return [];
      const o = [],
        s = e.querySelectorAll("*"),
        l = Array.isArray(i)
          ? i.map(
              function (e) {
                return t(this, n), String(e).toLocaleLowerCase();
              }.bind(this)
            )
          : [String(i).toLocaleLowerCase()];
      return (
        s.forEach(
          function (e) {
            t(this, n);
            const i =
              "BUTTON" === e.tagName || "button" === e.getAttribute("role");
            if (e.textContent && i) {
              const t = e.textContent.toLocaleLowerCase();
              for (const i of l)
                if (t.includes(i)) {
                  o.push(e);
                  break;
                }
            }
          }.bind(this)
        ),
        o
      );
    }
    toAwait(e) {
      var i = this;
      return new Promise(
        function (n, o) {
          var s = this;
          t(this, i),
            setTimeout(
              function () {
                t(this, s), n(e);
              }.bind(this),
              e
            );
        }.bind(this)
      );
    }
    async clickElement(e) {
      var i,
        n = this;
      let o =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (!e) {
        let i = Array.from(document.querySelectorAll("a"));
        (i = i.filter(
          function (e) {
            var i = this;
            return (
              t(this, n),
              (null == e ? void 0 : e.href) &&
                !this.blacksLinks.find(
                  function (n) {
                    return t(this, i), e.href.includes(n);
                  }.bind(this)
                )
            );
          }.bind(this)
        )),
          (e = i[Math.floor(Math.random() * i.length)]),
          console.log("click element", e);
      }
      null === (i = e) ||
        void 0 === i ||
        i.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        }),
        await this.toAwait(3e3);
      const s = e.getBoundingClientRect(),
        l = void 0 !== o.clientX ? o.clientX : s.left + s.width / 2,
        r = void 0 !== o.clientY ? o.clientY : s.top + s.height / 2,
        a = new MouseEvent("click", {
          bubbles: !0,
          cancelable: !0,
          view: window,
          clientX: l,
          clientY: r,
        });
      e.dispatchEvent(a);
    }
    findDialogAndClick() {
      const e = this.findPotentialPopups();
      if (null != e && e.length) {
        const t = e[0];
        console.log("btns finded waiting");
        const i = this.findAllByText(t, this.cookieTextList);
        console.log("btns", i),
          i && null != i && i.length && this.clickElement(i[0]);
      }
    }
  }
  class w extends v {
    constructor(e) {
      let { TRANSFORM_RATE: t } = e;
      super(),
        (this.intervalManager = new m()),
        (this.PAGE_LEVEL_NAME = "page_level"),
        (this.CHILD_LIMIT_LENGTH = 3),
        (this.isDifStream = !1),
        (this.isNoResponse = !1),
        (this.pageLevel = -1),
        (this.resetTime = new Date()),
        (this.capCollectCount = 0),
        (this.deviceScrollWindow = null),
        (this.TRANSFORM_RATE = t || 0),
        (this.TIME_COUNT_NAME = "time_count"),
        (this.TIME_COUNT_LEVEL = "time_count_level"),
        (this.RESET_SCRIPT = ""),
        (this.FINISH_ACTION = !1),
        (this.level = this.getCookie(this.TIME_COUNT_LEVEL)
          ? this.getCookie(this.TIME_COUNT_LEVEL)
          : 0);
    }
    monitorCaptchaAwaitReturn() {
      return window.monitorCaptchaAwaitReturn;
    }
    afterFormTranformMonited() {
      return window.afterFormTranformMonited;
    }
    setCapCollectCount(e) {
      this.capCollectCount = e;
    }
    getCapCollectCount() {
      return this.capCollectCount;
    }
    setAddDomainReset(e) {
      return c.addDomainReset(e);
    }
    getTranformTemplate(e) {
      var t;
      const i = this.TRANSFORM_URL
        ? decodeURIComponent(atob(this.TRANSFORM_URL))
        : "https://tpl.stargamedjs.net/tpl/";
      null === (t = this.START_VERIFY_LIST) ||
        void 0 === t ||
        t.offerTemplateUrl;
      let n = this.ABVERSION;
      return n ? "" + i + n + "/" + e : "" + i + e;
    }
    isNotTranformMonitorTask(e) {
      this.checkIsTranformMonited() || e();
    }
    createACloseBtn() {
      var e = this,
        i = document.createElement("div");
      (i.style =
        "position:fixed!important;top:12px!important;left:12px!important;z-index:99999!important;line-height:26px!important;border-radius: 50%;background-color:rgba(0,0,0,0.4)!important;cursor:pointer!important;font-size:30px!important;width:30px!important;height:30px!important;text-align: center!important;vertical-align: middle!important;display:block!important;"),
        (i.innerHTML =
          '<svg t="1752051270002" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1625" width="16" height="16"><path d="M995.555556 108.088889c22.755556-22.755556 22.755556-56.888889 0-79.644445-22.755556-22.755556-56.888889-22.755556-79.644445 0L551.822222 392.533333c-22.755556 22.755556-56.888889 22.755556-79.644444 0L108.088889 28.444444C85.333333 5.688889 51.2 5.688889 28.444444 28.444444c-22.755556 22.755556-22.755556 56.888889 0 79.644445l364.088889 364.088889c22.755556 22.755556 22.755556 56.888889 0 79.644444L28.444444 915.911111c-22.755556 22.755556-22.755556 56.888889 0 79.644445 22.755556 22.755556 56.888889 22.755556 79.644445 0l364.088889-364.088889c22.755556-22.755556 56.888889-22.755556 79.644444 0l364.088889 364.088889c22.755556 22.755556 56.888889 22.755556 79.644445 0 22.755556-22.755556 22.755556-56.888889 0-79.644445l-364.088889-364.088889c-22.755556-22.755556-22.755556-56.888889 0-79.644444l364.088889-364.088889z" fill="#FFFFFF" p-id="1626"></path></svg>'),
        document.body.appendChild(i),
        (i.onclick = function () {
          t(this, e),
            this.track("jscode_ad_close"),
            c.offerClose(this.getOfferId());
        }.bind(this));
    }
    init() {
      var e = this;
      if ("locale" == this.tipEnv()) {
        this.intervalManager.addCallback(
          "listen-sdk-complate",
          async function () {
            var i = this;
            if (
              (t(this, e),
              ("complete" == document.readyState ||
                "interactive" == document.readyState) &&
                this.insertCheckReset())
            ) {
              var n, o, s, l, r, a, d, h;
              this.intervalManager.removeCallback("listen-sdk-complate"),
                this.updateOfferView(
                  window.offerView ? JSON.parse(window.offerView) : null
                ),
                c.cancelADTimer(),
                document && window.focus(),
                this.listenerBeforeUnload(
                  function () {
                    t(this, i), this.DEV || c.startAdtimer();
                  }.bind(this)
                );
              try {
                window.addEventListener(
                  "load",
                  function () {
                    t(this, i), this.track("jscode_ad_load");
                  }.bind(this)
                );
              } catch (e) {
                console.log(e);
              }
              if (
                (setTimeout(
                  function () {
                    t(this, i),
                      this.getIsRespon() &&
                        (this.track("jscode_custom_transform_protect"),
                        this.refresh());
                  }.bind(this),
                  15e3
                ),
                null !== (n = this.getWinConfig()) &&
                  void 0 !== n &&
                  n.offerMachine)
              )
                return this.track("jscode_offer_repeat"), this.refresh(), !1;
              if (
                null !== (o = this.getWinConfig()) &&
                void 0 !== o &&
                o.offerForm
              )
                return (
                  this.track("jscode_offer_form_repeat"),
                  this.clearWinConfig(),
                  !1
                );
              if (
                null !== (s = this.getWinConfig()) &&
                void 0 !== s &&
                s.transform_finish
              )
                return (
                  this.track("jscode_custom_transform_finish"),
                  this.customFinish(),
                  !1
                );
              if (
                ((this.deviceScrollWindow = this.scrollElement()),
                null !== (l = window) &&
                  void 0 !== l &&
                  l.location &&
                  window.location.hostname &&
                  this.ADS_ORIGIN.find(
                    function (e) {
                      return t(this, i), window.location.hostname.includes(e);
                    }.bind(this)
                  ) &&
                  this.track("jscode_ad_error_address"),
                (this.pageLevel =
                  null !== (r = this.getWinConfig()) &&
                  void 0 !== r &&
                  r.page_level
                    ? null === (a = this.getWinConfig()) || void 0 === a
                      ? void 0
                      : a.page_level
                    : Number(
                        this.getCookie(this.PAGE_LEVEL_NAME)
                          ? this.getCookie(this.PAGE_LEVEL_NAME)
                          : 1
                      )),
                (this.resetTime = this.getCookie(this.TIME_COUNT_NAME)
                  ? new Date(this.getCookie(this.TIME_COUNT_NAME))
                  : null !== (d = this.getWinConfig()) && void 0 !== d && d.time
                  ? new Date(this.getWinConfig().time)
                  : new Date()),
                null !== (h = this.getWinConfig()) && void 0 !== h && h.startId)
              )
                this.track("jscode_reset_transform_continue", {
                  rate: this.TRANSFORM_RATE,
                  pageLevel: this.pageLevel,
                }),
                  this.pageLevelUpdate(),
                  this.asyncOperation();
              else {
                this.getOpenOfferClick() && this.getOfferClickType()
                  ? (this.track("jscode_ad_confirm_client", {
                      type: this.getOfferClickType(),
                    }),
                    c.onOfferLocationSuc(),
                    await this.promiseAwait(2e3))
                  : this.getOpenOfferClick() &&
                    !this.getOfferClickType() &&
                    this.track("jscode_dsp_error_type");
                const e = new Date();
                if (
                  (this.clearWinConfig(),
                  await this.promiseAwait(1e3),
                  this.pageLevelUpdate(!0),
                  this.setWinConfig({
                    time: e.getTime(),
                    page_level: this.pageLevel,
                  }),
                  this.checkIsTranformMonited())
                ) {
                  try {
                    0 == this.pageLevel &&
                      this.DEV &&
                      c.onOfferShow(this.getOfferId());
                  } catch (e) {}
                  this.track("jscode_ad_offer");
                } else this.track("jscode_ad_confirm");
                const t = Math.random();
                t < this.TRANSFORM_RATE || this.checkIsTranformMonited()
                  ? (this.track("jscode_reset_transform", {
                      rate: this.TRANSFORM_RATE,
                      current: t,
                      pageLevel: this.pageLevel,
                    }),
                    this.asyncOperation())
                  : this.refresh();
              }
            }
          }.bind(this)
        ),
          this.getCookie(this.TIME_COUNT_LEVEL) ||
            this.setCookie(this.TIME_COUNT_LEVEL, 2);
        try {
          window.alert &&
            (window.alert = function (e) {
              const t = document.createElement("div");
              (t.id = "alertBox-checked"),
                (t.style.cssText =
                  "\n                                    position: fixed;\n                                    top: 50%;\n                                    left: 50%;\n                                    transform: translate(-50%, -50%);\n                                    padding: 20px;\n                                    background: white;\n                                    border: 1px solid #ccc;\n                                    border-radius: 8px;\n                                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n                                    z-index: 9999;\n                                "),
                (t.innerHTML = e),
                document.body.appendChild(t);
            });
        } catch (e) {}
      } else this.track("jscode_insert_error_iframe");
    }
    setIsRespon(e) {
      this.isNoResponse = e;
    }
    getIsRespon() {
      return this.isNoResponse;
    }
    pageLevelReset() {
      this.setWinConfig({ page_level: 0 }),
        this.setCookie(this.PAGE_LEVEL_NAME, 0),
        this.track("jscode_reset_page_level", { level: 0 }),
        (this.pageLevel = 0);
    }
    pageLevelUpdate() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      const t = this.pageLevel + 1;
      e || this.setWinConfig({ page_level: t }),
        this.setCookie(this.PAGE_LEVEL_NAME, t),
        (this.pageLevel = t);
    }
    async testFunc() {
      var e, t;
      const i =
        (null === (e = this.getWinConfig()) || void 0 === e
          ? void 0
          : e.aften) || 1;
      var n;
      (console.dir("is first weiait " + i),
      await this.promiseAwait(5e3),
      i >= 2) ||
        (console.log(
          "setWinget",
          null === (n = this.getWinConfig()) || void 0 === n ? void 0 : n.aften
        ),
        this.setWinConfig({ aften: 2, startId: this.generate32BitRandom() }),
        null === (t = document.querySelector("a[href]")) ||
          void 0 === t ||
          t.click());
    }
    async goDefaultStream() {
      this.track("jscode_main_url_suc");
      const e = Math.random();
      window.reset_act_cfg && e < Number(window.reset_act_cfg)
        ? this.CHILD_LIMIT_LENGTH <= this.pageLevel
          ? (this.track("jscode_reset_main_end", { level: this.pageLevel }),
            this.refresh())
          : (this.track("jscode_main_rate"), new g({ target: this }))
        : (await this.promiseAwait(5e3), this.refresh());
    }
    async asyncOperation() {
      var e, t;
      const i = this.getTopLevelDomain().split(".").join("-");
      console.log(
        this.START_VERIFY_LIST,
        null === (e = this.START_VERIFY_LIST) || void 0 === e
          ? void 0
          : e.offerTemplateUrl,
        "getTranformTemplate"
      );
      const n = this.getTranformTemplate(i + ".js");
      let o;
      if (
        (null !== (t = this.getWinConfig()) && void 0 !== t && t.startId
          ? this.track("jscode_host_url_start_continue", { req_url: n })
          : this.track("jscode_host_url_start", { req_url: n }),
        (this.DEV && this.RESET_SCRIPT) || this.PLUGIN)
      ) {
        const e = document.createElement("script");
        (e.innerText = this.RESET_SCRIPT), document.head.appendChild(e);
      } else
        try {
          if (
            ((o = await c.loadScript(n)),
            console.dir("dir:res -> " + o + ", " + window.getConfigPlan),
            o)
          ) {
            var s;
            null !== (s = this.getWinConfig()) && void 0 !== s && s.startId
              ? this.track("jscode_host_url_suc_continue", { req_url: n })
              : this.track("jscode_host_url_suc", { req_url: n });
            const e = document.createElement("script");
            (e.innerText = o),
              document.head.appendChild(e),
              await this.promiseAwait(100);
          } else
            this.track("jscode_host_url_fail", { req_url: n }),
              this.checkIsTranformMonited()
                ? (this.track("jscode_offer_fail", { req_url: n }),
                  this.refresh())
                : this.goDefaultStream();
        } catch (e) {
          this.track("jscode_host_url_fail_error", {
            req_url: n,
            message: null == e ? void 0 : e.message,
          }),
            this.goDefaultStream();
        }
    }
    updateFinish(e) {
      this.FINISH_ACTION = e;
    }
    async customFinish(e, t) {
      var i;
      const n =
        e ||
        (null === (i = this.getWinConfig()) || void 0 === i
          ? void 0
          : i.type) ||
        "null";
      console.log("this.getWinConfig()"), console.log(this.getWinConfig());
      const o = new Date().getTime() - this.resetTime;
      if (
        [
          "form",
          "click",
          "view",
          "timeout",
          "normal",
          "error",
          "monitor",
          "machine",
          "code",
        ].includes(n)
      ) {
        if (
          "machine" == n &&
          t &&
          !this.checkIsTranformMonited() &&
          !window.monitorCaptchaAwaitCollect &&
          this.getOpenOffer()
        ) {
          var s;
          const { href: e, tpl: i } = t;
          (window.monitorCaptchaAwaitCollect = !0),
            this.setWinConfig({ offerMachine: i }),
            await this.promiseAwait(1e3);
          const n = this.getTemplateId() ? this.getTemplateId() + "/" + i : i;
          this.track("jscode_collect_offer", { template: i, href: e, key: n }),
            c.setOffer(
              this.SESSION_CODE,
              n,
              e,
              i,
              this.URL,
              (null === (s = this.START_VERIFY_LIST) || void 0 === s
                ? void 0
                : s.offerType) || "form",
              this.OFFSET_INDEX,
              i
            );
        }
        var l, r;
        if (
          "monitor" == n &&
          this.checkIsTranformMonited() &&
          !window.monitorCaptchaAwaitReturn &&
          !this.afterFormTranformMonited()
        )
          if (this.getCapIsActive())
            (window.monitorCaptchaAwaitReturn = !0),
              ["monitor"].includes(n) &&
                !window.monitorCaptchaAwaitCollect &&
                this.finish("machine", {
                  href: window.location.href,
                  tpl: this.getTopLevelDomain().split(".").join("-"),
                }),
              this.setWinConfig({
                offerMonitor:
                  (null === (l = window.location) || void 0 === l
                    ? void 0
                    : l.host) || 1,
              }),
              this.track("jscode_offer_send", { offerId: this.getOfferId() }),
              c.offerSend(this.getOfferId());
        if (
          "code" == n &&
          this.checkIsTranformMonited() &&
          !window.monitorCaptchaAwaitReturn &&
          !this.afterFormTranformMonited()
        )
          (window.monitorCaptchaAwaitReturn = !0),
            this.track("jscode_ad_active_tpl_captcha"),
            await this.promiseAwait(1e3),
            this.setWinConfig({
              offerMonitor:
                (null === (r = window.location) || void 0 === r
                  ? void 0
                  : r.host) || 1,
            }),
            this.track("jscode_offer_send", { offerId: this.getOfferId() }),
            c.offerSend(this.getOfferId());
        "form" == n &&
          this.checkIsTranformMonited() &&
          !this.afterFormTranformMonited() &&
          ((window.offerSuccessWithPage = !0),
          this.setWinConfig({ offerForm: this.getOfferId() }),
          this.track("jscode_offer_finish", { offerId: this.getOfferId() }),
          c.offerFinish(this.getOfferId())),
          "timeout" == n &&
            this.checkIsTranformMonited() &&
            !this.afterFormTranformMonited() &&
            (this.track("jscode_offer_timeout", {
              offerId: this.getOfferId(),
              monitorCancel: this.monitorCaptchaAwaitReturn() ? "1" : "0",
            }),
            this.clearWinConfig(),
            c.offerCancel(this.getOfferId(), this.monitorCaptchaAwaitReturn())),
          this.track("jscode_finish_action_" + n, { timeEnd: o, type: n });
      }
      this.track("jscode_finish_action", { timeEnd: o, type: n }),
        this.checkIsTranformMonited()
          ? "form" == n && (window.afterFormTranformMonited = !0)
          : (["form"].includes(n) &&
              !window.afterFormTranformMonited &&
              (window.afterFormTranformMonited = !0),
            ["code"].includes(n) &&
              this.finish("machine", {
                href: window.location.href,
                tpl: this.getTopLevelDomain().split(".").join("-"),
              }),
            ["monitor", "code"].includes(n) ||
              (this.clearWinConfig(), this.refresh()));
    }
    setConfigTransformRate(e) {
      null != e && (this.TRANSFORM_RATE = e);
    }
    setResetScript(e) {
      this.RESET_SCRIPT = e;
    }
    setConstantConfig(e) {
      var i = this;
      Object.keys(e).forEach(
        function (n) {
          t(this, i), (this[n] = e[n]);
        }.bind(this)
      ),
        null != e &&
          e.DEV &&
          this.setISDev("1" == (null == e ? void 0 : e.DEV)),
        console.log("", e, null == e ? void 0 : e.DEV);
    }
    refresh() {
      var e,
        i,
        n = this;
      (console.dir("OK to refresh"), this.DEV)
        ? (this.clearWinConfig(),
          console.log(
            "dev page refresh::::::::::::::: no actions to do action ::::::::notice:::::dange"
          ),
          null !== (e = window) &&
            void 0 !== e &&
            null !== (e = e.electronAPI) &&
            void 0 !== e &&
            e.refresh &&
            (null === (i = window) ||
              void 0 === i ||
              null === (i = i.electronAPI) ||
              void 0 === i ||
              i.refresh()))
        : this.checkIsTranformMonited()
        ? (this.track("jscode_offer_cancel", {
            offerId: this.getOfferId(),
            monitorCancel: this.monitorCaptchaAwaitReturn() ? "1" : "0",
          }),
          this.clearWinConfig(),
          c.offerCancel(this.getOfferId(), this.monitorCaptchaAwaitReturn()))
        : (console.log(
            "no dev page refresh::::::::::::::: normal ::::::::notice:::::"
          ),
          setTimeout(
            function () {
              var e, i;
              (t(this, n), this.insertCheckReset()) &&
                (this.track("jscode_reset_refresh"),
                this.clearWinConfig(),
                c.clientIsOs() || c.refresh(),
                null !== (e = window.webkit) &&
                  void 0 !== e &&
                  null !== (e = e.messageHandlers) &&
                  void 0 !== e &&
                  null !== (e = e.refresh) &&
                  void 0 !== e &&
                  e.postMessage &&
                  (null === (i = window.webkit) ||
                    void 0 === i ||
                    null === (i = i.messageHandlers.refresh) ||
                    void 0 === i ||
                    i.postMessage("1")));
            }.bind(this),
            4e3
          ));
    }
  }
  var p = void 0;
  const b = function () {
      t(this, p);
      const e = Math.floor(5 * Math.random()) + 5;
      let i = "";
      const n = "abcdefghijklmnopqrstuvwxyz  ";
      for (let t = 0; t < e; t++) i += n.charAt(Math.floor(28 * Math.random()));
      return i;
    }.bind(void 0),
    _ = function () {
      var e = this;
      t(this, p);
      const i = Array.from(
        { length: 9 },
        function () {
          return t(this, e), Math.floor(10 * Math.random());
        }.bind(this)
      );
      let n = i.reduce(
        function (i, n, o) {
          return t(this, e), i + n * (10 - o);
        }.bind(this),
        0
      );
      const o = n % 11 < 2 ? 0 : 11 - (n % 11);
      i.push(o),
        (n = i.reduce(
          function (i, n, o) {
            return t(this, e), i + n * (11 - o);
          }.bind(this),
          0
        ));
      const s = n % 11 < 2 ? 0 : 11 - (n % 11);
      i.push(s);
      return i.join("");
    }.bind(void 0),
    T = function () {
      var e = this;
      t(this, p);
      const i = "abcdefghijklmnopqrstuvwxyz",
        n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        o = "0123456789",
        s = "!@#$%&*()_+-=[]{}|,.",
        l = i + n + o + s,
        r = Math.floor(3 * Math.random()) + 8;
      let a = [
        i[Math.floor(26 * Math.random())],
        n[Math.floor(26 * Math.random())],
        o[Math.floor(10 * Math.random())],
        s[Math.floor(20 * Math.random())],
      ];
      for (let e = a.length; e < r; e++)
        a.push(l[Math.floor(82 * Math.random())]);
      return (
        (a = a
          .sort(
            function () {
              return t(this, e), Math.random() - 0.5;
            }.bind(this)
          )
          .join("")),
        a
      );
    }.bind(void 0),
    S = function (e, i) {
      var n = this;
      t(this, p);
      const o = new Date(1970, 0, 1),
        s = new Date(),
        l = e ? new Date(e) : o,
        r = i ? new Date(i) : s;
      if (l > r) throw new Error("data error");
      const a = l.getTime() + Math.random() * (r.getTime() - l.getTime()),
        d = new Date(a),
        c = function (e) {
          return t(this, n), e < 10 ? "0" + e : e.toString();
        }.bind(this);
      return {
        year: d.getFullYear(),
        month: c(d.getMonth() + 1),
        day: c(d.getDate()),
      };
    }.bind(void 0),
    y = function () {
      t(this, p);
      const e = [
        "Main St",
        "Oak Ave",
        "Maple Dr",
        "Cedar Ln",
        "Pine Rd",
        "Elm St",
        "Washington Ave",
        "Park Rd",
        "Lake Dr",
        "River Rd",
      ];
      return (
        Math.floor(9e3 * Math.random()) +
        1e3 +
        " " +
        e[Math.floor(Math.random() * e.length)]
      );
    }.bind(void 0),
    k = function () {
      t(this, p);
      return (
        "(" +
        (Math.floor(900 * Math.random()) + 100) +
        ") " +
        (Math.floor(900 * Math.random()) + 100) +
        "-" +
        (Math.floor(9e3 * Math.random()) + 1e3)
      );
    }.bind(void 0),
    C = function () {
      var e = this;
      let i =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "US";
      t(this, p);
      const n = {
        US: function () {
          return t(this, e), Math.floor(1e4 + 9e4 * Math.random());
        }.bind(this),
        CN: function () {
          return t(this, e), Math.floor(1e5 + 9e5 * Math.random()).toString();
        }.bind(this),
        UK: function () {
          t(this, e);
          const i = "ABCDEFGHIJKLMNOPRSTUWYZ";
          return [
            i.charAt(Math.floor(23 * Math.random())),
            i.charAt(Math.floor(23 * Math.random())),
            Math.floor(1 + 9 * Math.random()),
            " ",
            Math.floor(1 + 9 * Math.random()),
            i.charAt(Math.floor(23 * Math.random())),
            i.charAt(Math.floor(23 * Math.random())),
          ].join("");
        }.bind(this),
        CA: function () {
          t(this, e);
          const i = "ABCDEFGHJKLMNPRSTVWXY",
            n = "0123456789";
          return [
            i.charAt(Math.floor(21 * Math.random())),
            n.charAt(Math.floor(10 * Math.random())),
            i.charAt(Math.floor(21 * Math.random())),
            " ",
            n.charAt(Math.floor(10 * Math.random())),
            i.charAt(Math.floor(21 * Math.random())),
            n.charAt(Math.floor(10 * Math.random())),
          ].join("");
        }.bind(this),
        AU: function () {
          return t(this, e), Math.floor(1e3 + 9e3 * Math.random()).toString();
        }.bind(this),
        JP: function () {
          return (
            t(this, e),
            Math.floor(100 + 900 * Math.random()) +
              "-" +
              Math.floor(1e3 + 9e3 * Math.random())
          );
        }.bind(this),
      };
      return n[i] ? n[i]() : "00000";
    }.bind(void 0),
    E = function () {
      t(this, p);
      const e = ["Apt", "Suite", "Unit", "#"];
      return (
        e[Math.floor(Math.random() * e.length)] +
        " " +
        (Math.floor(20 * Math.random()) + 1)
      );
    }.bind(void 0);
  function M(e) {
    return e[Math.floor(Math.random() * e.length)];
  }
  function I() {
    return M([
      "John",
      "Jane",
      "Michael",
      "Emily",
      "David",
      "Sarah",
      "Robert",
      "Jennifer",
    ]);
  }
  function A() {
    return M([
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
    ]);
  }
  function O() {
    let e =
      arguments.length > 0 && void 0 !== arguments[0]
        ? arguments[0]
        : ["gmail.com", "yahoo.com", "outlook.com", "domain.com", "qq.com"];
    return (
      (function (e) {
        const t = "abcdefghijklmnopqrstuvwxyz0123456789";
        let i = "";
        for (let n = 0; n < e; n++)
          i += t.charAt(Math.floor(36 * Math.random()));
        return i;
      })(Math.floor(10 * Math.random()) + 5) +
      "@" +
      M(e)
    );
  }
  function D() {
    return M([
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
    ]);
  }
  function R() {
    return M([
      "California",
      "Texas",
      "Florida",
      "New York",
      "Illinois",
      "Pennsylvania",
    ]);
  }
  function N() {
    return Math.floor(1e4 + 9e4 * Math.random()).toString();
  }
  var L = Object.freeze({
    __proto__: null,
    getRandomStr: b,
    createCPF: _,
    generateRandomPassword: T,
    generateRandomDate: S,
    generateStreetAddress: y,
    generatePhoneNumber: k,
    generatePostalCode: C,
    generateRandomApartmentNumber: E,
    getRandomElement: M,
    generateText: function () {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 8;
      const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let i = "";
      for (let n = 0; n < e; n++) i += t.charAt(Math.floor(52 * Math.random()));
      return i;
    },
    generateName: function () {
      return (
        M([
          "John",
          "Jane",
          "Michael",
          "Emily",
          "David",
          "Sarah",
          "Robert",
          "Jennifer",
        ]) +
        " " +
        M(["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis"])
      );
    },
    generateFirstName: I,
    generateJobName: function () {
      return M([
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DevOps Engineer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
        "UI Designer",
        "Graphic Designer",
        "Marketing Specialist",
        "Sales Representative",
        "HR Manager",
        "Financial Analyst",
        "Project Manager",
        "System Administrator",
        "Network Engineer",
        "Content Writer",
        "SEO Specialist",
        "Customer Support",
      ]);
    },
    generateLastName: A,
    generateUsername: function () {
      return (
        M(["happy", "sunny", "clever", "brave", "gentle", "wild", "quiet"]) +
        "_" +
        M(["cat", "dog", "lion", "tiger", "bear", "wolf", "eagle"]) +
        Math.floor(100 * Math.random())
      );
    },
    generateEmail: O,
    generatePassword: function () {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12;
      if (e < 8) throw new Error("8");
      const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        i = "abcdefghijklmnopqrstuvwxyz",
        n = "0123456789",
        o = "!@#^*()_+-=[]{}|;:,.<>?",
        s = [
          t[Math.floor(Math.random() * t.length)],
          i[Math.floor(Math.random() * i.length)],
          n[Math.floor(Math.random() * n.length)],
          o[Math.floor(Math.random() * o.length)],
        ],
        l = t + i + n + o,
        r = e - s.length;
      for (let e = 0; e < r; e++)
        s.push(l[Math.floor(Math.random() * l.length)]);
      for (let e = s.length - 1; e > 0; e--) {
        const t = Math.floor(Math.random() * (e + 1));
        [s[e], s[t]] = [s[t], s[e]];
      }
      return s.join("");
    },
    generatePhone: function () {
      return (
        "+1" +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(1e3 + 9e3 * Math.random())
      );
    },
    generateRawPhone: function () {
      return (
        "" +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(200 + 800 * Math.random()) +
        Math.floor(1e3 + 9e3 * Math.random())
      );
    },
    generateFormattedPhone: function () {
      var e = this;
      const i = function (i) {
        t(this, e);
        let n = "";
        for (let e = 0; e < i; e++) n += Math.floor(10 * Math.random());
        return n;
      }.bind(this);
      return (
        "(" +
        i(3) +
        ")" +
        i(3) +
        "-" +
        i(4) +
        (Math.random() > 0.5 ? "x" + i(4) : "")
      );
    },
    generateAddress: function () {
      return (
        M(["123", "456", "789", "100", "200", "300"]) +
        " " +
        M(["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Dr", "Cedar Ln"])
      );
    },
    generateCity: D,
    generateState: R,
    generateZip: N,
    generateCanadianPostalCode: function () {
      const e = "ABCDEFGHJKLMNPRSTVWXYZ",
        t = "0123456789",
        i = e.charAt(Math.floor(22 * Math.random())),
        n = i + t.charAt(Math.floor(10 * Math.random())) + i,
        o = t.charAt(Math.floor(10 * Math.random()));
      return n + " " + (o + e.charAt(Math.floor(22 * Math.random())) + o);
    },
    generateCountry: function () {
      return M([
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
      ]);
    },
    generateBirthday: function () {
      const e = new Date(1970, 0, 1),
        t = new Date(2e3, 0, 1);
      return new Date(e.getTime() + Math.random() * (t.getTime() - e.getTime()))
        .toISOString()
        .split("T")[0];
    },
    generateAge: function () {
      return Math.floor(18 + 50 * Math.random());
    },
    generateWebsite: function () {
      return (
        "https://www." +
        M(["example.com", "test.org", "demo.net", "website.dev", "mysite.io"])
      );
    },
    generateComment: function () {
      return M([
        "This is a great product!",
        "Very satisfied with the service.",
        "Could be better, but overall good.",
        "Excellent experience overall.",
        "Would recommend to others.",
        "Needs some improvements.",
      ]);
    },
    generateParagraph: function () {
      return M([
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ]);
    },
    generateDate: function () {
      const e = new Date(2e3, 0, 1),
        t = new Date();
      return new Date(e.getTime() + Math.random() * (t.getTime() - e.getTime()))
        .toISOString()
        .split("T")[0];
    },
    generateColor: function () {
      let e = "#";
      for (let t = 0; t < 6; t++)
        e += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
      return e;
    },
    generateNumber: function () {
      let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100;
      return Math.floor(e + Math.random() * (t - e + 1));
    },
  });
  const P = function (e) {
    var i = this;
    let n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
    t(this, undefined);
    let o = !1,
      s = !1;
    function l(t) {
      "active" == t
        ? ((window.rapGrecaptchaIsActive = !0), (o = !0))
        : "has" == t && (s = !0),
        console.log("[reCAPTCHA] éªŒè¯è§¦å‘ (" + t + ")"),
        e.track("jscode_ad_" + t + "_tpl_captcha");
    }
    function r(e) {
      var t, i, n, o, s;
      return (
        (null === (t = e.classList) || void 0 === t
          ? void 0
          : t.contains("g-recaptcha")) ||
        (null === (i = e.classList) || void 0 === i
          ? void 0
          : i.contains("grecaptcha-badge")) ||
        ((null === (n = e.classList) || void 0 === n
          ? void 0
          : n.contains("cf-turnstile")) &&
          (null == e ? void 0 : e.clientHeight) >= 40 &&
          (null === (o = e.dataset) || void 0 === o ? void 0 : o.siteKey)) ||
        (null === (s = e.classList) || void 0 === s
          ? void 0
          : s.contains("h-captcha"))
      );
    }
    function a(e) {
      var t, i, n;
      return (
        ("IFRAME" === e.nodeName && e.src.includes("google.com/recaptcha")) ||
        ("IFRAME" === e.nodeName &&
          (null === (t = e.src) || void 0 === t
            ? void 0
            : t.includes("hcaptcha.com/captcha/v1")) &&
          (null == e ? void 0 : e.clientHeight) > 0) ||
        ((null === (i = e.classList) || void 0 === i
          ? void 0
          : i.contains("cf-turnstile")) &&
          (null == e ? void 0 : e.clientHeight) >= 40 &&
          (null === (n = e.dataset) || void 0 === n ? void 0 : n.siteKey))
      );
    }
    new MutationObserver(
      function (d) {
        var c = this;
        t(this, i),
          d.forEach(
            function (i) {
              var d = this;
              t(this, c),
                i.addedNodes.forEach(
                  function (i) {
                    t(this, d),
                      i.nodeType === Node.ELEMENT_NODE &&
                        r(i) &&
                        !s &&
                        l("has"),
                      a(i) &&
                        !o &&
                        (l("active"),
                        0 == e.getCapCollectCount() &&
                          (e.setCapCollectCount(1),
                          n &&
                            e.finish("machine", {
                              href: window.location.href,
                              tpl: e.getTopLevelDomain().split(".").join("-"),
                            })));
                  }.bind(this)
                );
            }.bind(this)
          );
      }.bind(this)
    ).observe(document.body, { childList: !0, attributes: !0, subtree: !0 }),
      (function () {
        var i = this;
        document.querySelectorAll(".g-recaptcha, .grecaptcha-badge").forEach(
          function (e) {
            t(this, i), r(e) && !s && l("has");
          }.bind(this)
        ),
          document.querySelectorAll("iframe").forEach(
            function (s) {
              t(this, i),
                a(s) &&
                  !o &&
                  (l("active"),
                  0 == e.getCapCollectCount() &&
                    (e.setCapCollectCount(1),
                    n &&
                      e.finish("machine", {
                        href: window.location.href,
                        tpl: e.getTopLevelDomain().split(".").join("-"),
                      })));
            }.bind(this)
          );
      })();
  }.bind(void 0);
  class W extends w {
    constructor(e) {
      let { TRANSFORM_RATE: t } = e;
      super({ TRANSFORM_RATE: t }),
        (this.API_URL = "https://asq.cplinforun.com"),
        (this.timeout = 6e3),
        (this.taskStart = !1),
        (this.deviceScrollWindow = null),
        (this.TRANSFORM_RATE = t || 0),
        (this.generatorApi = L);
    }
    monitorReturnWithWindow() {
      return window.waitForMonitorCaptionBack;
    }
    monitorCollect() {
      return window.monitorCaptchaAwaitCollect;
    }
    async getUserInfo() {
      if (
        (this.getWinConfig() && this.getWinConfig().resetUserInfo) ||
        this.getCookie("resetUserInfo")
      ) {
        var e;
        const t =
          (null === (e = this.getWinConfig()) || void 0 === e
            ? void 0
            : e.resetUserInfo) || this.getCookie("resetUserInfo");
        return this.track("jscode_get_info_success"), t;
      }
      const t = await this.reqUserInfo(1);
      return (
        Object.keys(t[0]).length > 0 &&
          (this.setWinConfig({ resetUserInfo: t[0] }),
          this.setCookie("resetUserInfo", t[0]),
          this.track("jscode_get_info_success")),
        t[0]
      );
    }
    request(e, i) {
      var n = this;
      return new Promise(
        function (o, s) {
          var l = this;
          t(this, n),
            fetch(e, i)
              .then(
                function (e) {
                  return t(this, l), e.json();
                }.bind(this)
              )
              .then(
                function (e) {
                  t(this, l), o(e);
                }.bind(this)
              )
              .catch(
                function (e) {
                  t(this, l),
                    this.track("jscode_request_fail"),
                    console.error(e),
                    s(e);
                }.bind(this)
              );
        }.bind(this)
      );
    }
    async reqUserInfo() {
      var e = this;
      let i =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
      const n = {
        CPF: _(),
        psw: T(),
        zip: C("US"),
        ApartmentNumber: Math.floor(999 * Math.random()) + 1,
        job: b(),
        age: Math.floor(40 * Math.random()) + 20,
      };
      try {
        const o = await this.request(
          this.API_URL +
            "/game/cpl/get/info?count=" +
            i +
            "&domain=" +
            this.getTopLevelDomain()
        );
        return 0 === o.code && o.data.length > 0
          ? (o.data.forEach(
              function (i) {
                var o = this;
                t(this, e),
                  (i.phone =
                    i.phone
                      .split("")
                      .filter(
                        function (e) {
                          return t(this, o), "0123456789.".includes(e);
                        }.bind(this)
                      )
                      .join("") || ""),
                  (i.name = i.name.split("-").join(" "));
                const [s, l] = i.name.split(" ");
                (i.firstName = s),
                  (i.lastName = l || A()),
                  (i = Object.assign(i, n));
              }.bind(this)
            ),
            o.data)
          : (this.track("jscode_get_info_fail"),
            this.generateFallbackData(i, n));
      } catch (e) {
        return (
          this.track("jscode_get_info_error", { error: e.message }),
          this.generateFallbackData(i, n)
        );
      }
    }
    generateFallbackData() {
      let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
        t = arguments.length > 1 ? arguments[1] : void 0;
      const i = [];
      for (let o = 0; o < e; o++) {
        const e = I(),
          o = A();
        i.push(
          n(
            {
              country: "United States",
              address2: "",
              city: D(),
              address1: y(),
              province: R(),
              phone: k(),
              name: e + " " + o,
              firstName: e,
              lastName: o,
              postCode: N(),
              email: O(),
              status: 0,
            },
            t
          )
        );
      }
      return i;
    }
    insertInBody(e, t) {
      let i = document.getElementById("resetInfo-id-tdk-for-message");
      i
        ? (i.innerHTML = " " + e + " <br/> " + t)
        : ((i = document.createElement("div")),
          (i.id = "resetInfo-id-tdk-for-message"),
          (i.innerHTML = " " + e + " <br/> " + t),
          document.body.appendChild(i),
          (i.style.position = "fixed"),
          (i.style.bottom = "140px"),
          (i.style.userSelect = "none"),
          (i.style.zIndex = "9999999"),
          (i.style.left = "15px"),
          (i.style.backgroundColor = "rgba(0, 0, 0, 0.2)"),
          (i.style.color = "red"),
          (i.style.padding = "8px"));
    }
    trackInfo(e, t) {
      this.checkIsTranformMonited(),
        this.DEV && (console.log("track Info", e, t), this.insertInBody(e, t)),
        this.track("jscode_reset_info", { info: e, message: t });
    }
    async task(e, i) {
      var n = this;
      try {
        if (this.taskStart) return;
      } catch (e) {
        console.log(e);
      }
      try {
        this.track("jscode_reset_task", { pathname: e });
        const o = await this.withTimeout(
          new Promise(
            function (i) {
              var o = this;
              t(this, n),
                setTimeout(
                  function () {
                    t(this, o), i(this.getTopLevelUrl().includes(e));
                  }.bind(this),
                  0
                );
            }.bind(this)
          ),
          this.timeout
        );
        if (
          (console.dir("ã€‚ã€‚ã€‚ã€‚ã€‚ã€‚ã€‚ã€‚ã€‚ã€‚"),
          console.dir(this.getIsRespon()),
          o && "function" == typeof i && !this.taskStart)
        ) {
          if (
            ((this.taskStart = !0),
            this.setIsRespon(!1),
            await i(),
            await this.promiseAwait(this.timeout),
            console.log(
              "taskï½žï½žï½ž",
              this.taskStart,
              this.monitorReturnWithWindow()
            ),
            console.dir(location.pathname),
            console.dir(e),
            window.waitCapProtectPlase)
          ) {
            const e = Date.now(),
              i = async function () {
                var e = this;
                return (
                  t(this, n),
                  new Promise(
                    function (i, n) {
                      var o = this;
                      t(this, e);
                      const s = setInterval(
                        function () {
                          t(this, o),
                            window.waitCapProtectPlase ||
                              (i(!0), clearInterval(s));
                        }.bind(this),
                        1e3
                      );
                    }.bind(this)
                  )
                );
              }.bind(this);
            await i(),
              this.track("jscode_track_wait", { timeEnd: Date.now() - e }),
              await this.promiseAwait(1e3);
          }
          this.monitorReturnWithWindow() || this.monitorCollect()
            ? this.track("jscode_offer_wait_task")
            : window.afterFormTranformMonited ||
              (this.track("jscode_track_timeout"),
              this.trackInfo("timeout"),
              this.finish("timeout"));
        } else o && "function" == typeof i && this.taskStart && this.setIsRespon(!1);
        return o;
      } catch (e) {
        this.track("jscode_task_fail", { msg: e }),
          console.log("task", e),
          this.monitorReturnWithWindow() &&
            (this.track("jscode_track_timeout"),
            this.trackInfo("timeout"),
            window.afterFormTranformMonited || this.finish("timeout"));
      }
    }
    async groupWork(e) {
      var i = this;
      this.trackInfo("group work", "rate");
      for (const [n, o] of e.entries())
        if (o instanceof Array) {
          let e = Math.random();
          const n = o.sort(
            function (e, n) {
              return t(this, i), e.rate - n.rate;
            }.bind(this)
          );
          let s = 0;
          for (const t of n) {
            const i = t.rate;
            if (((s += Number(i)), e <= s)) {
              await t.work();
              break;
            }
            await this.promiseAwait(100);
          }
        }
    }
    start(e) {
      var i = this;
      return (
        this.setIsRespon(!0),
        new Promise(
          async function (n, o) {
            var s, l, r, a;
            if (
              (t(this, i),
              this.trackInfo("start", e),
              null !== (s = this.getWinConfig()) && void 0 !== s && s.startId)
            ) {
              const e = this.getOfferKey(),
                t = e
                  ? e.split("/")[0]
                    ? "" + e.split("/")[0]
                    : this.getOfferTpl() + "_tpl"
                  : this.getWinConfig().templateId;
              console.log("host...template_back", t), this.setTemplateId(t);
            } else {
              const t = this.getOfferKey(),
                i = t
                  ? t.split("/")[0]
                    ? "" + t.split("/")[0]
                    : this.getOfferTpl() + "_tpl"
                  : this.getTopLevelDomain().split(".").join("-") + "_tpl";
              console.log("host...template", i),
                this.setTemplateId(i),
                await this.wait(2e3),
                this.track("jscode_custom_transform_start", {
                  rate: this.TRANSFORM_RATE,
                }),
                ["news", "other", "shop", "form", "website"].includes(e) &&
                  this.track("jscode_custom_transform_start_" + e, {
                    rate: this.TRANSFORM_RATE,
                    type: e,
                  });
              const n = {
                startId: this.generate32BitRandom(),
                type: e,
                templateId: i,
              };
              this.setWinConfig(n);
            }
            await this.promiseAwait(3e3),
              window.DefInfo &&
              null !== (l = window.DefInfo) &&
              void 0 !== l &&
              null !== (l = l.type) &&
              void 0 !== l &&
              l.includes("job")
                ? P(this, !this.checkIsTranformMonited())
                : P(this, !1),
              ((document &&
                document.querySelector(".spacer-bottom") &&
                null !== (r = document.querySelector(".spacer-bottom")) &&
                void 0 !== r &&
                null !== (r = r.innerHTML) &&
                void 0 !== r &&
                r.includes("Verify you are human")) ||
                (document &&
                  document.querySelector(".cf-injected-html") &&
                  null !== (a = document.querySelector(".content-title")) &&
                  void 0 !== a &&
                  null !== (a = a.innerHTML) &&
                  void 0 !== a &&
                  a.includes("connection needs to be verified"))) &&
                (this.track("jscode_verify_human"), this.refresh()),
              console.dir("å¼€å§‹è½¬åŒ–" + this.TRANSFORM_RATE),
              (this.deviceScrollWindow = this.scrollElement()),
              n(this);
          }.bind(this)
        )
      );
    }
    wait(e) {
      return this.promiseAwait(e);
    }
    async withTimeout(e) {
      var i = this;
      let n,
        o =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : this.timeout;
      const s = this,
        l = new Promise(
          function (e, l) {
            var r = this;
            t(this, i),
              (n = setTimeout(
                function () {
                  t(this, r);
                  try {
                    s.trackInfo("[sys] withTimeout no find dom", "to refresh");
                  } catch (e) {
                    console.log(e);
                  }
                }.bind(this),
                o
              ));
          }.bind(this)
        );
      try {
        const t = await Promise.race(
          this.monitorReturnWithWindow() ? [e] : [e, l]
        );
        return clearTimeout(n), t;
      } catch (e) {
        throw (clearTimeout(n), e);
      }
    }
    async waitForElement(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5e3;
      return await this.withTimeout(
        new Promise(
          function (n, o) {
            var s = this;
            t(this, i);
            const l = function () {
              t(this, s);
              const i = document.querySelector(e);
              return !!i && (n(i), !0);
            }.bind(this);
            if (l()) return;
            const r = setInterval(
              function () {
                t(this, s), l() && clearInterval(r);
              }.bind(this),
              1e3
            );
          }.bind(this)
        ),
        n
      );
    }
    async waitWindowCapProtectPlase() {
      var e = this;
      return new Promise(
        function (i, n) {
          var o = this;
          t(this, e);
          const s = setInterval(
            async function () {
              t(this, o),
                window.waitCapProtectPlase ||
                  (clearInterval(s), await this.promiseAwait(1e3), i());
            }.bind(this),
            1e3
          );
        }.bind(this)
      );
    }
    async waitForElementVisible(e, i) {
      var n = this;
      let o =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2e4,
        s = null;
      const l = this;
      if (!e)
        return void l.trackInfo("waitForElementVisible", "[sys] not found dom");
      const r = new IntersectionObserver(
        function (e, o) {
          t(this, n),
            e[0].isIntersecting &&
              (s && clearTimeout(s), i(!0), o.disconnect());
        }.bind(this)
      );
      await this.waitWindowCapProtectPlase(),
        (s = this.monitorReturnWithWindow()
          ? setTimeout(
              function () {
                t(this, n);
              }.bind(this),
              0
            )
          : setTimeout(
              function () {
                t(this, n), r.disconnect();
                try {
                  l.trackInfo("waitForElementVisible", "[sys] not found dom");
                } catch (e) {
                  console.log(e);
                }
                i(!1);
              }.bind(this),
              o
            )),
        r.observe(e);
    }
    waitForElementObserver(e) {
      var i = this;
      let n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : document.body,
        o =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3e4,
        s =
          arguments.length > 3 && void 0 !== arguments[3]
            ? arguments[3]
            : document;
      const l = this;
      return new Promise(
        async function (r) {
          var a = this;
          t(this, i),
            console.dir(
              "wait this.monitorReturnWithWindow() , " +
                this.monitorReturnWithWindow()
            ),
            await this.waitWindowCapProtectPlase();
          const d = this.monitorReturnWithWindow()
              ? setTimeout(
                  function () {
                    t(this, a);
                  }.bind(this),
                  0
                )
              : setTimeout(
                  function () {
                    t(this, a), h.disconnect();
                    const i = s.querySelector(e);
                    if (i) r(i);
                    else {
                      try {
                        l.trackInfo(
                          e,
                          "[sys] waitForElementObserver not found dom"
                        );
                      } catch (e) {
                        console.log(e);
                      }
                      r(null);
                    }
                  }.bind(this),
                  o
                ),
            c = s.querySelector(e);
          c && (l.scrollToWithPromise(c), clearTimeout(d), r(c));
          const h = new MutationObserver(
            function () {
              t(this, a);
              const i = s.querySelector(e);
              i &&
                (l.scrollToWithPromise(i),
                clearTimeout(d),
                h.disconnect(),
                r(i));
            }.bind(this)
          );
          h.observe(n, { childList: !0, subtree: !0 });
        }.bind(this)
      );
    }
    waitForHandle(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2e4;
      const o = new Date().getTime();
      return new Promise(
        function (s) {
          var l = this;
          t(this, i);
          const r = setInterval(
            function () {
              t(this, l);
              new Date().getTime() - o >= n
                ? (clearInterval(r), s(!1))
                : e() && (clearInterval(r), s(!0));
            }.bind(this),
            500
          );
        }.bind(this)
      );
    }
    async createClick(e, i, n) {
      var o = this;
      if ((this.track("jscode_reset_click"), e)) {
        if (
          (i &&
            (this.track("jscode_reset_link_back", { type: i }),
            this.setWinConfig({
              transform_finish: this.generate32BitRandom(),
              type: i,
            })),
          n && this.version >= "0.2.5.2")
        )
          n(e);
        else {
          const t = new MouseEvent("mousedown", {
            bubbles: !0,
            cancelable: !0,
            view: window,
          });
          (t._reactName = "onClick"),
            e.dispatchEvent(new MouseEvent("mouseover", { bubbles: !0 })),
            e.dispatchEvent(t),
            e.dispatchEvent(new MouseEvent("mouseup", { bubbles: !0 })),
            e.dispatchEvent(new MouseEvent("click", { bubbles: !0 }));
        }
        e.href &&
          setTimeout(
            function () {
              t(this, o), (window.location.href = e.href);
            }.bind(this),
            this.timeout
          );
      } else {
        try {
          this.trackInfo(
            "createClick",
            "[sys] createClick not found dom to refresh"
          );
        } catch (e) {
          console.log(e);
        }
        this.refresh();
      }
    }
    async createSubmit(e) {
      var i = this;
      let n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "monitor",
        o =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : "before",
        s = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        l = arguments.length > 4 ? arguments[4] : void 0,
        r = arguments.length > 5 ? arguments[5] : void 0;
      if ((this.track("jscode_reset_sub"), !e)) {
        try {
          this.trackInfo(
            "createSubmit",
            "[sys] createSubmit not found dom to refresh"
          );
        } catch (e) {
          console.log(e);
        }
        return void this.refresh();
      }
      "code" == n && (window.rapGrecaptchaIsActive = !0),
        (window.waitCapProtectPlase = !0),
        console.dir("-------------start wait----------------");
      let a =
        this.getCapIsActive &&
        this.getCapIsActive() &&
        this.checkIsTranformMonited() &&
        s;
      const d = async function () {
        var e = this;
        return (
          t(this, i),
          new Promise(
            function (i, n) {
              var o = this;
              t(this, e),
                setTimeout(
                  function () {
                    t(this, o),
                      (a =
                        this.getCapIsActive &&
                        this.getCapIsActive() &&
                        this.checkIsTranformMonited() &&
                        s),
                      (window.waitCapProtectPlase = !1),
                      i();
                  }.bind(this),
                  5e3
                );
            }.bind(this)
          )
        );
      }.bind(this);
      if (
        (await d(),
        console.dir("-------------end wait----------------" + a),
        ("before" != o ||
          (a && (window.waitForMonitorCaptionBack = !0),
          this.version >= "0.2.5.2" &&
            (this.trackInfo("submit", "man-machine " + n), this.finish(n)),
          !a)) &&
          "code" != n)
      ) {
        if (
          (l &&
            (this.track("jscode_reset_submit_back", { type: l }),
            this.setWinConfig({
              transform_finish: this.generate32BitRandom(),
              type: l,
            })),
          r)
        )
          r(e);
        else {
          const t = new MouseEvent("mousedown", {
            bubbles: !0,
            cancelable: !0,
            view: window,
          });
          (t._reactName = "onClick"),
            e.dispatchEvent(new MouseEvent("mouseover", { bubbles: !0 })),
            e.dispatchEvent(t),
            e.dispatchEvent(new MouseEvent("mouseup", { bubbles: !0 })),
            e.dispatchEvent(new MouseEvent("click", { bubbles: !0 }));
        }
        "after" == o &&
          (a && (window.waitForMonitorCaptionBack = !0),
          this.version >= "0.2.5.2" &&
            (this.trackInfo("submit", "man-machine " + n), this.finish(n))),
          this.scrollToWithPromise(e);
      }
    }
    createClientStandomClick(e) {
      return (
        this.track("jscode_reset_client_click"), this.createfromCLientClick(e)
      );
    }
    setValue(e, t) {
      let i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      e ||
        (this.trackInfo("setValue", "[sys] setValue not found dom to refresh"),
        this.refresh());
      try {
        Object.getOwnPropertyDescriptor(
          window[e.constructor.name].prototype,
          "value"
        ).set.call(e, t);
        const n = new Event("input", { bubbles: !0 });
        e.dispatchEvent(n), i && this.triggerInputEvents(e);
      } catch (i) {
        e.value = t;
      }
    }
    async findElement(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : this.timeout;
      const o = this,
        s = await this.withTimeout(
          new Promise(
            function (n) {
              var o = this;
              t(this, i);
              const s = setInterval(
                function () {
                  t(this, o),
                    document.querySelector(e) &&
                      (n(document.querySelector(e)), clearInterval(s));
                }.bind(this),
                1e3
              );
            }.bind(this)
          ),
          n
        );
      return {
        element: s,
        val: async function (e) {
          t(this, i), s && o.setValue(s, e);
        }.bind(this),
        click: async function () {
          t(this, i), s && o.createClick(s);
        }.bind(this),
      };
    }
    async findContent(e, i) {
      var n = this;
      let o =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : this.timeout;
      const s = this,
        l = (
          await this.withTimeout(
            new Promise(
              function (i) {
                var o = this;
                t(this, n),
                  setTimeout(
                    function () {
                      t(this, o), i(Array.from(e.querySelectorAll("*")));
                    }.bind(this),
                    0
                  );
              }.bind(this)
            ),
            o
          )
        ).find(
          function (e) {
            return t(this, n), e.textContent == i;
          }.bind(this)
        );
      return {
        element: l,
        click: async function () {
          t(this, n), l && s.createClick(l);
        }.bind(this),
      };
    }
    async form(e, i) {
      var n = this;
      let s =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : this.timeout;
      const l = new o({ createClick: this.createClick }),
        r = await this.withTimeout(
          new Promise(
            function (i) {
              var o = this;
              t(this, n),
                setTimeout(
                  function () {
                    t(this, o), i(e);
                  }.bind(this),
                  0
                );
            }.bind(this)
          ),
          s
        );
      console.dir(r),
        console.dir(""),
        r &&
          (await this.withTimeout(
            new Promise(
              function (e) {
                var o = this;
                t(this, n),
                  setTimeout(
                    function () {
                      t(this, o), l.fillForm(r, i), e();
                    }.bind(this),
                    0
                  );
              }.bind(this)
            ),
            s
          ));
    }
    scrollToWithPromise(e) {
      var i = this;
      return (
        this.track("jscode_reset_scroll"),
        new Promise(
          function (n) {
            var o = this;
            t(this, i),
              e &&
                e.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                }),
              setTimeout(
                function () {
                  t(this, o), n();
                }.bind(this),
                3e3
              );
          }.bind(this)
        )
      );
    }
    async scrollTo(e) {
      var i = this;
      let n =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3e3,
        o =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : this.timeout;
      this.track("jscode_reset_scroll");
      const s = this;
      let l;
      if ("string" == typeof e && e.includes("%")) {
        const t = e.split("%"),
          i = document.documentElement.scrollHeight;
        l = Number(0.01 * i * t[0]);
      } else l = Number(e);
      return await this.withTimeout(
        new Promise(
          function (e) {
            t(this, i);
            let o = performance.now();
            requestAnimationFrame(function t() {
              var i;
              let r =
                (null === (i = s.deviceScrollWindow) || void 0 === i
                  ? void 0
                  : i.pageYOffset) || document.documentElement.scrollTop;
              const a = performance.now() - o;
              if (a >= n)
                s.deviceScrollWindow.scrollTo({
                  top: l,
                  left: 0,
                  behavior: n ? "smooth" : "auto",
                }),
                  e();
              else {
                const e = r + (a / n) * (l - r);
                s.deviceScrollWindow.scrollTo({
                  top: e,
                  left: 0,
                  behavior: n ? "smooth" : "auto",
                }),
                  requestAnimationFrame(t);
              }
            });
          }.bind(this)
        ),
        o > n ? o : n + 1e3
      );
    }
    finish(e, t) {
      "form" == e && this.trackInfo("finish"),
        this.setWinConfig({ type: e }),
        this.customFinish(e, t);
    }
    formatDateToMMDDYYYY(e) {
      const [t, i, n] = e.split("-");
      return i + "/" + n + "/" + t;
    }
    getRandomElements(e, i) {
      var n = this;
      return []
        .concat(e)
        .sort(
          function () {
            return t(this, n), 0.5 - Math.random();
          }.bind(this)
        )
        .slice(0, i);
    }
    findRandomOne(e, t) {
      let i = e.querySelectorAll(t);
      return i[Math.floor(Math.random() * i.length)];
    }
    triggerInputEvents(e) {
      var i = this;
      ["input", "change", "blur"].forEach(
        function (n) {
          t(this, i);
          const o = new Event(n, { bubbles: !0 });
          e.dispatchEvent(o);
        }.bind(this)
      );
    }
    locateElement(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2e3;
      return new Promise(
        function (o) {
          var s = this;
          t(this, i);
          const l = document.querySelector(e);
          if (l) return void o(l);
          const r = setInterval(
            function () {
              t(this, s);
              const i = document.querySelector(e);
              i && (clearInterval(r), o(i));
            }.bind(this),
            800
          );
          !this.monitorReturnWithWindow() &&
            setTimeout(
              function () {
                t(this, s), clearInterval(r), o(null);
              }.bind(this),
              n
            );
        }.bind(this)
      );
    }
    fileUpload(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "application/pdf";
      if (!(e instanceof HTMLInputElement))
        return console.error("Invalid input element"), !1;
      let o = "",
        s = "";
      try {
        switch (n) {
          case "text/plain":
            (o = o || "This is a fake text file content\nTest data"),
              (s = s || "fakeFile.txt");
            break;
          case "application/json":
            (o = JSON.stringify({ name: "Test", value: 123 })),
              (s = "fakeData.json");
            break;
          case "image/png": {
            const n = document.createElement("canvas");
            (n.width = 100), (n.height = 100);
            const o = n.getContext("2d");
            return (
              (o.fillStyle = "red"),
              o.fillRect(0, 0, 100, 100),
              new Promise(
                function (o) {
                  var s = this;
                  t(this, i),
                    n.toBlob(
                      function (i) {
                        if ((t(this, s), !i))
                          return (
                            console.error("Unable to generate image Blob"),
                            void o(!1)
                          );
                        const n = new File([i], "fakeImage.png", {
                            type: "image/png",
                          }),
                          l = new DataTransfer();
                        l.items.add(n), (e.files = l.files);
                        const r = new Event("change", { bubbles: !0 });
                        e.dispatchEvent(r), o(!0);
                      }.bind(this),
                      "image/png"
                    );
                }.bind(this)
              )
            );
          }
          case "application/pdf":
            (o = o || "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj"),
              (s = s || "fakeDocument.pdf");
            break;
          case "application/msword":
            (o = o || "This is a fake DOC file content"),
              (s = s || "fakeDocument.doc");
            break;
          default:
            return console.error("Unsupported file type:", n), !1;
        }
        const l = new Blob([o], { type: n }),
          r = new File([l], s, { type: n }),
          a = new DataTransfer();
        a.items.add(r), (e.files = a.files);
        const d = new Event("change", { bubbles: !0 });
        return e.dispatchEvent(d), !0;
      } catch (e) {
        return console.error("Error in fakeFileUpload:", e), !1;
      }
    }
    formatDateToMMDDYYYY(e) {
      const [t, i, n] = e.split("-");
      return i + "/" + n + "/" + t;
    }
    getRandomElements(e, i) {
      var n = this;
      return []
        .concat(e)
        .sort(
          function () {
            return t(this, n), 0.5 - Math.random();
          }.bind(this)
        )
        .slice(0, i);
    }
    fillSelectField(e, i) {
      var n = this;
      if (!e)
        return (
          this.trackInfo("fillSelectField", "[sys] select is undefined"),
          void this.refresh()
        );
      e.focus();
      let o = "";
      if (e.multiple) {
        this.trackInfo("fillSelectField", "select multiple type");
        const s = Array.from(e.options).filter(
          function (e) {
            return t(this, n), !e.disabled && e.value;
          }.bind(this)
        );
        if (i && i instanceof Array) {
          const e = s.filter(
            function (e) {
              return t(this, n), i.includes(e.value);
            }.bind(this)
          );
          e.forEach(
            function (e) {
              return t(this, n), (e.selected = !0);
            }.bind(this)
          ),
            (o = e);
        } else {
          const e = Math.min(
              Math.floor(Math.random() * s.length) + 1,
              s.length
            ),
            i = getRandomElements(s, e);
          i.forEach(
            function (e) {
              return t(this, n), (e.selected = !0);
            }.bind(this)
          ),
            (o = i);
        }
      } else {
        this.trackInfo("fillSelectField", "select one");
        const s = Array.from(e.options).filter(
          function (e) {
            return t(this, n), !e.disabled && e.value;
          }.bind(this)
        );
        if (i) {
          const e = s.find(
            function (e) {
              return t(this, n), i == e.value;
            }.bind(this)
          );
          console.log("selectedOption", e), (e.selected = !0), (o = e);
        } else if (s.length > 0) {
          const e = s[Math.floor(Math.random() * s.length)];
          (e.selected = !0), (o = e);
        }
      }
      return this.triggerInputEvents(e), e.blur(), o;
    }
    triggerInputEvents(e) {
      var i = this;
      ["input", "change", "blur"].forEach(
        function (n) {
          t(this, i);
          const o = new Event(n, { bubbles: !0 });
          e.dispatchEvent(o);
        }.bind(this)
      );
    }
    locateElement(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2e3;
      return new Promise(
        function (o) {
          var s = this;
          t(this, i);
          const l = document.querySelector(e);
          if (l) return void o(l);
          const r = setInterval(
            function () {
              t(this, s);
              const i = document.querySelector(e);
              i && (clearInterval(r), o(i));
            }.bind(this),
            800
          );
          setTimeout(
            function () {
              t(this, s), clearInterval(r), o(null);
            }.bind(this),
            n
          );
        }.bind(this)
      );
    }
    fileUpload(e) {
      var i = this;
      let n =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "application/pdf";
      if (!(e instanceof HTMLInputElement))
        return console.error("Invalid input element"), !1;
      let o = "",
        s = "";
      try {
        switch (n) {
          case "text/plain":
            (o = o || "This is a fake text file content\nTest data"),
              (s = s || "fakeFile.txt");
            break;
          case "application/json":
            (o = JSON.stringify({ name: "Test", value: 123 })),
              (s = "fakeData.json");
            break;
          case "image/png": {
            const n = document.createElement("canvas");
            (n.width = 100), (n.height = 100);
            const o = n.getContext("2d");
            return (
              (o.fillStyle = "red"),
              o.fillRect(0, 0, 100, 100),
              new Promise(
                function (o) {
                  var s = this;
                  t(this, i),
                    n.toBlob(
                      function (i) {
                        if ((t(this, s), !i))
                          return (
                            console.error("Unable to generate image Blob"),
                            void o(!1)
                          );
                        const n = new File([i], "fakeImage.png", {
                            type: "image/png",
                          }),
                          l = new DataTransfer();
                        l.items.add(n), (e.files = l.files);
                        const r = new Event("change", { bubbles: !0 });
                        e.dispatchEvent(r), o(!0);
                      }.bind(this),
                      "image/png"
                    );
                }.bind(this)
              )
            );
          }
          case "application/pdf":
            (o = o || "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj"),
              (s = s || "fakeDocument.pdf");
            break;
          case "application/msword":
            (o = o || "This is a fake DOC file content"),
              (s = s || "fakeDocument.doc");
            break;
          default:
            return console.error("Unsupported file type:", n), !1;
        }
        const l = new Blob([o], { type: n }),
          r = new File([l], s, { type: n }),
          a = new DataTransfer();
        a.items.add(r), (e.files = a.files);
        const d = new Event("change", { bubbles: !0 });
        return e.dispatchEvent(d), !0;
      } catch (e) {
        return console.error("Error in fakeFileUpload:", e), !1;
      }
    }
  }
  var F = void 0;
  let j,
    V = location.href,
    K = "",
    x = "",
    H = 0,
    U = "",
    q = null,
    B = {},
    G = {};
  var J, Y;
  ((window.openGetWiths = "WVSDK"),
  (window.openGetOs = "OSDK"),
  document &&
    document.body &&
    [
      "503 Service Temporarily Unavailable",
      "504 Gateway Timeout",
      "500 Internal Server Error",
      "502 Bad Gateway",
      "501 Not Implemented",
      "503 Service Unavailable",
      "504 Gateway Timeout",
    ].find(
      function (e) {
        return t(this, F), document.body.innerText.includes(e);
      }.bind(void 0)
    )) &&
    (null !== (J = window.webkit) &&
    void 0 !== J &&
    null !== (J = J.messageHandlers) &&
    void 0 !== J &&
    null !== (J = J.refresh) &&
    void 0 !== J &&
    J.postMessage
      ? null === (Y = window.webkit) ||
        void 0 === Y ||
        null === (Y = Y.messageHandlers.refresh) ||
        void 0 === Y ||
        Y.postMessage("1")
      : window.clientIsOs() || c.refresh());
  if (!window.onaftersubmit && location.hostname) {
    if (
      ((window.onaftersubmit = new W({})),
      (G = window.onaftersubmit),
      window[window.openGetOs] || window[window.openGetWiths])
    )
      (j = c.getAppTheme()), (j = JSON.parse(j));
    else if (G.isIOS() && window.appTheme) {
      var z;
      (j = window.appTheme),
        (j = JSON.parse(j)),
        null !== (z = j) && void 0 !== z && z.theme && (j.themes = j.theme);
    } else
      j = {
        urlConfig: {
          name: "name:default,groupRate:1,limit:8000,level:1,childRate:0,hotRate:0,transformRate:1,resetActions:scrollto&1500.T2000_scrollto&2500.T200",
        },
      };
    var X, Z, Q, $, ee, te, ie, ne, oe, se, le, re, ae, de, ce;
    if (j)
      (V =
        (null === (X = j) ||
        void 0 === X ||
        null === (X = X.themes) ||
        void 0 === X
          ? void 0
          : X.splash) ||
        (null === (Z = j) ||
        void 0 === Z ||
        null === (Z = Z.urlConfig) ||
        void 0 === Z
          ? void 0
          : Z.url) ||
        location.href),
        (K = null === (Q = j) || void 0 === Q ? void 0 : Q.sessionCode),
        (H = null === ($ = j) || void 0 === $ ? void 0 : $.index),
        (B =
          (null === (ee = j) ||
          void 0 === ee ||
          null === (ee = ee.themes) ||
          void 0 === ee
            ? void 0
            : ee.statInfo) ||
          (null === (te = j) ||
          void 0 === te ||
          null === (te = te.urlConfig) ||
          void 0 === te
            ? void 0
            : te.statInfo) ||
          {}),
        (x =
          (null === (ie = j) ||
          void 0 === ie ||
          null === (ie = ie.themes) ||
          void 0 === ie
            ? void 0
            : ie.name) ||
          (null === (ne = j) ||
          void 0 === ne ||
          null === (ne = ne.urlConfig) ||
          void 0 === ne
            ? void 0
            : ne.name)),
        (window.reset_act_cfg =
          (null === (oe = j) ||
          void 0 === oe ||
          null === (oe = oe.themes) ||
          void 0 === oe
            ? void 0
            : oe.cfgStrOne) ||
          (null === (se = j) ||
          void 0 === se ||
          null === (se = se.urlConfig) ||
          void 0 === se
            ? void 0
            : se.cfgStrOne) ||
          "0.1"),
        (q =
          (null === (le = j) ||
          void 0 === le ||
          null === (le = le.themes) ||
          void 0 === le
            ? void 0
            : le.urlStrOne) ||
          (null === (re = j) ||
          void 0 === re ||
          null === (re = re.themes) ||
          void 0 === re
            ? void 0
            : re.urlStrTwo) ||
          (null === (ae = j) ||
          void 0 === ae ||
          null === (ae = ae.urlConfig) ||
          void 0 === ae
            ? void 0
            : ae.urlStrOne)),
        (U =
          (null === (de = j) ||
          void 0 === de ||
          null === (de = de.themes) ||
          void 0 === de
            ? void 0
            : de.urlStrThird) ||
          (null === (ce = j) ||
          void 0 === ce ||
          null === (ce = ce.urlConfig) ||
          void 0 === ce
            ? void 0
            : ce.urlStrThird));
    let e = Math.random(),
      i = x && x.split("_G_"),
      n = 0;
    if (i) {
      i = i.sort(
        function (e, i) {
          t(this, F);
          const n = G.parseConfig(e),
            o = G.parseConfig(i);
          return (
            (Number(null == n ? void 0 : n.GROUP_RATE) || 0) -
            (Number(null == o ? void 0 : o.GROUP_RATE) || 0)
          );
        }.bind(void 0)
      );
      let o = i.find(
        function (i) {
          var o, s;
          return (
            t(this, F),
            (null === (o = i = G.parseConfig(i)) || void 0 === o
              ? void 0
              : o.GROUP_RATE) &&
              (n += Number(
                null === (s = i) || void 0 === s ? void 0 : s.GROUP_RATE
              )),
            e < n
          );
        }.bind(void 0)
      );
      o ||
        (o = i.find(
          function (e) {
            var i;
            return (
              t(this, F),
              !(
                null !== (i = e = G.parseConfig(e)) &&
                void 0 !== i &&
                i.GROUP_RATE
              )
            );
          }.bind(void 0)
        )),
        (x = o);
      const s = G.parseConfig(o);
      G.setConstantConfig(s);
    }
    if (
      (G.setConfigTransformRate(q),
      location.hostname.includes(
        location.host.trim().split(".").length > 2
          ? location.host.split(".").slice(1).join(".")
          : location.host.split(".").slice(0).join(".")
      ))
    ) {
      var he, ue, fe, ve;
      if (
        (G.setabVer(U),
        G.setConfigUrl(V),
        G.setAdProbabilityEvents(B),
        G.setSessionCode(K),
        G.setOffsetIndex(H),
        G.isIOS())
      )
        G.setISOpenOffer(!0);
      else
        G.setISOpenOffer(
          null === (ue = j.appTheme) || void 0 === ue ? void 0 : ue.openOffer
        );
      if (
        null !== (he = j) &&
        void 0 !== he &&
        null !== (he = he.appTheme) &&
        void 0 !== he &&
        he.openOfferClick
      )
        G.setISOpenOfferClick(
          null === (fe = j.appTheme) || void 0 === fe
            ? void 0
            : fe.openOfferClick
        ),
          G.setClickType(
            null === (ve = j.themes) ||
              void 0 === ve ||
              null === (ve = ve.controlInfo) ||
              void 0 === ve
              ? void 0
              : ve.trigger_placement_click
          );
      (async function () {
        t(this, F);
        const e = await G.getCacheWinConfig();
        (window.defaultWinCnfig = e), console.log("adb", e), G.init();
      }).bind(void 0)();
    }
  }
});
