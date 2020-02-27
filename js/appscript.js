var host = 'http://asachina.vn';
var _url_1688 = window.location.href,
  _items1688 = _url_1688.indexOf("items.1688.com");

var storageData = [];

if (0 < _items1688) {
  var new_url_1688 = _url_1688.replace("items.", "detail.");
  window.location.href = new_url_1688, console.log(new_url_1688)
}

function addItem(e) {

  $.get(host + '/api/checkLogin', function(t) {
    $("#asachina-btn-submit").removeAttr("disabled"); 
    $("#cart-mask").hide();
    if (t != 0 && t != '0') {
      if (storageData.length == 0) {
        // Bình thường
        asachinaAlert("Thông báo", '<p>Thêm sản phẩm vào giỏ hàng thành công.</p><p style="margin-top: 20px; text-align: center"><button class="btn btn-success btn-sm asachinaremovebox">Tiếp tục mua hàng</button> <button class="btn btn-default btn-sm btn-show-cart">Xem giỏ hàng</button></p></p>');
      }
    
      storageData.forEach(function(item, index, object) {
        if (e.proId == item.proId 
          && e.skullId == item.skullId 
          && e.size == item.size 
          && e.sizetxt == item.sizetxt
          && e.color == item.color
          && e.colortxt == item.colortxt) {
            object.splice(index, 1);
            // Đã tồn tại, cập nhật số lượng
            asachinaAlert("Thông báo", '<p>Sản phẩm đã có trong giỏ hàng, cập nhật số lượng thành công.</p><p style="margin-top: 20px; text-align: center"><button class="btn btn-success btn-sm asachinaremovebox">Tiếp tục mua hàng</button> <button class="btn btn-default btn-sm btn-show-cart">Xem giỏ hàng</button></p>'); 
        } else {
          // Bình thường
          asachinaAlert("Thông báo", '<p>Thêm sản phẩm vào giỏ hàng thành công.</p><p style="margin-top: 20px; text-align: center"><button class="btn btn-success btn-sm asachinaremovebox">Tiếp tục mua hàng</button> <button class="btn btn-default btn-sm btn-show-cart">Xem giỏ hàng</button></p></p>');
        }
      });
  
      storageData.push(e);
    } else {
      asachinaAlert("Thông báo", "Vui lòng đăng nhập asachina.vn!");
    }
  }).fail(function() {
    $("#asachina-btn-submit").removeAttr("disabled"); 
    $("#cart-mask").hide();

    asachinaAlert("Thông báo", "Vui lòng đăng nhập asachina.vn!");
  });
}

var defaults = {
	url: null,
	values: null,
	method: "POST",
	target: null,
	traditional: false,
	redirectTop: false
};

var redirect = function (url, values, method, target, traditional, redirectTop) {
	var opts = url;
	if (typeof url !== "object") {
		var opts = {
			url: url,
			values: values,
			method: method,
			target: target,
			traditional: traditional,
			redirectTop: redirectTop
		};
	}

	var config = $.extend({}, defaults, opts);
	var generatedForm = redirect.getForm(config.url, config.values, config.method, config.target, config.traditional);
	$('body', config.redirectTop ? window.top.document : undefined).append(generatedForm.form);
	generatedForm.submit();
	generatedForm.form.remove();
};

redirect.getForm = function (url, values, method, target, traditional) {
	method = (method && ["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) !== -1) ? method.toUpperCase() : 'POST';

	url = url.split("#");
	var hash = url[1] ? ("#" + url[1]) : "";
	url = url[0];

	if (!values) {
		var obj = parseUrl(url);
		url = obj.url;
		values = obj.params;
	}

	values = removeNulls(values);

	var form = $('<form>')
		.attr("method", method)
		.attr("action", url + hash)
		.attr("accept-charset", "utf-8");


	if (target) {
		form.attr("target", target);
	}

	var submit = form[0].submit;
	iterateValues(values, [], form, null, traditional);

	return {
		form: form,
		submit: function () {
			submit.call(form[0]);
		}
	};
}

var parseUrl = function (url) {

	if (url.indexOf('?') === -1) {
		return {
			url: url,
			params: {}
		};
	}
	var parts = url.split('?'),
		query_string = parts[1],
		elems = query_string.split('&');
	url = parts[0];

	var i, pair, obj = {};
	for (i = 0; i < elems.length; i += 1) {
		pair = elems[i].split('=');
		obj[pair[0]] = pair[1];
	}

	return {
		url: url,
		params: obj
	};
};

var getInput = function (name, value, parent, array, traditional) {
	var parentString;
	if (parent.length > 0) {
		parentString = parent[0];
		var i;
		for (i = 1; i < parent.length; i += 1) {
			parentString += "[" + parent[i] + "]";
		}

		if (array) {
			if (traditional)
				name = parentString;
			else
				name = parentString + "[" + name + "]";
		} else {
			name = parentString + "[" + name + "]";
		}
	}

	return $("<input>").attr("type", "hidden")
		.attr("name", name)
		.attr("value", value);
};

var iterateValues = function (values, parent, form, isArray, traditional) {
	var i, iterateParent = [];
	Object.keys(values).forEach(function (i) {
		if (typeof values[i] === "object") {
			iterateParent = parent.slice();
			iterateParent.push(i);
			iterateValues(values[i], iterateParent, form, Array.isArray(values[i]), traditional);
		} else {
			form.append(getInput(i, values[i], parent, isArray, traditional));
		}
	});
};

var removeNulls = function (values) {
	var propNames = Object.getOwnPropertyNames(values);
	for (var i = 0; i < propNames.length; i++) {
		var propName = propNames[i];
		if (values[propName] === null || values[propName] === undefined) {
			delete values[propName];
		} else if (typeof values[propName] === 'object') {
			values[propName] = removeNulls(values[propName]);
		} else if (values[propName].length < 1) {
			delete values[propName];
		}
	}
	return values;
};

function capnhatSoLuong(t, e) {
  e = parseInt(e, 10);
  var n = existSku = !1,
    r = $(t).parents("tr").find("td.price").find("em.value").text();
  if (r == "") {
    r = $(".price-now").text();
  }
  if (r = parseFloat(r), isNaN(r) && 0 < (r = getPrice()).length) {
    var o = r;
    for (f in o) {
      var i = parseInt(o[f].begin),
        a = "" == o[f].end ? 999999 : parseInt(o[f].end),
        u = parseFloat(o[f].price);
      if (i <= e && e <= a) {
        r = u;
        break
      }
    }
  }
  var s = $(t).parents("tr").find("img").attr("src");
  s = correctLink(s = s && -1 < s.indexOf(".32x32") ? s.replace(".32x32", "") : $(rules[currentDomain].crawle.image).attr("src"));
  var c = $(rules[currentDomain].crawle.color).parents(".obj-header").next().find(".active a.selected").text();
  if ("" == $.trim(c) && (c = $(rules[currentDomain].crawle.color).parents(".obj-header").next().find(".active a.selected").find("img").attr("alt") || ""), void 0 === (l = $(t).parents("tr").attr("data-sku-config"))) var l = {
    skuName: $(".spec a.active").attr("title")
  };
  else l = $.parseJSON(l);
  if (void 0 !== product1688 && product1688.length)
    for (var f = product1688.length - 1; 0 <= f; f--)
      if (product1688[f].img == s) {
        if (void 0 !== product1688[f].list && product1688[f].list.length)
          for (var p = product1688[f].list.length - 1; 0 <= p; p--) product1688[f].list[p].skuName == l.skuName && product1688[f].list[p].color == c && (product1688[f].list[p].qty = e, product1688[f].list[p].price = r, existSku = !0);
        existSku || ("" != s && (l.qty = s), l.qty = e, l.price = r, l.color = c, l.size = l.skuName, product1688[f].list.push(l)), n = !0
      }
  if (!n) {
    var d = {
      img: "",
      list: []
    };
    "" != s && (d.img = s), l.qty = e, l.price = r, l.color = c, l.size = l.skuName, d.list.push(l), product1688.push(d)
  }
}

function makeButton(t, e, n) {
  var r = $("<button>");
  return r.attr(t).html(e).on("click", n), r
}

function addToCart(t) {
  if ($("html").hasClass("translated-ltr")) return asachinaAlert("Thông báo", "You should not use Google Translate to add products.");
  if (config.version != config.currentVer) return asachinaAlert("Thông báo", '<p>Vui lòng cập nhật extension lên phiên bản mới để đặt hàng.</p><p style="margin-top: 20px; text-align: center"><button class="btn btn-danger btn-sm asachinaremovebox">Hủy</button> <a target="_blank" href="https://chrome.google.com/webstore/detail/h%C3%B9ng-th%E1%BB%8Bnh-logistics-orde/cljgeamakelbidoianknbfedaejiocgi" class="btn btn-success btn-sm">Cập nhật ngay</a></p>');
  if ($(".tb-rmb, .tm-yen", ".fd-cny").remove(), "1688" == currentDomain) return addToCart1688();
  if (checkElementExists() && !checkFullProperty()) return !1;
  var e = "",
    n = "",
    r = "";
  if ("TAOBAO" == currentDomain ? (void 0 === (r = $("#J_ThumbView, #J_ImgBooth").attr("alt")) && (r = $("#J_Title .tb-main-title").data("title")), e = taobaoShopNick(), n = taobaoShopLink()) : "TMALL" == currentDomain ? (r = $("#J_ThumbView, #J_ImgBooth").attr("alt"), e = tmallShopNick(), n = tmallShopLink()) : "Aliexpress" == currentDomain && (r = $("h1.product-name").text(), e = AliShopNick(), n = AliShopLink()), "Aliexpress" == currentDomain) {
    var o = $(rules[currentDomain].crawle.size).next().find(".active a").attr("data-sku-id"),
      i = $(rules[currentDomain].crawle.color).next().find(".active a").attr("data-sku-id");
    void 0 === o && (o = $(rules[currentDomain].crawle.size).next().find(".active").data("value")), void 0 === i && (i = $(rules[currentDomain].crawle.color).next().find(".active").data("value"));
    var a = $(rules[currentDomain].crawle.size).next().find(".active a").text();
    "" == (u = $(rules[currentDomain].crawle.color).next().find(".active a").text()) && (u = $(rules[currentDomain].crawle.color).next().find(".active a").attr("title"))
  } else {
    o = $(rules[currentDomain].crawle.size).next().find(".tb-selected").data("pv"), i = $(rules[currentDomain].crawle.color).next().find(".tb-selected").data("pv");
    void 0 === o && (o = $(rules[currentDomain].crawle.size).next().find(".tb-selected").data("value")), void 0 === i && (i = $(rules[currentDomain].crawle.color).next().find(".tb-selected").data("value"));
    a = $(rules[currentDomain].crawle.size).next().find(".tb-selected a").text();
    var u = $(rules[currentDomain].crawle.color).next().find(".tb-selected a").text()
  }
  if ("Aliexpress" == currentDomain) var s = Math.round(parseFloat($(rules[currentDomain].crawle.originPrice).text()) * config.rateUSD),
    c = Math.round(parseFloat($(rules[currentDomain].crawle.promoPrice).text()) * config.rateUSD),
    l = s;
  else s = parseFloat($(rules[currentDomain].crawle.originPrice).text()), c = parseFloat($(rules[currentDomain].crawle.promoPrice).text()), l = s;
  c && (l = c);
  var f = "";
  "TAOBAO" == currentDomain ? f = taobaoSkuId(o, i) : "TMALL" == currentDomain && (f = $_GET("skuId")), addOrRemoveCartItem("other", {
    rate: config.rate ? config.rate : 'xxx',
    name: r ? r : 'xxx',
    pro_link: changeLink(window.location.href) ? changeLink(window.location.href) : 'xxx',
    image: changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src"))) ? changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src"))) : 'xxx',
    price: l ? l : 'xxx',
    price_arr: "xxx",
    size: o ? o : "xxx",
    sizetxt: a.trim() ? a.trim() : 'xxx',
    color: i ? i : 'xxx',
    colortxt: u.trim() ? u.trim() : 'xxx',
    pro_properties: f ? f : 'xxx',
    amount: parseInt($(rules[currentDomain].crawle.amount).val()) ? parseInt($(rules[currentDomain].crawle.amount).val()) : 'xxx',
    beginAmount: 1,
    shop_nick: e ? e : 'xxx',
    shop_link: changeLink(n) ? changeLink(n) : 'xxx',
    sellerId: getsellerId() ? getsellerId() : 'xxx',
    domain: currentDomain ? currentDomain : 'xxx',
    site: currentDomain ? currentDomain : 'xxx',
    count: !1,
    pro_note: $("#pro_note").val() ? $("#pro_note").val() : 'No comment',
    method: "Extension"
  })
}

function addToCart1688() {
  if (!checkFor1688Com()) return !1;
  var o, i, a, u = {},
    s = [];
  a = $(".mod-detail-gallery img").attr("alt"), o = com1688ShopNick(), i = com1688ShopLink();
  var c = 1,
    t = $(".unit-detail-freight-cost").attr("data-unit-config");
  $("#cart-mask").show(), $("#asachina-btn-submit").attr("disabled", "disabled");
  void 0 !== t && (t = JSON.parse(t)), "object" == typeof t && (c = parseInt(t.beginAmount)), product1688.forEach(function (n) {
    console.log(n);
    var r = n.img.split("/");

    r = (r = (r = r[r.length - 1]).split(".")[0]).split("_"), n.list.forEach(function (t) {
      var e = {
        proId: parseInt(r[1], 10) ? parseInt(r[1], 10) : 'xxx',
        skullId: parseInt(r[0], 10) ? parseInt(r[0], 10) : 'xxx',
        rate: config.rate ? config.rate : 'xxx',
        pro_link: changeLink(window.location.href) ? changeLink(window.location.href) : 'xxx',
        image: changeLink(n.img) ? changeLink(n.img) : 'xxx',
        name: a ? a : 'xxx',
        price: t.price ? t.price : 'xxx',
        price_arr: null == getPrice() ? "xxx" : getPrice(),
        size: t.skuName ? t.skuName : 'xxx',
        pro_properties: t.skuName + parseInt(r[1], 10) + parseInt(r[0], 10) ? t.skuName + parseInt(r[1], 10) + parseInt(r[0], 10) : 'xxx',
        sizetxt: t.skuName ? t.skuName : 'xxx',
        color: t.color ? t.color : 'xxx',
        colortxt: t.color ? t.color : 'xxx',
        amount: t.qty ? t.qty : 'xxx',
        beginAmount: c ? c : 'xxx',
        shop_nick: o ? o : 'xxx',
        shop_link: changeLink(i) ? changeLink(i) : 'xxx',
        sellerId: 'xxx',
        site: currentDomain ? currentDomain : 'xxx',
        domain: currentDomain ? currentDomain : 'xxx',
        pro_note: $("#pro_note").val() ? $("#pro_note").val() : 'No comment',
        count: !1,
        method: "Chrome Extension"
      };
      s.push(e), console.log(s), u.data = s, console.log('e -->'), console.log(e);
      addItem(e);
    })
  });
}

function correctLink(t) {
  return "string" == typeof t && -1 == t.indexOf("http") && (t = window.location.protocol + t), t
}

function order(t) {
  t.preventDefault(), addToCart(t)
}

function guideToOrder(t) {
  t && t.preventDefault(), window.open(host, "_blank").focus()
}

function addOrRemoveCartItem(t, e) {
  console.log('e -->');
  console.log(e);
  var n = {},
    r = [];
  r.push(e), n.data = r, $("#cart-mask").show(), jQuery.support.cors = !0;
  addItem(e);
}

function redirectToAsachina() {
  if (storageData.length) {
    storageData.forEach(function(item) {
      item.pro_note = $("#pro_note").val() ? $("#pro_note").val() : 'No comment';
    });
    redirect(host + '/manager/dashboard/orders/extmade', storageData);
  } else {
    asachinaAlert("Thông báo", "Bạn chưa thêm sản phẩm nào vào giỏ hàng!");
  }
}

function calculatePrice(t) {
  var n = parseInt(t),
    r = $("#ci-size-" + n).val(),
    o = $("#ci-color-" + n).val(),
    i = parseInt($("#ci-quantity-" + n).val(), 10),
    a = $("#ci-note-" + n).val(),
    u = !!$("#ci-count-" + n).is(":checked"),
    e = $("#tta-" + n),
    s = $("#sf-" + n),
    c = $("#sta-" + n),
    l = $("#ci-rate-" + n).data("val"),
    f = $("#ci-price-" + n).data("val"),
    p = Math.round(i * l * f),
    d = Math.round(4.5 * p / 100),
    h = p + d;
  e.text(p.format()), s.text(d.format()), c.text(h.format()), getData("tbex_products", function (t) {
    var e = (products = t.tbex_products)[n];
    e.size = r, e.color = o, e.amount = i, e.note = a, e.count = u, products[n] = e, setData({
      tbex_products: products
    }, function () {
      console.log("[TBVN] Modify success")
    })
  })
}

function getPrice() {
  return "1688" == currentDomain ? getPriceFrom1688() : getPriceFromTaobao()
}

function getPriceFrom1688() {
  var r = [];
  return $("tr.price td[data-range]").each(function (t, e) {
    var n = $(e).attr("data-range");
    void 0 === n ? r = parseFloat($(e).find(".value").text()) : (n = $.parseJSON(n), r.push(n))
  }), "object" == typeof r && 0 == r.length && (r = parseFloat($("#mod-detail-price").find("span.num").text())), isNaN(r) && "object" != typeof r && (r = $(".table-sku").find("tr:first").find("td.price").find("em.value").text(), r = parseFloat(r)), r
}

function getPriceFromTaobao() {
  var t = $(rules[currentDomain].crawle.originPrice),
    e = $(rules[currentDomain].crawle.promoPrice),
    n = t.text(),
    r = e.text(),
    o = 0,
    i = 0,
    a = 0,
    u = 0;
  if (-1 < n.indexOf("-")) {
    var s = n.split("-");
    o = parseFloat(s[0]), i = parseFloat(s[1]), n = 0
  } else n = parseFloat(n);
  if (-1 < r.indexOf("-")) {
    s = r.split("-");
    a = parseFloat(s[0]), u = parseFloat(s[1]), r = 0
  } else r = parseFloat(r);
  return {
    orgPrice: n,
    proPrice: r,
    lowPrice: o,
    highPrice: i,
    lowPromo: a,
    highPromo: u
  }
}

function removeBox() {
  $("#asachina-alert-wrapper").remove(), $("#asachina-alert-backdrop").remove()
}

function getData(t, e) {
  chrome.storage.local.get(t, e)
}

function setData(t, e) {
  chrome.storage.local.set(t, e)
}

function makeColor(t) {
  return {
    TAOBAO: "#FF4400",
    TMALL: "#DD2727",
    1688: "#FF7300"
  } [t]
}

function retrieveWindowVariables() {
  var t = document.createElement("script");
  t.id = "tmpScript", t.appendChild(document.createTextNode("if(typeof g_config !== 'undefined') localStorage.setItem('hungthinh_config', JSON.stringify(g_config));")), (document.body || document.head || document.documentElement).appendChild(t), $("#tmpScript").remove()
}

function checkElementExists() {
  return 0 < $("#J_SKU .J_SKU, .tb-sku .J_TSaleProp, #J_isku .tb-skin .tb-prop, #j-sku-list-1, #j-sku-list-2, #j-sku-list-3, #j-sku-list-4 ").length
}

function checkFullProperty() {
  var t = 0;
  t = $(".tb-sku .tb-prop.tm-sale-prop, #J_isku .tb-skin .tb-prop, #j-sku-list-1, #j-sku-list-2, #j-sku-list-3, #j-sku-list-4").length;
  var e = 0;
  return e = $(".tb-sku  .tb-prop.tm-sale-prop .tb-selected, #J_isku .tb-skin .tb-prop .J_TSaleProp .tb-selected, #j-sku-list-1 .active, #j-sku-list-2 .active, #j-sku-list-3 .active, #j-sku-list-4 .active").length, 0 == e ? (asachinaAlert("Thông báo", "Bạn chưa chọn thuộc tính cho sản phẩm."), !1) : e > 0 && t > e ? (asachinaAlert("Thông báo", "Bạn phải chọn đầy đủ thuộc tính cho sản phẩm."), !1) : e > 0 && t == e ? !0 : !1
}

function checkFor1688Com() {
  var t, e = 1;
  t = $(".de-cal-content .amount-input").val();
  var n = "";
  if (void 0 !== (n = $(".unit-detail-freight-cost").attr("data-unit-config")) && (n = JSON.parse(n)), "object" == typeof n && (e = parseInt(n.beginAmount)), t < e) return asachinaAlert("Thông báo", "Shop yêu cầu mua tối thiểu " + e + " sản phẩm."), !1;
  if (0 < $(".list-leading .unit-detail-spec-operator").length && 0 == $(".list-leading .selected").length) return asachinaAlert("Thông báo", "Bạn chưa chọn thuộc tính cho sản phẩm."), !1;
  var r = 0,
    o = $(".amount .amount-input, .obj-amount .amount-input");
  return void 0 !== o && o.length ? o.each(function (t, e) {
    r += e.value
  }) : void 0 !== (o = $(".unit-detail-amount-control .amount-input")) && (r = o.val(), product1688.push(getSingleProduct1688Com())), 0 != r || (asachinaAlert("Thông báo", "Bạn chưa chọn số lượng sản phẩm cần mua."), !1)
}

function retnum(t) {
  return t.replace(/[^0-9]/g, "")
}

function getDomain(t) {
  var e = "others";
  return 0 < t.indexOf("taobao") && (e = "taobao"), 0 < t.indexOf("tmall") && (e = "tmall"), 0 < t.indexOf("1688") && (e = "1688"), e
}

function tbe_iframe_favorite(t) {
  return '<div class="tbe_box_container"><div class="tbe_box_title"><div class="left">Sản phẩm</div><div class="right"><a href="#" class="tbe_remove1">X</a></div><div class="clear"></div></div><iframe src="' + t + '" width="400px" height="500px"></iframe></div>'
}

function getlocalData(t) {
  return "undefined" != typeof Storage ? localStorage.getItem(t) : (console.log("Sorry! No Web Storage support.."), !1)
}

function arrayUnique(t, e) {
  var n = !0;
  if (0 < t.length)
    for (var r = t.length - 1; 0 <= r; r--) t[r].a === e.a && (n = !1);
  return n && t.push(e), t
}

function taobaoSkuId(t, e) {
  var n = ";" + t + ";" + e + ";",
    r = ";" + e + ";" + t + ";",
    o = JSON.parse(getlocalData("hungthinh_config"));
  return "object" == typeof o && (void 0 !== o.skuInfo && void 0 !== o.skuInfo.skuMap ? "object" == typeof (o = o.skuInfo.skuMap) ? $.each(o, function (t, e) {
    t == n ? n = e.skuId : t == r && (n = e.skuId)
  }) : n = null : n = null), n
}

function taobaoShopNick() {
  var t = "",
    e = (JSON.parse(getlocalData("hungthinh_config")), $(".tb-shop-name a, .shop-name a.shop-name-link"));
  return void 0 !== e && (t = $(e).attr("title")), void 0 !== t && t.length || (t = $(e).text()), t
}

function taobaoShopLink() {
  var t = "",
    e = $(".tb-shop-name a, .shop-name a.shop-name-link");
  return void 0 !== e && (t = $(e).attr("href")), changeLink(t)
}

function tmallShopNick() {
  var t = "",
    e = (JSON.parse(getlocalData("hungthinh_config")), $(".shopLink, .slogo-shopname"));
  return void 0 !== e && (t = $(e).text()), t
}

function tmallShopLink() {
  var t = "",
    e = $(".shopLink, .slogo-shopname");
  return void 0 !== e && (t = $(e).attr("href")), changeLink(t)
}

function AliShopNick() {
  var t = "",
    e = $("#j-store-info-wrap .store-intro .store-lnk");
  return void 0 !== e && (t = $(e).text()), t
}

function AliShopLink() {
  var t = "",
    e = $("#j-store-info-wrap .store-intro .store-lnk");
  return void 0 !== e && (t = $(e).attr("href")), changeLink(t)
}

function com1688ShopNick() {
  var t = "",
    e = $(".company-name");
  return void 0 !== e && (t = $(e).attr("title")), void 0 !== t && t.length || (t = $(e).text()), t
}

function com1688ShopLink() {
  var t = "",
    e = $(".app-offerdetail_topbar, .app-import_topbar, .app-smt_topbar, .app-offerdetail_topbar, .app-common_topbar");
  return void 0 !== e && e.length && ((e = $(e).attr("data-view-config")).length ? "object" == typeof (e = JSON.parse(e)) && void 0 !== e.currentDomainUrl && (t = e.currentDomainUrl) : t = $("input.currentdomain").val()), changeLink(t)
}

function getsellerId() {
  var t = "",
    e = JSON.parse(getlocalData("hungthinh_config"));
  return e && (t = e.sellerId), t
}

function $_GET(t) {
  var r = {};
  return window.location.href.replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function (t, e, n) {
    r[e] = void 0 !== n ? n : ""
  }), t ? r[t] ? r[t] : null : r
}

function changeLink(t) {
  return t
}

function com1688Quantity() {
  var t = $(".list-total .amount .value");
  return void 0 !== t && (t = parseInt(t.text())), !(void 0 === t || !t) && t
}

function checkLinkWarning() {
  var t = $(".warning-info .sea-iconfont.warn-icon").length;
  return void 0 === t || !!t
}

function getSingleProduct1688Com() {
  var t = {
      img: "",
      list: []
    },
    e = $("td.price .value:first");
  if (e == "NaN") {
    e = $(".price-now").val();
  }
  e = void 0 !== e ? parseFloat(e.text()) : 0;
  var n = $(".unit-detail-amount-control .amount-input"),
    r = {
      color: "",
      isMix: "false",
      max: "",
      min: "0",
      mixAmount: "0",
      mixBegin: "0",
      mixNumber: "0",
      price: e,
      qty: n = void 0 !== n ? parseInt(n.val()) : 0,
      size: "",
      skuName: "",
      wsRuleNum: "",
      wsRuleUnit: ""
    };
  t.list.push(r);
  var o = $(".mod-detail-gallery .tab-pane .box-img img");
  return void 0 !== o && (o = o.attr("src")), void 0 !== o && o.length && (t.img = o), t
}! function (h, k) {
  function u(t) {
    var e = t.length,
      n = xt.type(t);
    return !xt.isWindow(t) && (!(1 !== t.nodeType || !e) || ("array" === n || "function" !== n && (0 === e || "number" == typeof e && 0 < e && e - 1 in t)))
  }

  function r(t, e, n, r) {
    if (xt.acceptData(t)) {
      var o, i, a = xt.expando,
        u = t.nodeType,
        s = u ? xt.cache : t,
        c = u ? t[a] : t[a] && a;
      if (c && s[c] && (r || s[c].data) || n !== k || "string" != typeof e) return c || (c = u ? t[a] = G.pop() || xt.guid++ : a), s[c] || (s[c] = u ? {} : {
        toJSON: xt.noop
      }), ("object" == typeof e || "function" == typeof e) && (r ? s[c] = xt.extend(s[c], e) : s[c].data = xt.extend(s[c].data, e)), i = s[c], r || (i.data || (i.data = {}), i = i.data), n !== k && (i[xt.camelCase(e)] = n), "string" == typeof e ? null == (o = i[e]) && (o = i[xt.camelCase(e)]) : o = i, o
    }
  }

  function n(t, e, n) {
    if (xt.acceptData(t)) {
      var r, o, i = t.nodeType,
        a = i ? xt.cache : t,
        u = i ? t[xt.expando] : xt.expando;
      if (a[u]) {
        if (e && (r = n ? a[u] : a[u].data)) {
          xt.isArray(e) ? e = e.concat(xt.map(e, xt.camelCase)) : e in r ? e = [e] : e = (e = xt.camelCase(e)) in r ? [e] : e.split(" "), o = e.length;
          for (; o--;) delete r[e[o]];
          if (n ? !c(r) : !xt.isEmptyObject(r)) return
        }(n || (delete a[u].data, c(a[u]))) && (i ? xt.cleanData([t], !0) : xt.support.deleteExpando || a != a.window ? delete a[u] : a[u] = null)
      }
    }
  }

  function s(t, e, n) {
    if (n === k && 1 === t.nodeType) {
      var r = "data-" + e.replace(_t, "-$1").toLowerCase();
      if ("string" == typeof (n = t.getAttribute(r))) {
        try {
          n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : bt.test(n) ? xt.parseJSON(n) : n)
        } catch (t) {}
        xt.data(t, e, n)
      } else n = k
    }
    return n
  }

  function c(t) {
    var e;
    for (e in t)
      if (("data" !== e || !xt.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
    return !0
  }

  function o() {
    return !0
  }

  function l() {
    return !1
  }

  function t() {
    try {
      return z.activeElement
    } catch (t) {}
  }

  function e(t, e) {
    for (;
      (t = t[e]) && 1 !== t.nodeType;);
    return t
  }

  function i(t, n, r) {
    if (xt.isFunction(n)) return xt.grep(t, function (t, e) {
      return !!n.call(t, e, t) !== r
    });
    if (n.nodeType) return xt.grep(t, function (t) {
      return t === n !== r
    });
    if ("string" == typeof n) {
      if (Mt.test(n)) return xt.filter(n, t, r);
      n = xt.filter(n, t)
    }
    return xt.grep(t, function (t) {
      return 0 <= xt.inArray(t, n) !== r
    })
  }

  function g(t) {
    var e = Rt.split("|"),
      n = t.createDocumentFragment();
    if (n.createElement)
      for (; e.length;) n.createElement(e.pop());
    return n
  }

  function a(t, e) {
    return xt.nodeName(t, "table") && xt.nodeName(1 === e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
  }

  function m(t) {
    return t.type = (null !== xt.find.attr(t, "type")) + "/" + t.type, t
  }

  function v(t) {
    var e = Qt.exec(t.type);
    return e ? t.type = e[1] : t.removeAttribute("type"), t
  }

  function y(t, e) {
    for (var n, r = 0; null != (n = t[r]); r++) xt._data(n, "globalEval", !e || xt._data(e[r], "globalEval"))
  }

  function f(t, e) {
    if (1 === e.nodeType && xt.hasData(t)) {
      var n, r, o, i = xt._data(t),
        a = xt._data(e, i),
        u = i.events;
      if (u)
        for (n in delete a.handle, a.events = {}, u)
          for (r = 0, o = u[n].length; r < o; r++) xt.event.add(e, n, u[n][r]);
      a.data && (a.data = xt.extend({}, a.data))
    }
  }

  function p(t, e) {
    var n, r, o;
    if (1 === e.nodeType) {
      if (n = e.nodeName.toLowerCase(), !xt.support.noCloneEvent && e[xt.expando]) {
        for (r in (o = xt._data(e)).events) xt.removeEvent(e, r, o.handle);
        e.removeAttribute(xt.expando)
      }
      "script" === n && e.text !== t.text ? (m(e).text = t.text, v(e)) : "object" === n ? (e.parentNode && (e.outerHTML = t.outerHTML), xt.support.html5Clone && t.innerHTML && !xt.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === n && Gt.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === n ? e.defaultSelected = e.selected = t.defaultSelected : ("input" === n || "textarea" === n) && (e.defaultValue = t.defaultValue)
    }
  }

  function b(t, e) {
    var n, r, o = 0,
      i = typeof t.getElementsByTagName !== B ? t.getElementsByTagName(e || "*") : typeof t.querySelectorAll !== B ? t.querySelectorAll(e || "*") : k;
    if (!i)
      for (i = [], n = t.childNodes || t; null != (r = n[o]); o++) !e || xt.nodeName(r, e) ? i.push(r) : xt.merge(i, b(r, e));
    return e === k || e && xt.nodeName(t, e) ? xt.merge([t], i) : i
  }

  function x(t) {
    Gt.test(t.type) && (t.defaultChecked = t.checked)
  }

  function d(t, e) {
    if (e in t) return e;
    for (var n = e.charAt(0).toUpperCase() + e.slice(1), r = e, o = ve.length; o--;)
      if ((e = ve[o] + n) in t) return e;
    return r
  }

  function _(t, e) {
    return t = e || t, "none" === xt.css(t, "display") || !xt.contains(t.ownerDocument, t)
  }

  function w(t, e) {
    for (var n, r, o, i = [], a = 0, u = t.length; a < u; a++)(r = t[a]).style && (i[a] = xt._data(r, "olddisplay"), n = r.style.display, e ? (i[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && _(r) && (i[a] = xt._data(r, "olddisplay", N(r.nodeName)))) : i[a] || (o = _(r), (n && "none" !== n || !o) && xt._data(r, "olddisplay", o ? n : xt.css(r, "display"))));
    for (a = 0; a < u; a++)(r = t[a]).style && (e && "none" !== r.style.display && "" !== r.style.display || (r.style.display = e ? i[a] || "" : "none"));
    return t
  }

  function T(t, e, n) {
    var r = le.exec(e);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : e
  }

  function S(t, e, n, r, o) {
    for (var i = n === (r ? "border" : "content") ? 4 : "width" === e ? 1 : 0, a = 0; i < 4; i += 2) "margin" === n && (a += xt.css(t, n + me[i], !0, o)), r ? ("content" === n && (a -= xt.css(t, "padding" + me[i], !0, o)), "margin" !== n && (a -= xt.css(t, "border" + me[i] + "Width", !0, o))) : (a += xt.css(t, "padding" + me[i], !0, o), "padding" !== n && (a += xt.css(t, "border" + me[i] + "Width", !0, o)));
    return a
  }

  function A(t, e, n) {
    var r = !0,
      o = "width" === e ? t.offsetWidth : t.offsetHeight,
      i = re(t),
      a = xt.support.boxSizing && "border-box" === xt.css(t, "boxSizing", !1, i);
    if (o <= 0 || null == o) {
      if (((o = oe(t, e, i)) < 0 || null == o) && (o = t.style[e]), fe.test(o)) return o;
      r = a && (xt.support.boxSizingReliable || o === t.style[e]), o = parseFloat(o) || 0
    }
    return o + S(t, e, n || (a ? "border" : "content"), r, i) + "px"
  }

  function N(t) {
    var e = z,
      n = de[t];
    return n || ("none" !== (n = C(t, e)) && n || ((e = ((ne = (ne || xt("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(e.documentElement))[0].contentWindow || ne[0].contentDocument).document).write("<!doctype html><html><body>"), e.close(), n = C(t, e), ne.detach()), de[t] = n), n
  }

  function C(t, e) {
    var n = xt(e.createElement(t)).appendTo(e.body),
      r = xt.css(n[0], "display");
    return n.remove(), r
  }

  function $(n, t, r, o) {
    var e;
    if (xt.isArray(t)) xt.each(t, function (t, e) {
      r || be.test(n) ? o(n, e) : $(n + "[" + ("object" == typeof e ? t : "") + "]", e, r, o)
    });
    else if (r || "object" !== xt.type(t)) o(n, t);
    else
      for (e in t) $(n + "[" + e + "]", t[e], r, o)
  }

  function D(i) {
    return function (t, e) {
      "string" != typeof t && (e = t, t = "*");
      var n, r = 0,
        o = t.toLowerCase().match(it) || [];
      if (xt.isFunction(e))
        for (; n = o[r++];) "+" === n[0] ? (n = n.slice(1) || "*", (i[n] = i[n] || []).unshift(e)) : (i[n] = i[n] || []).push(e)
    }
  }

  function E(e, o, i, a) {
    function u(t) {
      var r;
      return s[t] = !0, xt.each(e[t] || [], function (t, e) {
        var n = e(o, i, a);
        return "string" != typeof n || c || s[n] ? c ? !(r = n) : k : (o.dataTypes.unshift(n), u(n), !1)
      }), r
    }
    var s = {},
      c = e === Oe;
    return u(o.dataTypes[0]) || !s["*"] && u("*")
  }

  function j(t, e) {
    var n, r, o = xt.ajaxSettings.flatOptions || {};
    for (r in e) e[r] !== k && ((o[r] ? t : n || (n = {}))[r] = e[r]);
    return n && xt.extend(!0, t, n), t
  }

  function L() {
    try {
      return new h.XMLHttpRequest
    } catch (t) {}
  }

  function P() {
    return setTimeout(function () {
      We = k
    }), We = xt.now()
  }

  function O(t, e, n) {
    for (var r, o = (Ge[e] || []).concat(Ge["*"]), i = 0, a = o.length; i < a; i++)
      if (r = o[i].call(n, e, t)) return r
  }

  function M(i, t, e) {
    var n, a, r = 0,
      o = Ve.length,
      u = xt.Deferred().always(function () {
        delete s.elem
      }),
      s = function () {
        if (a) return !1;
        for (var t = We || P(), e = Math.max(0, c.startTime + c.duration - t), n = 1 - (e / c.duration || 0), r = 0, o = c.tweens.length; r < o; r++) c.tweens[r].run(n);
        return u.notifyWith(i, [c, n, e]), n < 1 && o ? e : (u.resolveWith(i, [c]), !1)
      },
      c = u.promise({
        elem: i,
        props: xt.extend({}, t),
        opts: xt.extend(!0, {
          specialEasing: {}
        }, e),
        originalProperties: t,
        originalOptions: e,
        startTime: We || P(),
        duration: e.duration,
        tweens: [],
        createTween: function (t, e) {
          var n = xt.Tween(i, c.opts, t, e, c.opts.specialEasing[t] || c.opts.easing);
          return c.tweens.push(n), n
        },
        stop: function (t) {
          var e = 0,
            n = t ? c.tweens.length : 0;
          if (a) return this;
          for (a = !0; e < n; e++) c.tweens[e].run(1);
          return t ? u.resolveWith(i, [c, t]) : u.rejectWith(i, [c, t]), this
        }
      }),
      l = c.props;
    for (function (t, e) {
        var n, r, o, i, a;
        for (n in t)
          if (r = xt.camelCase(n), o = e[r], i = t[n], xt.isArray(i) && (o = i[1], i = t[n] = i[0]), n !== r && (t[r] = i, delete t[n]), (a = xt.cssHooks[r]) && "expand" in a)
            for (n in i = a.expand(i), delete t[r], i) n in t || (t[n] = i[n], e[n] = o);
          else e[r] = o
      }(l, c.opts.specialEasing); r < o; r++)
      if (n = Ve[r].call(c, i, l, c.opts)) return n;
    return xt.map(l, O, c), xt.isFunction(c.opts.start) && c.opts.start.call(i, c), xt.fx.timer(xt.extend(s, {
      elem: i,
      anim: c,
      queue: c.opts.queue
    })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
  }

  function I(t, e, n, r, o) {
    return new I.prototype.init(t, e, n, r, o)
  }

  function F(t, e) {
    var n, r = {
        height: t
      },
      o = 0;
    for (e = e ? 1 : 0; o < 4; o += 2 - e) r["margin" + (n = me[o])] = r["padding" + n] = t;
    return e && (r.opacity = r.width = t), r
  }

  function H(t) {
    return xt.isWindow(t) ? t : 9 === t.nodeType && (t.defaultView || t.parentWindow)
  }
  var R, q, B = typeof k,
    W = h.location,
    z = h.document,
    J = z.documentElement,
    U = h.jQuery,
    X = h.$,
    V = {},
    G = [],
    K = "1.10.2",
    Y = G.concat,
    Q = G.push,
    Z = G.slice,
    tt = G.indexOf,
    et = V.toString,
    nt = V.hasOwnProperty,
    rt = K.trim,
    xt = function (t, e) {
      return new xt.fn.init(t, e, q)
    },
    ot = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    it = /\S+/g,
    at = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    ut = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    st = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ct = /^[\],:{}\s]*$/,
    lt = /(?:^|:|,)(?:\s*\[)+/g,
    ft = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    pt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
    dt = /^-ms-/,
    ht = /-([\da-z])/gi,
    gt = function (t, e) {
      return e.toUpperCase()
    },
    mt = function (t) {
      (z.addEventListener || "load" === t.type || "complete" === z.readyState) && (vt(), xt.ready())
    },
    vt = function () {
      z.addEventListener ? (z.removeEventListener("DOMContentLoaded", mt, !1), h.removeEventListener("load", mt, !1)) : (z.detachEvent("onreadystatechange", mt), h.detachEvent("onload", mt))
    };
  xt.fn = xt.prototype = {
      jquery: K,
      constructor: xt,
      init: function (t, e, n) {
        var r, o;
        if (!t) return this;
        if ("string" == typeof t) {
          if (!(r = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && 3 <= t.length ? [null, t, null] : ut.exec(t)) || !r[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
          if (r[1]) {
            if (e = e instanceof xt ? e[0] : e, xt.merge(this, xt.parseHTML(r[1], e && e.nodeType ? e.ownerDocument || e : z, !0)), st.test(r[1]) && xt.isPlainObject(e))
              for (r in e) xt.isFunction(this[r]) ? this[r](e[r]) : this.attr(r, e[r]);
            return this
          }
          if ((o = z.getElementById(r[2])) && o.parentNode) {
            if (o.id !== r[2]) return n.find(t);
            this.length = 1, this[0] = o
          }
          return this.context = z, this.selector = t, this
        }
        return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : xt.isFunction(t) ? n.ready(t) : (t.selector !== k && (this.selector = t.selector, this.context = t.context), xt.makeArray(t, this))
      },
      selector: "",
      length: 0,
      toArray: function () {
        return Z.call(this)
      },
      get: function (t) {
        return null == t ? this.toArray() : t < 0 ? this[this.length + t] : this[t]
      },
      pushStack: function (t) {
        var e = xt.merge(this.constructor(), t);
        return e.prevObject = this, e.context = this.context, e
      },
      each: function (t, e) {
        return xt.each(this, t, e)
      },
      ready: function (t) {
        return xt.ready.promise().done(t), this
      },
      slice: function () {
        return this.pushStack(Z.apply(this, arguments))
      },
      first: function () {
        return this.eq(0)
      },
      last: function () {
        return this.eq(-1)
      },
      eq: function (t) {
        var e = this.length,
          n = +t + (t < 0 ? e : 0);
        return this.pushStack(0 <= n && n < e ? [this[n]] : [])
      },
      map: function (n) {
        return this.pushStack(xt.map(this, function (t, e) {
          return n.call(t, e, t)
        }))
      },
      end: function () {
        return this.prevObject || this.constructor(null)
      },
      push: Q,
      sort: [].sort,
      splice: [].splice
    }, xt.fn.init.prototype = xt.fn, xt.extend = xt.fn.extend = function () {
      var t, e, n, r, o, i, a = arguments[0] || {},
        u = 1,
        s = arguments.length,
        c = !1;
      for ("boolean" == typeof a && (c = a, a = arguments[1] || {}, u = 2), "object" == typeof a || xt.isFunction(a) || (a = {}), s === u && (a = this, --u); u < s; u++)
        if (null != (o = arguments[u]))
          for (r in o) t = a[r], a !== (n = o[r]) && (c && n && (xt.isPlainObject(n) || (e = xt.isArray(n))) ? (e ? (e = !1, i = t && xt.isArray(t) ? t : []) : i = t && xt.isPlainObject(t) ? t : {}, a[r] = xt.extend(c, i, n)) : n !== k && (a[r] = n));
      return a
    }, xt.extend({
      expando: "jQuery" + (K + Math.random()).replace(/\D/g, ""),
      noConflict: function (t) {
        return h.$ === xt && (h.$ = X), t && h.jQuery === xt && (h.jQuery = U), xt
      },
      isReady: !1,
      readyWait: 1,
      holdReady: function (t) {
        t ? xt.readyWait++ : xt.ready(!0)
      },
      ready: function (t) {
        if (!0 === t ? !--xt.readyWait : !xt.isReady) {
          if (!z.body) return setTimeout(xt.ready);
          (xt.isReady = !0) !== t && 0 < --xt.readyWait || (R.resolveWith(z, [xt]), xt.fn.trigger && xt(z).trigger("ready").off("ready"))
        }
      },
      isFunction: function (t) {
        return "function" === xt.type(t)
      },
      isArray: Array.isArray || function (t) {
        return "array" === xt.type(t)
      },
      isWindow: function (t) {
        return null != t && t == t.window
      },
      isNumeric: function (t) {
        return !isNaN(parseFloat(t)) && isFinite(t)
      },
      type: function (t) {
        return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? V[et.call(t)] || "object" : typeof t
      },
      isPlainObject: function (t) {
        var e;
        if (!t || "object" !== xt.type(t) || t.nodeType || xt.isWindow(t)) return !1;
        try {
          if (t.constructor && !nt.call(t, "constructor") && !nt.call(t.constructor.prototype, "isPrototypeOf")) return !1
        } catch (t) {
          return !1
        }
        if (xt.support.ownLast)
          for (e in t) return nt.call(t, e);
        for (e in t);
        return e === k || nt.call(t, e)
      },
      isEmptyObject: function (t) {
        var e;
        for (e in t) return !1;
        return !0
      },
      error: function (t) {
        throw Error(t)
      },
      parseHTML: function (t, e, n) {
        if (!t || "string" != typeof t) return null;
        "boolean" == typeof e && (n = e, e = !1), e = e || z;
        var r = st.exec(t),
          o = !n && [];
        return r ? [e.createElement(r[1])] : (r = xt.buildFragment([t], e, o), o && xt(o).remove(), xt.merge([], r.childNodes))
      },
      parseJSON: function (t) {
        return h.JSON && h.JSON.parse ? h.JSON.parse(t) : null === t ? t : "string" == typeof t && ((t = xt.trim(t)) && ct.test(t.replace(ft, "@").replace(pt, "]").replace(lt, ""))) ? Function("return " + t)() : (xt.error("Invalid JSON: " + t), k)
      },
      parseXML: function (t) {
        var e;
        if (!t || "string" != typeof t) return null;
        try {
          h.DOMParser ? e = (new DOMParser).parseFromString(t, "text/xml") : ((e = new ActiveXObject("Microsoft.XMLDOM")).async = "false", e.loadXML(t))
        } catch (t) {
          e = k
        }
        return e && e.documentElement && !e.getElementsByTagName("parsererror").length || xt.error("Invalid XML: " + t), e
      },
      noop: function () {},
      globalEval: function (t) {
        t && xt.trim(t) && (h.execScript || function (t) {
          h.eval.call(h, t)
        })(t)
      },
      camelCase: function (t) {
        return t.replace(dt, "ms-").replace(ht, gt)
      },
      nodeName: function (t, e) {
        return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
      },
      each: function (t, e, n) {
        var r = 0,
          o = t.length,
          i = u(t);
        if (n) {
          if (i)
            for (; r < o && !1 !== e.apply(t[r], n); r++);
          else
            for (r in t)
              if (!1 === e.apply(t[r], n)) break
        } else if (i)
          for (; r < o && !1 !== e.call(t[r], r, t[r]); r++);
        else
          for (r in t)
            if (!1 === e.call(t[r], r, t[r])) break;
        return t
      },
      trim: rt && !rt.call("\ufeff ") ? function (t) {
        return null == t ? "" : rt.call(t)
      } : function (t) {
        return null == t ? "" : (t + "").replace(at, "")
      },
      makeArray: function (t, e) {
        var n = e || [];
        return null != t && (u(Object(t)) ? xt.merge(n, "string" == typeof t ? [t] : t) : Q.call(n, t)), n
      },
      inArray: function (t, e, n) {
        var r;
        if (e) {
          if (tt) return tt.call(e, t, n);
          for (r = e.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0; n < r; n++)
            if (n in e && e[n] === t) return n
        }
        return -1
      },
      merge: function (t, e) {
        var n = e.length,
          r = t.length,
          o = 0;
        if ("number" == typeof n)
          for (; o < n; o++) t[r++] = e[o];
        else
          for (; e[o] !== k;) t[r++] = e[o++];
        return t.length = r, t
      },
      grep: function (t, e, n) {
        var r = [],
          o = 0,
          i = t.length;
        for (n = !!n; o < i; o++) n !== !!e(t[o], o) && r.push(t[o]);
        return r
      },
      map: function (t, e, n) {
        var r, o = 0,
          i = t.length,
          a = [];
        if (u(t))
          for (; o < i; o++) null != (r = e(t[o], o, n)) && (a[a.length] = r);
        else
          for (o in t) null != (r = e(t[o], o, n)) && (a[a.length] = r);
        return Y.apply([], a)
      },
      guid: 1,
      proxy: function (t, e) {
        var n, r, o;
        return "string" == typeof e && (o = t[e], e = t, t = o), xt.isFunction(t) ? (n = Z.call(arguments, 2), (r = function () {
          return t.apply(e || this, n.concat(Z.call(arguments)))
        }).guid = t.guid = t.guid || xt.guid++, r) : k
      },
      access: function (t, e, n, r, o, i, a) {
        var u = 0,
          s = t.length,
          c = null == n;
        if ("object" === xt.type(n))
          for (u in o = !0, n) xt.access(t, e, u, n[u], !0, i, a);
        else if (r !== k && (o = !0, xt.isFunction(r) || (a = !0), c && (a ? (e.call(t, r), e = null) : (c = e, e = function (t, e, n) {
            return c.call(xt(t), n)
          })), e))
          for (; u < s; u++) e(t[u], n, a ? r : r.call(t[u], u, e(t[u], n)));
        return o ? t : c ? e.call(t) : s ? e(t[0], n) : i
      },
      now: function () {
        return (new Date).getTime()
      },
      swap: function (t, e, n, r) {
        var o, i, a = {};
        for (i in e) a[i] = t.style[i], t.style[i] = e[i];
        for (i in o = n.apply(t, r || []), e) t.style[i] = a[i];
        return o
      }
    }), xt.ready.promise = function (t) {
      if (!R)
        if (R = xt.Deferred(), "complete" === z.readyState) setTimeout(xt.ready);
        else if (z.addEventListener) z.addEventListener("DOMContentLoaded", mt, !1), h.addEventListener("load", mt, !1);
      else {
        z.attachEvent("onreadystatechange", mt), h.attachEvent("onload", mt);
        var n = !1;
        try {
          n = null == h.frameElement && z.documentElement
        } catch (t) {}
        n && n.doScroll && function e() {
          if (!xt.isReady) {
            try {
              n.doScroll("left")
            } catch (t) {
              return setTimeout(e, 50)
            }
            vt(), xt.ready()
          }
        }()
      }
      return R.promise(t)
    }, xt.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
      V["[object " + e + "]"] = e.toLowerCase()
    }), q = xt(z),
    function (n, o) {
      function _(t, e, n, r) {
        var o, i, a, u, s, c, l, f, p, d;
        if ((e ? e.ownerDocument || e : I) !== $ && C(e), n = n || [], !t || "string" != typeof t) return n;
        if (1 !== (u = (e = e || $).nodeType) && 9 !== u) return [];
        if (E && !r) {
          if (o = ht.exec(t))
            if (a = o[1]) {
              if (9 === u) {
                if (!(i = e.getElementById(a)) || !i.parentNode) return n;
                if (i.id === a) return n.push(i), n
              } else if (e.ownerDocument && (i = e.ownerDocument.getElementById(a)) && O(e, i) && i.id === a) return n.push(i), n
            } else {
              if (o[2]) return K.apply(n, e.getElementsByTagName(t)), n;
              if ((a = o[3]) && v.getElementsByClassName && e.getElementsByClassName) return K.apply(n, e.getElementsByClassName(a)), n
            }
          if (v.qsa && (!j || !j.test(t))) {
            if (f = l = M, p = e, d = 9 === u && t, 1 === u && "object" !== e.nodeName.toLowerCase()) {
              for (c = h(t), (l = e.getAttribute("id")) ? f = l.replace(vt, "\\$&") : e.setAttribute("id", f), f = "[id='" + f + "'] ", s = c.length; s--;) c[s] = f + g(c[s]);
              p = st.test(t) && e.parentNode || e, d = c.join(",")
            }
            if (d) try {
              return K.apply(n, p.querySelectorAll(d)), n
            } catch (t) {} finally {
              l || e.removeAttribute("id")
            }
          }
        }
        return function (t, e, n, r) {
          var o, i, a, u, s, c = h(t);
          if (!r && 1 === c.length) {
            if (2 < (i = c[0] = c[0].slice(0)).length && "ID" === (a = i[0]).type && v.getById && 9 === e.nodeType && E && T.relative[i[1].type]) {
              if (!(e = (T.find.ID(a.matches[0].replace(yt, bt), e) || [])[0])) return n;
              t = t.slice(i.shift().value.length)
            }
            for (o = pt.needsContext.test(t) ? 0 : i.length; o-- && (a = i[o], !T.relative[u = a.type]);)
              if ((s = T.find[u]) && (r = s(a.matches[0].replace(yt, bt), st.test(i[0].type) && e.parentNode || e))) {
                if (i.splice(o, 1), !(t = r.length && g(i))) return K.apply(n, r), n;
                break
              }
          }
          return S(t, c)(r, e, !E, n, st.test(t)), n
        }(t.replace(it, "$1"), e, n, r)
      }

      function t() {
        var r = [];
        return function t(e, n) {
          return r.push(e += " ") > T.cacheLength && delete t[r.shift()], t[e] = n
        }
      }

      function s(t) {
        return t[M] = !0, t
      }

      function r(t) {
        var e = $.createElement("div");
        try {
          return !!t(e)
        } catch (t) {
          return !1
        } finally {
          e.parentNode && e.parentNode.removeChild(e), e = null
        }
      }

      function e(t, e) {
        for (var n = t.split("|"), r = t.length; r--;) T.attrHandle[n[r]] = e
      }

      function c(t, e) {
        var n = e && t,
          r = n && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || 1 << 31) - (~t.sourceIndex || 1 << 31);
        if (r) return r;
        if (n)
          for (; n = n.nextSibling;)
            if (n === e) return -1;
        return t ? 1 : -1
      }

      function i(e) {
        return function (t) {
          return "input" === t.nodeName.toLowerCase() && t.type === e
        }
      }

      function a(n) {
        return function (t) {
          var e = t.nodeName.toLowerCase();
          return ("input" === e || "button" === e) && t.type === n
        }
      }

      function u(a) {
        return s(function (i) {
          return i = +i, s(function (t, e) {
            for (var n, r = a([], t.length, i), o = r.length; o--;) t[n = r[o]] && (t[n] = !(e[n] = t[n]))
          })
        })
      }

      function l() {}

      function h(t, e) {
        var n, r, o, i, a, u, s, c = q[t + " "];
        if (c) return e ? 0 : c.slice(0);
        for (a = t, u = [], s = T.preFilter; a;) {
          for (i in (!n || (r = at.exec(a))) && (r && (a = a.slice(r[0].length) || a), u.push(o = [])), n = !1, (r = ut.exec(a)) && (n = r.shift(), o.push({
              value: n,
              type: r[0].replace(it, " ")
            }), a = a.slice(n.length)), T.filter) !(r = pt[i].exec(a)) || s[i] && !(r = s[i](r)) || (n = r.shift(), o.push({
            value: n,
            type: i,
            matches: r
          }), a = a.slice(n.length));
          if (!n) break
        }
        return e ? a.length : a ? _.error(t) : q(t, u).slice(0)
      }

      function g(t) {
        for (var e = 0, n = t.length, r = ""; e < n; e++) r += t[e].value;
        return r
      }

      function f(u, t, e) {
        var s = t.dir,
          c = e && "parentNode" === s,
          l = H++;
        return t.first ? function (t, e, n) {
          for (; t = t[s];)
            if (1 === t.nodeType || c) return u(t, e, n)
        } : function (t, e, n) {
          var r, o, i, a = F + " " + l;
          if (n) {
            for (; t = t[s];)
              if ((1 === t.nodeType || c) && u(t, e, n)) return !0
          } else
            for (; t = t[s];)
              if (1 === t.nodeType || c)
                if ((o = (i = t[M] || (t[M] = {}))[s]) && o[0] === a) {
                  if (!0 === (r = o[1]) || r === k) return !0 === r
                } else if ((o = i[s] = [a])[1] = u(t, e, n) || k, !0 === o[1]) return !0
        }
      }

      function p(o) {
        return 1 < o.length ? function (t, e, n) {
          for (var r = o.length; r--;)
            if (!o[r](t, e, n)) return !1;
          return !0
        } : o[0]
      }

      function w(t, e, n, r, o) {
        for (var i, a = [], u = 0, s = t.length, c = null != e; u < s; u++)(i = t[u]) && (!n || n(i, r, o)) && (a.push(i), c && e.push(u));
        return a
      }

      function y(d, h, g, m, v, t) {
        return m && !m[M] && (m = y(m)), v && !v[M] && (v = y(v, t)), s(function (t, e, n, r) {
          var o, i, a, u = [],
            s = [],
            c = e.length,
            l = t || function (t, e, n) {
              for (var r = 0, o = e.length; r < o; r++) _(t, e[r], n);
              return n
            }(h || "*", n.nodeType ? [n] : n, []),
            f = !d || !t && h ? l : w(l, u, d, n, r),
            p = g ? v || (t ? d : c || m) ? [] : e : f;
          if (g && g(f, p, n, r), m)
            for (o = w(p, s), m(o, [], n, r), i = o.length; i--;)(a = o[i]) && (p[s[i]] = !(f[s[i]] = a));
          if (t) {
            if (v || d) {
              if (v) {
                for (o = [], i = p.length; i--;)(a = p[i]) && o.push(f[i] = a);
                v(null, p = [], o, r)
              }
              for (i = p.length; i--;)(a = p[i]) && -1 < (o = v ? Q.call(t, a) : u[i]) && (t[o] = !(e[o] = a))
            }
          } else p = w(p === e ? p.splice(c, p.length) : p), v ? v(null, e, p, r) : K.apply(e, p)
        })
      }

      function d(t) {
        for (var r, e, n, o = t.length, i = T.relative[t[0].type], a = i || T.relative[" "], u = i ? 1 : 0, s = f(function (t) {
            return t === r
          }, a, !0), c = f(function (t) {
            return -1 < Q.call(r, t)
          }, a, !0), l = [function (t, e, n) {
            return !i && (n || e !== A) || ((r = e).nodeType ? s(t, e, n) : c(t, e, n))
          }]; u < o; u++)
          if (e = T.relative[t[u].type]) l = [f(p(l), e)];
          else {
            if ((e = T.filter[t[u].type].apply(null, t[u].matches))[M]) {
              for (n = ++u; n < o && !T.relative[t[n].type]; n++);
              return y(1 < u && p(l), 1 < u && g(t.slice(0, u - 1).concat({
                value: " " === t[u - 2].type ? "*" : ""
              })).replace(it, "$1"), e, u < n && d(t.slice(u, n)), n < o && d(t = t.slice(n)), n < o && g(t))
            }
            l.push(e)
          }
        return p(l)
      }
      var m, v, k, T, b, x, S, A, N, C, $, D, E, j, L, P, O, M = "sizzle" + -new Date,
        I = n.document,
        F = 0,
        H = 0,
        R = t(),
        q = t(),
        B = t(),
        W = !1,
        z = function (t, e) {
          return t === e && (W = !0), 0
        },
        J = typeof o,
        U = {}.hasOwnProperty,
        X = [],
        V = X.pop,
        G = X.push,
        K = X.push,
        Y = X.slice,
        Q = X.indexOf || function (t) {
          for (var e = 0, n = this.length; e < n; e++)
            if (this[e] === t) return e;
          return -1
        },
        Z = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        tt = "[\\x20\\t\\r\\n\\f]",
        et = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        nt = et.replace("w", "w#"),
        rt = "\\[" + tt + "*(" + et + ")" + tt + "*(?:([*^$|!~]?=)" + tt + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + nt + ")|)|)" + tt + "*\\]",
        ot = ":(" + et + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + rt.replace(3, 8) + ")*)|.*)\\)|)",
        it = RegExp("^" + tt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + tt + "+$", "g"),
        at = RegExp("^" + tt + "*," + tt + "*"),
        ut = RegExp("^" + tt + "*([>+~]|" + tt + ")" + tt + "*"),
        st = RegExp(tt + "*[+~]"),
        ct = RegExp("=" + tt + "*([^\\]'\"]*)" + tt + "*\\]", "g"),
        lt = RegExp(ot),
        ft = RegExp("^" + nt + "$"),
        pt = {
          ID: RegExp("^#(" + et + ")"),
          CLASS: RegExp("^\\.(" + et + ")"),
          TAG: RegExp("^(" + et.replace("w", "w*") + ")"),
          ATTR: RegExp("^" + rt),
          PSEUDO: RegExp("^" + ot),
          CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + tt + "*(even|odd|(([+-]|)(\\d*)n|)" + tt + "*(?:([+-]|)" + tt + "*(\\d+)|))" + tt + "*\\)|)", "i"),
          bool: RegExp("^(?:" + Z + ")$", "i"),
          needsContext: RegExp("^" + tt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + tt + "*((?:-\\d)?\\d*)" + tt + "*\\)|)(?=[^-]|$)", "i")
        },
        dt = /^[^{]+\{\s*\[native \w/,
        ht = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        gt = /^(?:input|select|textarea|button)$/i,
        mt = /^h\d$/i,
        vt = /'|\\/g,
        yt = RegExp("\\\\([\\da-f]{1,6}" + tt + "?|(" + tt + ")|.)", "ig"),
        bt = function (t, e, n) {
          var r = "0x" + e - 65536;
          return r != r || n ? e : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r)
        };
      try {
        K.apply(X = Y.call(I.childNodes), I.childNodes), X[I.childNodes.length].nodeType
      } catch (t) {
        K = {
          apply: X.length ? function (t, e) {
            G.apply(t, Y.call(e))
          } : function (t, e) {
            for (var n = t.length, r = 0; t[n++] = e[r++];);
            t.length = n - 1
          }
        }
      }
      for (m in x = _.isXML = function (t) {
          var e = t && (t.ownerDocument || t).documentElement;
          return !!e && "HTML" !== e.nodeName
        }, v = _.support = {}, C = _.setDocument = function (t) {
          var s = t ? t.ownerDocument || t : I,
            e = s.defaultView;
          return s !== $ && 9 === s.nodeType && s.documentElement ? (D = ($ = s).documentElement, E = !x(s), e && e.attachEvent && e !== e.top && e.attachEvent("onbeforeunload", function () {
            C()
          }), v.attributes = r(function (t) {
            return t.className = "i", !t.getAttribute("className")
          }), v.getElementsByTagName = r(function (t) {
            return t.appendChild(s.createComment("")), !t.getElementsByTagName("*").length
          }), v.getElementsByClassName = r(function (t) {
            return t.innerHTML = "<div class='a'></div><div class='a i'></div>", t.firstChild.className = "i", 2 === t.getElementsByClassName("i").length
          }), v.getById = r(function (t) {
            return D.appendChild(t).id = M, !s.getElementsByName || !s.getElementsByName(M).length
          }), v.getById ? (T.find.ID = function (t, e) {
            if (typeof e.getElementById !== J && E) {
              var n = e.getElementById(t);
              return n && n.parentNode ? [n] : []
            }
          }, T.filter.ID = function (t) {
            var e = t.replace(yt, bt);
            return function (t) {
              return t.getAttribute("id") === e
            }
          }) : (delete T.find.ID, T.filter.ID = function (t) {
            var n = t.replace(yt, bt);
            return function (t) {
              var e = typeof t.getAttributeNode !== J && t.getAttributeNode("id");
              return e && e.value === n
            }
          }), T.find.TAG = v.getElementsByTagName ? function (t, e) {
            return typeof e.getElementsByTagName !== J ? e.getElementsByTagName(t) : o
          } : function (t, e) {
            var n, r = [],
              o = 0,
              i = e.getElementsByTagName(t);
            if ("*" === t) {
              for (; n = i[o++];) 1 === n.nodeType && r.push(n);
              return r
            }
            return i
          }, T.find.CLASS = v.getElementsByClassName && function (t, e) {
            return typeof e.getElementsByClassName !== J && E ? e.getElementsByClassName(t) : o
          }, L = [], j = [], (v.qsa = dt.test(s.querySelectorAll)) && (r(function (t) {
            t.innerHTML = "<select><option selected=''></option></select>", t.querySelectorAll("[selected]").length || j.push("\\[" + tt + "*(?:value|" + Z + ")"), t.querySelectorAll(":checked").length || j.push(":checked")
          }), r(function (t) {
            var e = s.createElement("input");
            e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("t", ""), t.querySelectorAll("[t^='']").length && j.push("[*^$]=" + tt + "*(?:''|\"\")"), t.querySelectorAll(":enabled").length || j.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), j.push(",.*:")
          })), (v.matchesSelector = dt.test(P = D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && r(function (t) {
            v.disconnectedMatch = P.call(t, "div"), P.call(t, "[s!='']:x"), L.push("!=", ot)
          }), j = j.length && RegExp(j.join("|")), L = L.length && RegExp(L.join("|")), O = dt.test(D.contains) || D.compareDocumentPosition ? function (t, e) {
            var n = 9 === t.nodeType ? t.documentElement : t,
              r = e && e.parentNode;
            return t === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(r)))
          } : function (t, e) {
            if (e)
              for (; e = e.parentNode;)
                if (e === t) return !0;
            return !1
          }, z = D.compareDocumentPosition ? function (t, e) {
            if (t === e) return W = !0, 0;
            var n = e.compareDocumentPosition && t.compareDocumentPosition && t.compareDocumentPosition(e);
            return n ? 1 & n || !v.sortDetached && e.compareDocumentPosition(t) === n ? t === s || O(I, t) ? -1 : e === s || O(I, e) ? 1 : N ? Q.call(N, t) - Q.call(N, e) : 0 : 4 & n ? -1 : 1 : t.compareDocumentPosition ? -1 : 1
          } : function (t, e) {
            var n, r = 0,
              o = t.parentNode,
              i = e.parentNode,
              a = [t],
              u = [e];
            if (t === e) return W = !0, 0;
            if (!o || !i) return t === s ? -1 : e === s ? 1 : o ? -1 : i ? 1 : N ? Q.call(N, t) - Q.call(N, e) : 0;
            if (o === i) return c(t, e);
            for (n = t; n = n.parentNode;) a.unshift(n);
            for (n = e; n = n.parentNode;) u.unshift(n);
            for (; a[r] === u[r];) r++;
            return r ? c(a[r], u[r]) : a[r] === I ? -1 : u[r] === I ? 1 : 0
          }, s) : $
        }, _.matches = function (t, e) {
          return _(t, null, null, e)
        }, _.matchesSelector = function (t, e) {
          if ((t.ownerDocument || t) !== $ && C(t), e = e.replace(ct, "='$1']"), !(!v.matchesSelector || !E || L && L.test(e) || j && j.test(e))) try {
            var n = P.call(t, e);
            if (n || v.disconnectedMatch || t.document && 11 !== t.document.nodeType) return n
          } catch (t) {}
          return 0 < _(e, $, null, [t]).length
        }, _.contains = function (t, e) {
          return (t.ownerDocument || t) !== $ && C(t), O(t, e)
        }, _.attr = function (t, e) {
          (t.ownerDocument || t) !== $ && C(t);
          var n = T.attrHandle[e.toLowerCase()],
            r = n && U.call(T.attrHandle, e.toLowerCase()) ? n(t, e, !E) : o;
          return r === o ? v.attributes || !E ? t.getAttribute(e) : (r = t.getAttributeNode(e)) && r.specified ? r.value : null : r
        }, _.error = function (t) {
          throw Error("Syntax error, unrecognized expression: " + t)
        }, _.uniqueSort = function (t) {
          var e, n = [],
            r = 0,
            o = 0;
          if (W = !v.detectDuplicates, N = !v.sortStable && t.slice(0), t.sort(z), W) {
            for (; e = t[o++];) e === t[o] && (r = n.push(o));
            for (; r--;) t.splice(n[r], 1)
          }
          return t
        }, b = _.getText = function (t) {
          var e, n = "",
            r = 0,
            o = t.nodeType;
          if (o) {
            if (1 === o || 9 === o || 11 === o) {
              if ("string" == typeof t.textContent) return t.textContent;
              for (t = t.firstChild; t; t = t.nextSibling) n += b(t)
            } else if (3 === o || 4 === o) return t.nodeValue
          } else
            for (; e = t[r]; r++) n += b(e);
          return n
        }, (T = _.selectors = {
          cacheLength: 50,
          createPseudo: s,
          match: pt,
          attrHandle: {},
          find: {},
          relative: {
            ">": {
              dir: "parentNode",
              first: !0
            },
            " ": {
              dir: "parentNode"
            },
            "+": {
              dir: "previousSibling",
              first: !0
            },
            "~": {
              dir: "previousSibling"
            }
          },
          preFilter: {
            ATTR: function (t) {
              return t[1] = t[1].replace(yt, bt), t[3] = (t[4] || t[5] || "").replace(yt, bt), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
            },
            CHILD: function (t) {
              return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || _.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && _.error(t[0]), t
            },
            PSEUDO: function (t) {
              var e, n = !t[5] && t[2];
              return pt.CHILD.test(t[0]) ? null : (t[3] && t[4] !== o ? t[2] = t[4] : n && lt.test(n) && (e = h(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
            }
          },
          filter: {
            TAG: function (t) {
              var e = t.replace(yt, bt).toLowerCase();
              return "*" === t ? function () {
                return !0
              } : function (t) {
                return t.nodeName && t.nodeName.toLowerCase() === e
              }
            },
            CLASS: function (t) {
              var e = R[t + " "];
              return e || (e = RegExp("(^|" + tt + ")" + t + "(" + tt + "|$)")) && R(t, function (t) {
                return e.test("string" == typeof t.className && t.className || typeof t.getAttribute !== J && t.getAttribute("class") || "")
              })
            },
            ATTR: function (n, r, o) {
              return function (t) {
                var e = _.attr(t, n);
                return null == e ? "!=" === r : !r || (e += "", "=" === r ? e === o : "!=" === r ? e !== o : "^=" === r ? o && 0 === e.indexOf(o) : "*=" === r ? o && -1 < e.indexOf(o) : "$=" === r ? o && e.slice(-o.length) === o : "~=" === r ? -1 < (" " + e + " ").indexOf(o) : "|=" === r && (e === o || e.slice(0, o.length + 1) === o + "-"))
              }
            },
            CHILD: function (d, t, e, h, g) {
              var m = "nth" !== d.slice(0, 3),
                v = "last" !== d.slice(-4),
                y = "of-type" === t;
              return 1 === h && 0 === g ? function (t) {
                return !!t.parentNode
              } : function (t, e, n) {
                var r, o, i, a, u, s, c = m !== v ? "nextSibling" : "previousSibling",
                  l = t.parentNode,
                  f = y && t.nodeName.toLowerCase(),
                  p = !n && !y;
                if (l) {
                  if (m) {
                    for (; c;) {
                      for (i = t; i = i[c];)
                        if (y ? i.nodeName.toLowerCase() === f : 1 === i.nodeType) return !1;
                      s = c = "only" === d && !s && "nextSibling"
                    }
                    return !0
                  }
                  if (s = [v ? l.firstChild : l.lastChild], v && p) {
                    for (u = (r = (o = l[M] || (l[M] = {}))[d] || [])[0] === F && r[1], a = r[0] === F && r[2], i = u && l.childNodes[u]; i = ++u && i && i[c] || (a = u = 0) || s.pop();)
                      if (1 === i.nodeType && ++a && i === t) {
                        o[d] = [F, u, a];
                        break
                      }
                  } else if (p && (r = (t[M] || (t[M] = {}))[d]) && r[0] === F) a = r[1];
                  else
                    for (;
                      (i = ++u && i && i[c] || (a = u = 0) || s.pop()) && ((y ? i.nodeName.toLowerCase() !== f : 1 !== i.nodeType) || !++a || (p && ((i[M] || (i[M] = {}))[d] = [F, a]), i !== t)););
                  return (a -= g) === h || 0 == a % h && 0 <= a / h
                }
              }
            },
            PSEUDO: function (t, i) {
              var e, a = T.pseudos[t] || T.setFilters[t.toLowerCase()] || _.error("unsupported pseudo: " + t);
              return a[M] ? a(i) : 1 < a.length ? (e = [t, t, "", i], T.setFilters.hasOwnProperty(t.toLowerCase()) ? s(function (t, e) {
                for (var n, r = a(t, i), o = r.length; o--;) t[n = Q.call(t, r[o])] = !(e[n] = r[o])
              }) : function (t) {
                return a(t, 0, e)
              }) : a
            }
          },
          pseudos: {
            not: s(function (t) {
              var r = [],
                o = [],
                u = S(t.replace(it, "$1"));
              return u[M] ? s(function (t, e, n, r) {
                for (var o, i = u(t, null, r, []), a = t.length; a--;)(o = i[a]) && (t[a] = !(e[a] = o))
              }) : function (t, e, n) {
                return r[0] = t, u(r, null, n, o), !o.pop()
              }
            }),
            has: s(function (e) {
              return function (t) {
                return 0 < _(e, t).length
              }
            }),
            contains: s(function (e) {
              return function (t) {
                return -1 < (t.textContent || t.innerText || b(t)).indexOf(e)
              }
            }),
            lang: s(function (n) {
              return ft.test(n || "") || _.error("unsupported lang: " + n), n = n.replace(yt, bt).toLowerCase(),
                function (t) {
                  var e;
                  do {
                    if (e = E ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (e = e.toLowerCase()) === n || 0 === e.indexOf(n + "-")
                  } while ((t = t.parentNode) && 1 === t.nodeType);
                  return !1
                }
            }),
            target: function (t) {
              var e = n.location && n.location.hash;
              return e && e.slice(1) === t.id
            },
            root: function (t) {
              return t === D
            },
            focus: function (t) {
              return t === $.activeElement && (!$.hasFocus || $.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
            },
            enabled: function (t) {
              return !1 === t.disabled
            },
            disabled: function (t) {
              return !0 === t.disabled
            },
            checked: function (t) {
              var e = t.nodeName.toLowerCase();
              return "input" === e && !!t.checked || "option" === e && !!t.selected
            },
            selected: function (t) {
              return t.parentNode && t.parentNode.selectedIndex, !0 === t.selected
            },
            empty: function (t) {
              for (t = t.firstChild; t; t = t.nextSibling)
                if ("@" < t.nodeName || 3 === t.nodeType || 4 === t.nodeType) return !1;
              return !0
            },
            parent: function (t) {
              return !T.pseudos.empty(t)
            },
            header: function (t) {
              return mt.test(t.nodeName)
            },
            input: function (t) {
              return gt.test(t.nodeName)
            },
            button: function (t) {
              var e = t.nodeName.toLowerCase();
              return "input" === e && "button" === t.type || "button" === e
            },
            text: function (t) {
              var e;
              return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || e.toLowerCase() === t.type)
            },
            first: u(function () {
              return [0]
            }),
            last: u(function (t, e) {
              return [e - 1]
            }),
            eq: u(function (t, e, n) {
              return [n < 0 ? n + e : n]
            }),
            even: u(function (t, e) {
              for (var n = 0; n < e; n += 2) t.push(n);
              return t
            }),
            odd: u(function (t, e) {
              for (var n = 1; n < e; n += 2) t.push(n);
              return t
            }),
            lt: u(function (t, e, n) {
              for (var r = n < 0 ? n + e : n; 0 <= --r;) t.push(r);
              return t
            }),
            gt: u(function (t, e, n) {
              for (var r = n < 0 ? n + e : n; e > ++r;) t.push(r);
              return t
            })
          }
        }).pseudos.nth = T.pseudos.eq, {
          radio: !0,
          checkbox: !0,
          file: !0,
          password: !0,
          image: !0
        }) T.pseudos[m] = i(m);
      for (m in {
          submit: !0,
          reset: !0
        }) T.pseudos[m] = a(m);
      l.prototype = T.filters = T.pseudos, T.setFilters = new l, S = _.compile = function (t, e) {
        var n, m, v, y, b, x, r, o = [],
          i = [],
          a = B[t + " "];
        if (!a) {
          for (e || (e = h(t)), n = e.length; n--;)(a = d(e[n]))[M] ? o.push(a) : i.push(a);
          a = B(t, (m = i, b = (y = 0) < (v = o).length, x = 0 < m.length, r = function (t, e, n, r, o) {
            var i, a, u, s = [],
              c = 0,
              l = "0",
              f = t && [],
              p = null != o,
              d = A,
              h = t || x && T.find.TAG("*", o && e.parentNode || e),
              g = F += null == d ? 1 : Math.random() || .1;
            for (p && (A = e !== $ && e, k = y); null != (i = h[l]); l++) {
              if (x && i) {
                for (a = 0; u = m[a++];)
                  if (u(i, e, n)) {
                    r.push(i);
                    break
                  }
                p && (F = g, k = ++y)
              }
              b && ((i = !u && i) && c--, t && f.push(i))
            }
            if (c += l, b && l !== c) {
              for (a = 0; u = v[a++];) u(f, s, e, n);
              if (t) {
                if (0 < c)
                  for (; l--;) f[l] || s[l] || (s[l] = V.call(r));
                s = w(s)
              }
              K.apply(r, s), p && !t && 0 < s.length && 1 < c + v.length && _.uniqueSort(r)
            }
            return p && (F = g, A = d), f
          }, b ? s(r) : r))
        }
        return a
      }, v.sortStable = M.split("").sort(z).join("") === M, v.detectDuplicates = W, C(), v.sortDetached = r(function (t) {
        return 1 & t.compareDocumentPosition($.createElement("div"))
      }), r(function (t) {
        return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
      }) || e("type|href|height|width", function (t, e, n) {
        return n ? o : t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
      }), v.attributes && r(function (t) {
        return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
      }) || e("value", function (t, e, n) {
        return n || "input" !== t.nodeName.toLowerCase() ? o : t.defaultValue
      }), r(function (t) {
        return null == t.getAttribute("disabled")
      }) || e(Z, function (t, e, n) {
        var r;
        return n ? o : (r = t.getAttributeNode(e)) && r.specified ? r.value : !0 === t[e] ? e.toLowerCase() : null
      }), xt.find = _, xt.expr = _.selectors, xt.expr[":"] = xt.expr.pseudos, xt.unique = _.uniqueSort, xt.text = _.getText, xt.isXMLDoc = _.isXML, xt.contains = _.contains
    }(h);
  var yt = {};
  xt.Callbacks = function (o) {
    var t, n;
    o = "string" == typeof o ? yt[o] || (n = yt[t = o] = {}, xt.each(t.match(it) || [], function (t, e) {
      n[e] = !0
    }), n) : xt.extend({}, o);
    var r, e, i, a, u, s, c = [],
      l = !o.once && [],
      f = function (t) {
        for (e = o.memory && t, i = !0, u = s || 0, s = 0, a = c.length, r = !0; c && u < a; u++)
          if (!1 === c[u].apply(t[0], t[1]) && o.stopOnFalse) {
            e = !1;
            break
          }
        r = !1, c && (l ? l.length && f(l.shift()) : e ? c = [] : p.disable())
      },
      p = {
        add: function () {
          if (c) {
            var t = c.length;
            ! function r(t) {
              xt.each(t, function (t, e) {
                var n = xt.type(e);
                "function" === n ? o.unique && p.has(e) || c.push(e) : e && e.length && "string" !== n && r(e)
              })
            }(arguments), r ? a = c.length : e && (s = t, f(e))
          }
          return this
        },
        remove: function () {
          return c && xt.each(arguments, function (t, e) {
            for (var n; - 1 < (n = xt.inArray(e, c, n));) c.splice(n, 1), r && (n <= a && a--, n <= u && u--)
          }), this
        },
        has: function (t) {
          return t ? -1 < xt.inArray(t, c) : !(!c || !c.length)
        },
        empty: function () {
          return c = [], a = 0, this
        },
        disable: function () {
          return c = l = e = k, this
        },
        disabled: function () {
          return !c
        },
        lock: function () {
          return l = k, e || p.disable(), this
        },
        locked: function () {
          return !l
        },
        fireWith: function (t, e) {
          return !c || i && !l || (e = [t, (e = e || []).slice ? e.slice() : e], r ? l.push(e) : f(e)), this
        },
        fire: function () {
          return p.fireWith(this, arguments), this
        },
        fired: function () {
          return !!i
        }
      };
    return p
  }, xt.extend({
    Deferred: function (t) {
      var a = [
          ["resolve", "done", xt.Callbacks("once memory"), "resolved"],
          ["reject", "fail", xt.Callbacks("once memory"), "rejected"],
          ["notify", "progress", xt.Callbacks("memory")]
        ],
        o = "pending",
        u = {
          state: function () {
            return o
          },
          always: function () {
            return s.done(arguments).fail(arguments), this
          },
          then: function () {
            var i = arguments;
            return xt.Deferred(function (o) {
              xt.each(a, function (t, e) {
                var n = e[0],
                  r = xt.isFunction(i[t]) && i[t];
                s[e[1]](function () {
                  var t = r && r.apply(this, arguments);
                  t && xt.isFunction(t.promise) ? t.promise().done(o.resolve).fail(o.reject).progress(o.notify) : o[n + "With"](this === u ? o.promise() : this, r ? [t] : arguments)
                })
              }), i = null
            }).promise()
          },
          promise: function (t) {
            return null != t ? xt.extend(t, u) : u
          }
        },
        s = {};
      return u.pipe = u.then, xt.each(a, function (t, e) {
        var n = e[2],
          r = e[3];
        u[e[1]] = n.add, r && n.add(function () {
          o = r
        }, a[1 ^ t][2].disable, a[2][2].lock), s[e[0]] = function () {
          return s[e[0] + "With"](this === s ? u : this, arguments), this
        }, s[e[0] + "With"] = n.fireWith
      }), u.promise(s), t && t.call(s, s), s
    },
    when: function (t) {
      var o, e, n, r = 0,
        i = Z.call(arguments),
        a = i.length,
        u = 1 !== a || t && xt.isFunction(t.promise) ? a : 0,
        s = 1 === u ? t : xt.Deferred(),
        c = function (e, n, r) {
          return function (t) {
            n[e] = this, r[e] = 1 < arguments.length ? Z.call(arguments) : t, r === o ? s.notifyWith(n, r) : --u || s.resolveWith(n, r)
          }
        };
      if (1 < a)
        for (o = Array(a), e = Array(a), n = Array(a); r < a; r++) i[r] && xt.isFunction(i[r].promise) ? i[r].promise().done(c(r, n, i)).fail(s.reject).progress(c(r, e, o)) : --u;
      return u || s.resolveWith(n, i), s.promise()
    }
  }), xt.support = function (i) {
    var t, e, n, r, o, a, u, s, c, l = z.createElement("div");
    if (l.setAttribute("className", "t"), l.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", t = l.getElementsByTagName("*") || [], !(e = l.getElementsByTagName("a")[0]) || !e.style || !t.length) return i;
    a = (r = z.createElement("select")).appendChild(z.createElement("option")), n = l.getElementsByTagName("input")[0], e.style.cssText = "top:1px;float:left;opacity:.5", i.getSetAttribute = "t" !== l.className, i.leadingWhitespace = 3 === l.firstChild.nodeType, i.tbody = !l.getElementsByTagName("tbody").length, i.htmlSerialize = !!l.getElementsByTagName("link").length, i.style = /top/.test(e.getAttribute("style")), i.hrefNormalized = "/a" === e.getAttribute("href"), i.opacity = /^0.5/.test(e.style.opacity), i.cssFloat = !!e.style.cssFloat, i.checkOn = !!n.value, i.optSelected = a.selected, i.enctype = !!z.createElement("form").enctype, i.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, i.inlineBlockNeedsLayout = !1, i.shrinkWrapBlocks = !1, i.pixelPosition = !1, i.deleteExpando = !0, i.noCloneEvent = !0, i.reliableMarginRight = !0, i.boxSizingReliable = !0, n.checked = !0, i.noCloneChecked = n.cloneNode(!0).checked, r.disabled = !0, i.optDisabled = !a.disabled;
    try {
      delete l.test
    } catch (t) {
      i.deleteExpando = !1
    }
    for (c in (n = z.createElement("input")).setAttribute("value", ""), i.input = "" === n.getAttribute("value"), n.value = "t", n.setAttribute("type", "radio"), i.radioValue = "t" === n.value, n.setAttribute("checked", "t"), n.setAttribute("name", "t"), (o = z.createDocumentFragment()).appendChild(n), i.appendChecked = n.checked, i.checkClone = o.cloneNode(!0).cloneNode(!0).lastChild.checked, l.attachEvent && (l.attachEvent("onclick", function () {
        i.noCloneEvent = !1
      }), l.cloneNode(!0).click()), {
        submit: !0,
        change: !0,
        focusin: !0
      }) l.setAttribute(u = "on" + c, "t"), i[c + "Bubbles"] = u in h || !1 === l.attributes[u].expando;
    for (c in l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", i.clearCloneStyle = "content-box" === l.style.backgroundClip, xt(i)) break;
    return i.ownLast = "0" !== c, xt(function () {
      var t, e, n, r = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
        o = z.getElementsByTagName("body")[0];
      o && ((t = z.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", o.appendChild(t).appendChild(l), l.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (n = l.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none", s = 0 === n[0].offsetHeight, n[0].style.display = "", n[1].style.display = "none", i.reliableHiddenOffsets = s && 0 === n[0].offsetHeight, l.innerHTML = "", l.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", xt.swap(o, null != o.style.zoom ? {
        zoom: 1
      } : {}, function () {
        i.boxSizing = 4 === l.offsetWidth
      }), h.getComputedStyle && (i.pixelPosition = "1%" !== (h.getComputedStyle(l, null) || {}).top, i.boxSizingReliable = "4px" === (h.getComputedStyle(l, null) || {
        width: "4px"
      }).width, (e = l.appendChild(z.createElement("div"))).style.cssText = l.style.cssText = r, e.style.marginRight = e.style.width = "0", l.style.width = "1px", i.reliableMarginRight = !parseFloat((h.getComputedStyle(e, null) || {}).marginRight)), typeof l.style.zoom !== B && (l.innerHTML = "", l.style.cssText = r + "width:1px;padding:1px;display:inline;zoom:1", i.inlineBlockNeedsLayout = 3 === l.offsetWidth, l.style.display = "block", l.innerHTML = "<div></div>", l.firstChild.style.width = "5px", i.shrinkWrapBlocks = 3 !== l.offsetWidth, i.inlineBlockNeedsLayout && (o.style.zoom = 1)), o.removeChild(t), t = l = n = e = null)
    }), t = r = o = a = e = n = null, i
  }({});
  var bt = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    _t = /([A-Z])/g;
  xt.extend({
    cache: {},
    noData: {
      applet: !0,
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    hasData: function (t) {
      return !!(t = t.nodeType ? xt.cache[t[xt.expando]] : t[xt.expando]) && !c(t)
    },
    data: function (t, e, n) {
      return r(t, e, n)
    },
    removeData: function (t, e) {
      return n(t, e)
    },
    _data: function (t, e, n) {
      return r(t, e, n, !0)
    },
    _removeData: function (t, e) {
      return n(t, e, !0)
    },
    acceptData: function (t) {
      if (t.nodeType && 1 !== t.nodeType && 9 !== t.nodeType) return !1;
      var e = t.nodeName && xt.noData[t.nodeName.toLowerCase()];
      return !e || !0 !== e && t.getAttribute("classid") === e
    }
  }), xt.fn.extend({
    data: function (t, e) {
      var n, r, o = null,
        i = 0,
        a = this[0];
      if (t === k) {
        if (this.length && (o = xt.data(a), 1 === a.nodeType && !xt._data(a, "parsedAttrs"))) {
          for (n = a.attributes; n.length > i; i++) 0 === (r = n[i].name).indexOf("data-") && s(a, r = xt.camelCase(r.slice(5)), o[r]);
          xt._data(a, "parsedAttrs", !0)
        }
        return o
      }
      return "object" == typeof t ? this.each(function () {
        xt.data(this, t)
      }) : 1 < arguments.length ? this.each(function () {
        xt.data(this, t, e)
      }) : a ? s(a, t, xt.data(a, t)) : null
    },
    removeData: function (t) {
      return this.each(function () {
        xt.removeData(this, t)
      })
    }
  }), xt.extend({
    queue: function (t, e, n) {
      var r;
      return t ? (e = (e || "fx") + "queue", r = xt._data(t, e), n && (!r || xt.isArray(n) ? r = xt._data(t, e, xt.makeArray(n)) : r.push(n)), r || []) : k
    },
    dequeue: function (t, e) {
      e = e || "fx";
      var n = xt.queue(t, e),
        r = n.length,
        o = n.shift(),
        i = xt._queueHooks(t, e);
      "inprogress" === o && (o = n.shift(), r--), o && ("fx" === e && n.unshift("inprogress"), delete i.stop, o.call(t, function () {
        xt.dequeue(t, e)
      }, i)), !r && i && i.empty.fire()
    },
    _queueHooks: function (t, e) {
      var n = e + "queueHooks";
      return xt._data(t, n) || xt._data(t, n, {
        empty: xt.Callbacks("once memory").add(function () {
          xt._removeData(t, e + "queue"), xt._removeData(t, n)
        })
      })
    }
  }), xt.fn.extend({
    queue: function (e, n) {
      var t = 2;
      return "string" != typeof e && (n = e, e = "fx", t--), t > arguments.length ? xt.queue(this[0], e) : n === k ? this : this.each(function () {
        var t = xt.queue(this, e, n);
        xt._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && xt.dequeue(this, e)
      })
    },
    dequeue: function (t) {
      return this.each(function () {
        xt.dequeue(this, t)
      })
    },
    delay: function (r, t) {
      return r = xt.fx && xt.fx.speeds[r] || r, t = t || "fx", this.queue(t, function (t, e) {
        var n = setTimeout(t, r);
        e.stop = function () {
          clearTimeout(n)
        }
      })
    },
    clearQueue: function (t) {
      return this.queue(t || "fx", [])
    },
    promise: function (t, e) {
      var n, r = 1,
        o = xt.Deferred(),
        i = this,
        a = this.length,
        u = function () {
          --r || o.resolveWith(i, [i])
        };
      for ("string" != typeof t && (e = t, t = k), t = t || "fx"; a--;)(n = xt._data(i[a], t + "queueHooks")) && n.empty && (r++, n.empty.add(u));
      return u(), o.promise(e)
    }
  });
  var wt, kt, Tt = /[\t\r\n\f]/g,
    St = /\r/g,
    At = /^(?:input|select|textarea|button|object)$/i,
    Nt = /^(?:a|area)$/i,
    Ct = /^(?:checked|selected)$/i,
    $t = xt.support.getSetAttribute,
    Dt = xt.support.input;
  xt.fn.extend({
    attr: function (t, e) {
      return xt.access(this, xt.attr, t, e, 1 < arguments.length)
    },
    removeAttr: function (t) {
      return this.each(function () {
        xt.removeAttr(this, t)
      })
    },
    prop: function (t, e) {
      return xt.access(this, xt.prop, t, e, 1 < arguments.length)
    },
    removeProp: function (t) {
      return t = xt.propFix[t] || t, this.each(function () {
        try {
          this[t] = k, delete this[t]
        } catch (t) {}
      })
    },
    addClass: function (e) {
      var t, n, r, o, i, a = 0,
        u = this.length,
        s = "string" == typeof e && e;
      if (xt.isFunction(e)) return this.each(function (t) {
        xt(this).addClass(e.call(this, t, this.className))
      });
      if (s)
        for (t = (e || "").match(it) || []; a < u; a++)
          if (r = 1 === (n = this[a]).nodeType && (n.className ? (" " + n.className + " ").replace(Tt, " ") : " ")) {
            for (i = 0; o = t[i++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
            n.className = xt.trim(r)
          }
      return this
    },
    removeClass: function (e) {
      var t, n, r, o, i, a = 0,
        u = this.length,
        s = 0 === arguments.length || "string" == typeof e && e;
      if (xt.isFunction(e)) return this.each(function (t) {
        xt(this).removeClass(e.call(this, t, this.className))
      });
      if (s)
        for (t = (e || "").match(it) || []; a < u; a++)
          if (r = 1 === (n = this[a]).nodeType && (n.className ? (" " + n.className + " ").replace(Tt, " ") : "")) {
            for (i = 0; o = t[i++];)
              for (; 0 <= r.indexOf(" " + o + " ");) r = r.replace(" " + o + " ", " ");
            n.className = e ? xt.trim(r) : ""
          }
      return this
    },
    toggleClass: function (o, e) {
      var i = typeof o;
      return "boolean" == typeof e && "string" === i ? e ? this.addClass(o) : this.removeClass(o) : this.each(xt.isFunction(o) ? function (t) {
        xt(this).toggleClass(o.call(this, t, this.className, e), e)
      } : function () {
        if ("string" === i)
          for (var t, e = 0, n = xt(this), r = o.match(it) || []; t = r[e++];) n.hasClass(t) ? n.removeClass(t) : n.addClass(t);
        else(i === B || "boolean" === i) && (this.className && xt._data(this, "__className__", this.className), this.className = this.className || !1 === o ? "" : xt._data(this, "__className__") || "")
      })
    },
    hasClass: function (t) {
      for (var e = " " + t + " ", n = 0, r = this.length; n < r; n++)
        if (1 === this[n].nodeType && 0 <= (" " + this[n].className + " ").replace(Tt, " ").indexOf(e)) return !0;
      return !1
    },
    val: function (n) {
      var t, r, o, e = this[0];
      return arguments.length ? (o = xt.isFunction(n), this.each(function (t) {
        var e;
        1 === this.nodeType && (null == (e = o ? n.call(this, t, xt(this).val()) : n) ? e = "" : "number" == typeof e ? e += "" : xt.isArray(e) && (e = xt.map(e, function (t) {
          return null == t ? "" : t + ""
        })), (r = xt.valHooks[this.type] || xt.valHooks[this.nodeName.toLowerCase()]) && "set" in r && r.set(this, e, "value") !== k || (this.value = e))
      })) : e ? (r = xt.valHooks[e.type] || xt.valHooks[e.nodeName.toLowerCase()]) && "get" in r && (t = r.get(e, "value")) !== k ? t : "string" == typeof (t = e.value) ? t.replace(St, "") : null == t ? "" : t : void 0
    }
  }), xt.extend({
    valHooks: {
      option: {
        get: function (t) {
          var e = xt.find.attr(t, "value");
          return null != e ? e : t.text
        }
      },
      select: {
        get: function (t) {
          for (var e, n, r = t.options, o = t.selectedIndex, i = "select-one" === t.type || o < 0, a = i ? null : [], u = i ? o + 1 : r.length, s = o < 0 ? u : i ? o : 0; s < u; s++)
            if (!(!(n = r[s]).selected && s !== o || (xt.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && xt.nodeName(n.parentNode, "optgroup"))) {
              if (e = xt(n).val(), i) return e;
              a.push(e)
            }
          return a
        },
        set: function (t, e) {
          for (var n, r, o = t.options, i = xt.makeArray(e), a = o.length; a--;)((r = o[a]).selected = 0 <= xt.inArray(xt(r).val(), i)) && (n = !0);
          return n || (t.selectedIndex = -1), i
        }
      }
    },
    attr: function (t, e, n) {
      var r, o, i = t.nodeType;
      return t && 3 !== i && 8 !== i && 2 !== i ? typeof t.getAttribute === B ? xt.prop(t, e, n) : (1 === i && xt.isXMLDoc(t) || (e = e.toLowerCase(), r = xt.attrHooks[e] || (xt.expr.match.bool.test(e) ? kt : wt)), n === k ? r && "get" in r && null !== (o = r.get(t, e)) ? o : null == (o = xt.find.attr(t, e)) ? k : o : null !== n ? r && "set" in r && (o = r.set(t, n, e)) !== k ? o : (t.setAttribute(e, n + ""), n) : (xt.removeAttr(t, e), k)) : void 0
    },
    removeAttr: function (t, e) {
      var n, r, o = 0,
        i = e && e.match(it);
      if (i && 1 === t.nodeType)
        for (; n = i[o++];) r = xt.propFix[n] || n, xt.expr.match.bool.test(n) ? Dt && $t || !Ct.test(n) ? t[r] = !1 : t[xt.camelCase("default-" + n)] = t[r] = !1 : xt.attr(t, n, ""), t.removeAttribute($t ? n : r)
    },
    attrHooks: {
      type: {
        set: function (t, e) {
          if (!xt.support.radioValue && "radio" === e && xt.nodeName(t, "input")) {
            var n = t.value;
            return t.setAttribute("type", e), n && (t.value = n), e
          }
        }
      }
    },
    propFix: {
      for: "htmlFor",
      class: "className"
    },
    prop: function (t, e, n) {
      var r, o, i = t.nodeType;
      return t && 3 !== i && 8 !== i && 2 !== i ? ((1 !== i || !xt.isXMLDoc(t)) && (e = xt.propFix[e] || e, o = xt.propHooks[e]), n !== k ? o && "set" in o && (r = o.set(t, n, e)) !== k ? r : t[e] = n : o && "get" in o && null !== (r = o.get(t, e)) ? r : t[e]) : void 0
    },
    propHooks: {
      tabIndex: {
        get: function (t) {
          var e = xt.find.attr(t, "tabindex");
          return e ? parseInt(e, 10) : At.test(t.nodeName) || Nt.test(t.nodeName) && t.href ? 0 : -1
        }
      }
    }
  }), kt = {
    set: function (t, e, n) {
      return !1 === e ? xt.removeAttr(t, n) : Dt && $t || !Ct.test(n) ? t.setAttribute(!$t && xt.propFix[n] || n, n) : t[xt.camelCase("default-" + n)] = t[n] = !0, n
    }
  }, xt.each(xt.expr.match.bool.source.match(/\w+/g), function (t, e) {
    var i = xt.expr.attrHandle[e] || xt.find.attr;
    xt.expr.attrHandle[e] = Dt && $t || !Ct.test(e) ? function (t, e, n) {
      var r = xt.expr.attrHandle[e],
        o = n ? k : (xt.expr.attrHandle[e] = k) != i(t, e, n) ? e.toLowerCase() : null;
      return xt.expr.attrHandle[e] = r, o
    } : function (t, e, n) {
      return n ? k : t[xt.camelCase("default-" + e)] ? e.toLowerCase() : null
    }
  }), Dt && $t || (xt.attrHooks.value = {
    set: function (t, e, n) {
      return xt.nodeName(t, "input") ? (t.defaultValue = e, k) : wt && wt.set(t, e, n)
    }
  }), $t || (wt = {
    set: function (t, e, n) {
      var r = t.getAttributeNode(n);
      return r || t.setAttributeNode(r = t.ownerDocument.createAttribute(n)), r.value = e += "", "value" === n || e === t.getAttribute(n) ? e : k
    }
  }, xt.expr.attrHandle.id = xt.expr.attrHandle.name = xt.expr.attrHandle.coords = function (t, e, n) {
    var r;
    return n ? k : (r = t.getAttributeNode(e)) && "" !== r.value ? r.value : null
  }, xt.valHooks.button = {
    get: function (t, e) {
      var n = t.getAttributeNode(e);
      return n && n.specified ? n.value : k
    },
    set: wt.set
  }, xt.attrHooks.contenteditable = {
    set: function (t, e, n) {
      wt.set(t, "" !== e && e, n)
    }
  }, xt.each(["width", "height"], function (t, n) {
    xt.attrHooks[n] = {
      set: function (t, e) {
        return "" === e ? (t.setAttribute(n, "auto"), e) : k
      }
    }
  })), xt.support.hrefNormalized || xt.each(["href", "src"], function (t, e) {
    xt.propHooks[e] = {
      get: function (t) {
        return t.getAttribute(e, 4)
      }
    }
  }), xt.support.style || (xt.attrHooks.style = {
    get: function (t) {
      return t.style.cssText || k
    },
    set: function (t, e) {
      return t.style.cssText = e + ""
    }
  }), xt.support.optSelected || (xt.propHooks.selected = {
    get: function (t) {
      var e = t.parentNode;
      return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
    }
  }), xt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    xt.propFix[this.toLowerCase()] = this
  }), xt.support.enctype || (xt.propFix.enctype = "encoding"), xt.each(["radio", "checkbox"], function () {
    xt.valHooks[this] = {
      set: function (t, e) {
        return xt.isArray(e) ? t.checked = 0 <= xt.inArray(xt(t).val(), e) : k
      }
    }, xt.support.checkOn || (xt.valHooks[this].get = function (t) {
      return null === t.getAttribute("value") ? "on" : t.value
    })
  });
  var Et = /^(?:input|select|textarea)$/i,
    jt = /^key/,
    Lt = /^(?:mouse|contextmenu)|click/,
    Pt = /^(?:focusinfocus|focusoutblur)$/,
    Ot = /^([^.]*)(?:\.(.+)|)$/;
  xt.event = {
    global: {},
    add: function (t, e, n, r, o) {
      var i, a, u, s, c, l, f, p, d, h, g, m = xt._data(t);
      if (m) {
        for (n.handler && (n = (s = n).handler, o = s.selector), n.guid || (n.guid = xt.guid++), (a = m.events) || (a = m.events = {}), (l = m.handle) || ((l = m.handle = function (t) {
            return typeof xt === B || t && xt.event.triggered === t.type ? k : xt.event.dispatch.apply(l.elem, arguments)
          }).elem = t), u = (e = (e || "").match(it) || [""]).length; u--;) d = g = (i = Ot.exec(e[u]) || [])[1], h = (i[2] || "").split(".").sort(), d && (c = xt.event.special[d] || {}, d = (o ? c.delegateType : c.bindType) || d, c = xt.event.special[d] || {}, f = xt.extend({
          type: d,
          origType: g,
          data: r,
          handler: n,
          guid: n.guid,
          selector: o,
          needsContext: o && xt.expr.match.needsContext.test(o),
          namespace: h.join(".")
        }, s), (p = a[d]) || ((p = a[d] = []).delegateCount = 0, c.setup && !1 !== c.setup.call(t, r, h, l) || (t.addEventListener ? t.addEventListener(d, l, !1) : t.attachEvent && t.attachEvent("on" + d, l))), c.add && (c.add.call(t, f), f.handler.guid || (f.handler.guid = n.guid)), o ? p.splice(p.delegateCount++, 0, f) : p.push(f), xt.event.global[d] = !0);
        t = null
      }
    },
    remove: function (t, e, n, r, o) {
      var i, a, u, s, c, l, f, p, d, h, g, m = xt.hasData(t) && xt._data(t);
      if (m && (l = m.events)) {
        for (c = (e = (e || "").match(it) || [""]).length; c--;)
          if (d = g = (u = Ot.exec(e[c]) || [])[1], h = (u[2] || "").split(".").sort(), d) {
            for (f = xt.event.special[d] || {}, p = l[d = (r ? f.delegateType : f.bindType) || d] || [], u = u[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = i = p.length; i--;) a = p[i], !o && g !== a.origType || n && n.guid !== a.guid || u && !u.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (p.splice(i, 1), a.selector && p.delegateCount--, f.remove && f.remove.call(t, a));
            s && !p.length && (f.teardown && !1 !== f.teardown.call(t, h, m.handle) || xt.removeEvent(t, d, m.handle), delete l[d])
          } else
            for (d in l) xt.event.remove(t, d + e[c], n, r, !0);
        xt.isEmptyObject(l) && (delete m.handle, xt._removeData(t, "events"))
      }
    },
    trigger: function (t, e, n, r) {
      var o, i, a, u, s, c, l, f = [n || z],
        p = nt.call(t, "type") ? t.type : t,
        d = nt.call(t, "namespace") ? t.namespace.split(".") : [];
      if (a = c = n = n || z, 3 !== n.nodeType && 8 !== n.nodeType && !Pt.test(p + xt.event.triggered) && (0 <= p.indexOf(".") && (p = (d = p.split(".")).shift(), d.sort()), i = p.indexOf(":") < 0 && "on" + p, (t = t[xt.expando] ? t : new xt.Event(p, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = d.join("."), t.namespace_re = t.namespace ? RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = k, t.target || (t.target = n), e = null == e ? [t] : xt.makeArray(e, [t]), s = xt.event.special[p] || {}, r || !s.trigger || !1 !== s.trigger.apply(n, e))) {
        if (!r && !s.noBubble && !xt.isWindow(n)) {
          for (u = s.delegateType || p, Pt.test(u + p) || (a = a.parentNode); a; a = a.parentNode) f.push(a), c = a;
          c === (n.ownerDocument || z) && f.push(c.defaultView || c.parentWindow || h)
        }
        for (l = 0;
          (a = f[l++]) && !t.isPropagationStopped();) t.type = 1 < l ? u : s.bindType || p, (o = (xt._data(a, "events") || {})[t.type] && xt._data(a, "handle")) && o.apply(a, e), (o = i && a[i]) && xt.acceptData(a) && o.apply && !1 === o.apply(a, e) && t.preventDefault();
        if (t.type = p, !r && !t.isDefaultPrevented() && (!s._default || !1 === s._default.apply(f.pop(), e)) && xt.acceptData(n) && i && n[p] && !xt.isWindow(n)) {
          (c = n[i]) && (n[i] = null), xt.event.triggered = p;
          try {
            n[p]()
          } catch (t) {}
          xt.event.triggered = k, c && (n[i] = c)
        }
        return t.result
      }
    },
    dispatch: function (t) {
      t = xt.event.fix(t);
      var e, n, r, o, i, a = [],
        u = Z.call(arguments),
        s = (xt._data(this, "events") || {})[t.type] || [],
        c = xt.event.special[t.type] || {};
      if ((u[0] = t).delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, t)) {
        for (a = xt.event.handlers.call(this, t, s), e = 0;
          (o = a[e++]) && !t.isPropagationStopped();)
          for (t.currentTarget = o.elem, i = 0;
            (r = o.handlers[i++]) && !t.isImmediatePropagationStopped();)(!t.namespace_re || t.namespace_re.test(r.namespace)) && (t.handleObj = r, t.data = r.data, (n = ((xt.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, u)) !== k && !1 === (t.result = n) && (t.preventDefault(), t.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, t), t.result
      }
    },
    handlers: function (t, e) {
      var n, r, o, i, a = [],
        u = e.delegateCount,
        s = t.target;
      if (u && s.nodeType && (!t.button || "click" !== t.type))
        for (; s != this; s = s.parentNode || this)
          if (1 === s.nodeType && (!0 !== s.disabled || "click" !== t.type)) {
            for (o = [], i = 0; i < u; i++) o[n = (r = e[i]).selector + " "] === k && (o[n] = r.needsContext ? 0 <= xt(n, this).index(s) : xt.find(n, this, null, [s]).length), o[n] && o.push(r);
            o.length && a.push({
              elem: s,
              handlers: o
            })
          }
      return e.length > u && a.push({
        elem: this,
        handlers: e.slice(u)
      }), a
    },
    fix: function (t) {
      if (t[xt.expando]) return t;
      var e, n, r, o = t.type,
        i = t,
        a = this.fixHooks[o];
      for (a || (this.fixHooks[o] = a = Lt.test(o) ? this.mouseHooks : jt.test(o) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, t = new xt.Event(i), e = r.length; e--;) t[n = r[e]] = i[n];
      return t.target || (t.target = i.srcElement || z), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, a.filter ? a.filter(t, i) : t
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (t, e) {
        return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function (t, e) {
        var n, r, o, i = e.button,
          a = e.fromElement;
        return null == t.pageX && null != e.clientX && (o = (r = t.target.ownerDocument || z).documentElement, n = r.body, t.pageX = e.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0), t.pageY = e.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)), !t.relatedTarget && a && (t.relatedTarget = a === t.target ? e.toElement : a), t.which || i === k || (t.which = 1 & i ? 1 : 2 & i ? 3 : 4 & i ? 2 : 0), t
      }
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function () {
          if (this !== t() && this.focus) try {
            return this.focus(), !1
          } catch (t) {}
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function () {
          return this === t() && this.blur ? (this.blur(), !1) : k
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function () {
          return xt.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : k
        },
        _default: function (t) {
          return xt.nodeName(t.target, "a")
        }
      },
      beforeunload: {
        postDispatch: function (t) {
          t.result !== k && (t.originalEvent.returnValue = t.result)
        }
      }
    },
    simulate: function (t, e, n, r) {
      var o = xt.extend(new xt.Event, n, {
        type: t,
        isSimulated: !0,
        originalEvent: {}
      });
      r ? xt.event.trigger(o, null, e) : xt.event.dispatch.call(e, o), o.isDefaultPrevented() && n.preventDefault()
    }
  }, xt.removeEvent = z.removeEventListener ? function (t, e, n) {
    t.removeEventListener && t.removeEventListener(e, n, !1)
  } : function (t, e, n) {
    var r = "on" + e;
    t.detachEvent && (typeof t[r] === B && (t[r] = null), t.detachEvent(r, n))
  }, xt.Event = function (t, e) {
    return this instanceof xt.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || !1 === t.returnValue || t.getPreventDefault && t.getPreventDefault() ? o : l) : this.type = t, e && xt.extend(this, e), this.timeStamp = t && t.timeStamp || xt.now(), this[xt.expando] = !0, k) : new xt.Event(t, e)
  }, xt.Event.prototype = {
    isDefaultPrevented: l,
    isPropagationStopped: l,
    isImmediatePropagationStopped: l,
    preventDefault: function () {
      var t = this.originalEvent;
      this.isDefaultPrevented = o, t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
    },
    stopPropagation: function () {
      var t = this.originalEvent;
      this.isPropagationStopped = o, t && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = o, this.stopPropagation()
    }
  }, xt.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function (t, o) {
    xt.event.special[t] = {
      delegateType: o,
      bindType: o,
      handle: function (t) {
        var e, n = t.relatedTarget,
          r = t.handleObj;
        return (!n || n !== this && !xt.contains(this, n)) && (t.type = r.origType, e = r.handler.apply(this, arguments), t.type = o), e
      }
    }
  }), xt.support.submitBubbles || (xt.event.special.submit = {
    setup: function () {
      return !xt.nodeName(this, "form") && (xt.event.add(this, "click._submit keypress._submit", function (t) {
        var e = t.target,
          n = xt.nodeName(e, "input") || xt.nodeName(e, "button") ? e.form : k;
        n && !xt._data(n, "submitBubbles") && (xt.event.add(n, "submit._submit", function (t) {
          t._submit_bubble = !0
        }), xt._data(n, "submitBubbles", !0))
      }), k)
    },
    postDispatch: function (t) {
      t._submit_bubble && (delete t._submit_bubble, this.parentNode && !t.isTrigger && xt.event.simulate("submit", this.parentNode, t, !0))
    },
    teardown: function () {
      return !xt.nodeName(this, "form") && (xt.event.remove(this, "._submit"), k)
    }
  }), xt.support.changeBubbles || (xt.event.special.change = {
    setup: function () {
      return Et.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (xt.event.add(this, "propertychange._change", function (t) {
        "checked" === t.originalEvent.propertyName && (this._just_changed = !0)
      }), xt.event.add(this, "click._change", function (t) {
        this._just_changed && !t.isTrigger && (this._just_changed = !1), xt.event.simulate("change", this, t, !0)
      })), !1) : (xt.event.add(this, "beforeactivate._change", function (t) {
        var e = t.target;
        Et.test(e.nodeName) && !xt._data(e, "changeBubbles") && (xt.event.add(e, "change._change", function (t) {
          !this.parentNode || t.isSimulated || t.isTrigger || xt.event.simulate("change", this.parentNode, t, !0)
        }), xt._data(e, "changeBubbles", !0))
      }), k)
    },
    handle: function (t) {
      var e = t.target;
      return this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type ? t.handleObj.handler.apply(this, arguments) : k
    },
    teardown: function () {
      return xt.event.remove(this, "._change"), !Et.test(this.nodeName)
    }
  }), xt.support.focusinBubbles || xt.each({
    focus: "focusin",
    blur: "focusout"
  }, function (t, e) {
    var n = 0,
      r = function (t) {
        xt.event.simulate(e, t.target, xt.event.fix(t), !0)
      };
    xt.event.special[e] = {
      setup: function () {
        0 == n++ && z.addEventListener(t, r, !0)
      },
      teardown: function () {
        0 == --n && z.removeEventListener(t, r, !0)
      }
    }
  }), xt.fn.extend({
    on: function (t, e, n, r, o) {
      var i, a;
      if ("object" == typeof t) {
        for (i in "string" != typeof e && (n = n || e, e = k), t) this.on(i, e, n, t[i], o);
        return this
      }
      if (null == n && null == r ? (r = e, n = e = k) : null == r && ("string" == typeof e ? (r = n, n = k) : (r = n, n = e, e = k)), !1 === r) r = l;
      else if (!r) return this;
      return 1 === o && (a = r, (r = function (t) {
        return xt().off(t), a.apply(this, arguments)
      }).guid = a.guid || (a.guid = xt.guid++)), this.each(function () {
        xt.event.add(this, t, r, n, e)
      })
    },
    one: function (t, e, n, r) {
      return this.on(t, e, n, r, 1)
    },
    off: function (t, e, n) {
      var r, o;
      if (t && t.preventDefault && t.handleObj) return r = t.handleObj, xt(t.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
      if ("object" == typeof t) {
        for (o in t) this.off(o, e, t[o]);
        return this
      }
      return (!1 === e || "function" == typeof e) && (n = e, e = k), !1 === n && (n = l), this.each(function () {
        xt.event.remove(this, t, n, e)
      })
    },
    trigger: function (t, e) {
      return this.each(function () {
        xt.event.trigger(t, e, this)
      })
    },
    triggerHandler: function (t, e) {
      var n = this[0];
      return n ? xt.event.trigger(t, e, n, !0) : k
    }
  });
  var Mt = /^.[^:#\[\.,]*$/,
    It = /^(?:parents|prev(?:Until|All))/,
    Ft = xt.expr.match.needsContext,
    Ht = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  xt.fn.extend({
    find: function (t) {
      var e, n = [],
        r = this,
        o = r.length;
      if ("string" != typeof t) return this.pushStack(xt(t).filter(function () {
        for (e = 0; e < o; e++)
          if (xt.contains(r[e], this)) return !0
      }));
      for (e = 0; e < o; e++) xt.find(t, r[e], n);
      return (n = this.pushStack(1 < o ? xt.unique(n) : n)).selector = this.selector ? this.selector + " " + t : t, n
    },
    has: function (t) {
      var e, n = xt(t, this),
        r = n.length;
      return this.filter(function () {
        for (e = 0; e < r; e++)
          if (xt.contains(this, n[e])) return !0
      })
    },
    not: function (t) {
      return this.pushStack(i(this, t || [], !0))
    },
    filter: function (t) {
      return this.pushStack(i(this, t || [], !1))
    },
    is: function (t) {
      return !!i(this, "string" == typeof t && Ft.test(t) ? xt(t) : t || [], !1).length
    },
    closest: function (t, e) {
      for (var n, r = 0, o = this.length, i = [], a = Ft.test(t) || "string" != typeof t ? xt(t, e || this.context) : 0; r < o; r++)
        for (n = this[r]; n && n !== e; n = n.parentNode)
          if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && xt.find.matchesSelector(n, t))) {
            n = i.push(n);
            break
          }
      return this.pushStack(1 < i.length ? xt.unique(i) : i)
    },
    index: function (t) {
      return t ? "string" == typeof t ? xt.inArray(this[0], xt(t)) : xt.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function (t, e) {
      var n = "string" == typeof t ? xt(t, e) : xt.makeArray(t && t.nodeType ? [t] : t),
        r = xt.merge(this.get(), n);
      return this.pushStack(xt.unique(r))
    },
    addBack: function (t) {
      return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
    }
  }), xt.each({
    parent: function (t) {
      var e = t.parentNode;
      return e && 11 !== e.nodeType ? e : null
    },
    parents: function (t) {
      return xt.dir(t, "parentNode")
    },
    parentsUntil: function (t, e, n) {
      return xt.dir(t, "parentNode", n)
    },
    next: function (t) {
      return e(t, "nextSibling")
    },
    prev: function (t) {
      return e(t, "previousSibling")
    },
    nextAll: function (t) {
      return xt.dir(t, "nextSibling")
    },
    prevAll: function (t) {
      return xt.dir(t, "previousSibling")
    },
    nextUntil: function (t, e, n) {
      return xt.dir(t, "nextSibling", n)
    },
    prevUntil: function (t, e, n) {
      return xt.dir(t, "previousSibling", n)
    },
    siblings: function (t) {
      return xt.sibling((t.parentNode || {}).firstChild, t)
    },
    children: function (t) {
      return xt.sibling(t.firstChild)
    },
    contents: function (t) {
      return xt.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : xt.merge([], t.childNodes)
    }
  }, function (r, o) {
    xt.fn[r] = function (t, e) {
      var n = xt.map(this, o, t);
      return "Until" !== r.slice(-5) && (e = t), e && "string" == typeof e && (n = xt.filter(e, n)), 1 < this.length && (Ht[r] || (n = xt.unique(n)), It.test(r) && (n = n.reverse())), this.pushStack(n)
    }
  }), xt.extend({
    filter: function (t, e, n) {
      var r = e[0];
      return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === r.nodeType ? xt.find.matchesSelector(r, t) ? [r] : [] : xt.find.matches(t, xt.grep(e, function (t) {
        return 1 === t.nodeType
      }))
    },
    dir: function (t, e, n) {
      for (var r = [], o = t[e]; o && 9 !== o.nodeType && (n === k || 1 !== o.nodeType || !xt(o).is(n));) 1 === o.nodeType && r.push(o), o = o[e];
      return r
    },
    sibling: function (t, e) {
      for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
      return n
    }
  });
  var Rt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    qt = / jQuery\d+="(?:null|\d+)"/g,
    Bt = RegExp("<(?:" + Rt + ")[\\s/>]", "i"),
    Wt = /^\s+/,
    zt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    Jt = /<([\w:]+)/,
    Ut = /<tbody/i,
    Xt = /<|&#?\w+;/,
    Vt = /<(?:script|style|link)/i,
    Gt = /^(?:checkbox|radio)$/i,
    Kt = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Yt = /^$|\/(?:java|ecma)script/i,
    Qt = /^true\/(.*)/,
    Zt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    te = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: xt.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    },
    ee = g(z).appendChild(z.createElement("div"));
  te.optgroup = te.option, te.tbody = te.tfoot = te.colgroup = te.caption = te.thead, te.th = te.td, xt.fn.extend({
    text: function (t) {
      return xt.access(this, function (t) {
        return t === k ? xt.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(t))
      }, null, t, arguments.length)
    },
    append: function () {
      return this.domManip(arguments, function (t) {
        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || a(this, t).appendChild(t)
      })
    },
    prepend: function () {
      return this.domManip(arguments, function (t) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var e = a(this, t);
          e.insertBefore(t, e.firstChild)
        }
      })
    },
    before: function () {
      return this.domManip(arguments, function (t) {
        this.parentNode && this.parentNode.insertBefore(t, this)
      })
    },
    after: function () {
      return this.domManip(arguments, function (t) {
        this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
      })
    },
    remove: function (t, e) {
      for (var n, r = t ? xt.filter(t, this) : this, o = 0; null != (n = r[o]); o++) e || 1 !== n.nodeType || xt.cleanData(b(n)), n.parentNode && (e && xt.contains(n.ownerDocument, n) && y(b(n, "script")), n.parentNode.removeChild(n));
      return this
    },
    empty: function () {
      for (var t, e = 0; null != (t = this[e]); e++) {
        for (1 === t.nodeType && xt.cleanData(b(t, !1)); t.firstChild;) t.removeChild(t.firstChild);
        t.options && xt.nodeName(t, "select") && (t.options.length = 0)
      }
      return this
    },
    clone: function (t, e) {
      return t = null != t && t, e = null == e ? t : e, this.map(function () {
        return xt.clone(this, t, e)
      })
    },
    html: function (t) {
      return xt.access(this, function (t) {
        var e = this[0] || {},
          n = 0,
          r = this.length;
        if (t === k) return 1 === e.nodeType ? e.innerHTML.replace(qt, "") : k;
        if (!("string" != typeof t || Vt.test(t) || !xt.support.htmlSerialize && Bt.test(t) || !xt.support.leadingWhitespace && Wt.test(t) || te[(Jt.exec(t) || ["", ""])[1].toLowerCase()])) {
          t = t.replace(zt, "<$1></$2>");
          try {
            for (; n < r; n++) 1 === (e = this[n] || {}).nodeType && (xt.cleanData(b(e, !1)), e.innerHTML = t);
            e = 0
          } catch (t) {}
        }
        e && this.empty().append(t)
      }, null, t, arguments.length)
    },
    replaceWith: function () {
      var r = xt.map(this, function (t) {
          return [t.nextSibling, t.parentNode]
        }),
        o = 0;
      return this.domManip(arguments, function (t) {
        var e = r[o++],
          n = r[o++];
        n && (e && e.parentNode !== n && (e = this.nextSibling), xt(this).remove(), n.inserasachinafore(t, e))
      }, !0), o ? this : this.remove()
    },
    detach: function (t) {
      return this.remove(t, !0)
    },
    domManip: function (n, r, o) {
      n = Y.apply([], n);
      var t, e, i, a, u, s, c = 0,
        l = this.length,
        f = this,
        p = l - 1,
        d = n[0],
        h = xt.isFunction(d);
      if (h || !(l <= 1 || "string" != typeof d || xt.support.checkClone) && Kt.test(d)) return this.each(function (t) {
        var e = f.eq(t);
        h && (n[0] = d.call(this, t, e.html())), e.domManip(n, r, o)
      });
      if (l && (t = (s = xt.buildFragment(n, this[0].ownerDocument, !1, !o && this)).firstChild, 1 === s.childNodes.length && (s = t), t)) {
        for (i = (a = xt.map(b(s, "script"), m)).length; c < l; c++) e = s, c !== p && (e = xt.clone(e, !0, !0), i && xt.merge(a, b(e, "script"))), r.call(this[c], e, c);
        if (i)
          for (u = a[a.length - 1].ownerDocument, xt.map(a, v), c = 0; c < i; c++) e = a[c], Yt.test(e.type || "") && !xt._data(e, "globalEval") && xt.contains(u, e) && (e.src ? xt._evalUrl(e.src) : xt.globalEval((e.text || e.textContent || e.innerHTML || "").replace(Zt, "")));
        s = t = null
      }
      return this
    }
  }), xt.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (t, a) {
    xt.fn[t] = function (t) {
      for (var e, n = 0, r = [], o = xt(t), i = o.length - 1; n <= i; n++) e = n === i ? this : this.clone(!0), xt(o[n])[a](e), Q.apply(r, e.get());
      return this.pushStack(r)
    }
  }), xt.extend({
    clone: function (t, e, n) {
      var r, o, i, a, u, s = xt.contains(t.ownerDocument, t);
      if (xt.support.html5Clone || xt.isXMLDoc(t) || !Bt.test("<" + t.nodeName + ">") ? i = t.cloneNode(!0) : (ee.innerHTML = t.outerHTML, ee.removeChild(i = ee.firstChild)), !(xt.support.noCloneEvent && xt.support.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || xt.isXMLDoc(t)))
        for (r = b(i), u = b(t), a = 0; null != (o = u[a]); ++a) r[a] && p(o, r[a]);
      if (e)
        if (n)
          for (u = u || b(t), r = r || b(i), a = 0; null != (o = u[a]); a++) f(o, r[a]);
        else f(t, i);
      return 0 < (r = b(i, "script")).length && y(r, !s && b(t, "script")), r = u = o = null, i
    },
    buildFragment: function (t, e, n, r) {
      for (var o, i, a, u, s, c, l, f = t.length, p = g(e), d = [], h = 0; h < f; h++)
        if ((i = t[h]) || 0 === i)
          if ("object" === xt.type(i)) xt.merge(d, i.nodeType ? [i] : i);
          else if (Xt.test(i)) {
        for (u = u || p.appendChild(e.createElement("div")), s = (Jt.exec(i) || ["", ""])[1].toLowerCase(), l = te[s] || te._default, u.innerHTML = l[1] + i.replace(zt, "<$1></$2>") + l[2], o = l[0]; o--;) u = u.lastChild;
        if (!xt.support.leadingWhitespace && Wt.test(i) && d.push(e.createTextNode(Wt.exec(i)[0])), !xt.support.tbody)
          for (o = (i = "table" !== s || Ut.test(i) ? "<table>" !== l[1] || Ut.test(i) ? 0 : u : u.firstChild) && i.childNodes.length; o--;) xt.nodeName(c = i.childNodes[o], "tbody") && !c.childNodes.length && i.removeChild(c);
        for (xt.merge(d, u.childNodes), u.textContent = ""; u.firstChild;) u.removeChild(u.firstChild);
        u = p.lastChild
      } else d.push(e.createTextNode(i));
      for (u && p.removeChild(u), xt.support.appendChecked || xt.grep(b(d, "input"), x), h = 0; i = d[h++];)
        if ((!r || -1 === xt.inArray(i, r)) && (a = xt.contains(i.ownerDocument, i), u = b(p.appendChild(i), "script"), a && y(u), n))
          for (o = 0; i = u[o++];) Yt.test(i.type || "") && n.push(i);
      return u = null, p
    },
    cleanData: function (t, e) {
      for (var n, r, o, i, a = 0, u = xt.expando, s = xt.cache, c = xt.support.deleteExpando, l = xt.event.special; null != (n = t[a]); a++)
        if ((e || xt.acceptData(n)) && (i = (o = n[u]) && s[o])) {
          if (i.events)
            for (r in i.events) l[r] ? xt.event.remove(n, r) : xt.removeEvent(n, r, i.handle);
          s[o] && (delete s[o], c ? delete n[u] : typeof n.removeAttribute !== B ? n.removeAttribute(u) : n[u] = null, G.push(o))
        }
    },
    _evalUrl: function (t) {
      return xt.ajax({
        url: t,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        throws: !0
      })
    }
  }), xt.fn.extend({
    wrapAll: function (e) {
      if (xt.isFunction(e)) return this.each(function (t) {
        xt(this).wrapAll(e.call(this, t))
      });
      if (this[0]) {
        var t = xt(e, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && t.inserasachinafore(this[0]), t.map(function () {
          for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
          return t
        }).append(this)
      }
      return this
    },
    wrapInner: function (n) {
      return this.each(xt.isFunction(n) ? function (t) {
        xt(this).wrapInner(n.call(this, t))
      } : function () {
        var t = xt(this),
          e = t.contents();
        e.length ? e.wrapAll(n) : t.append(n)
      })
    },
    wrap: function (e) {
      var n = xt.isFunction(e);
      return this.each(function (t) {
        xt(this).wrapAll(n ? e.call(this, t) : e)
      })
    },
    unwrap: function () {
      return this.parent().each(function () {
        xt.nodeName(this, "body") || xt(this).replaceWith(this.childNodes)
      }).end()
    }
  });
  var ne, re, oe, ie = /alpha\([^)]*\)/i,
    ae = /opacity\s*=\s*([^)]*)/,
    ue = /^(top|right|bottom|left)$/,
    se = /^(none|table(?!-c[ea]).+)/,
    ce = /^margin/,
    le = RegExp("^(" + ot + ")(.*)$", "i"),
    fe = RegExp("^(" + ot + ")(?!px)[a-z%]+$", "i"),
    pe = RegExp("^([+-])=(" + ot + ")", "i"),
    de = {
      BODY: "block"
    },
    he = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    ge = {
      letterSpacing: 0,
      fontWeight: 400
    },
    me = ["Top", "Right", "Bottom", "Left"],
    ve = ["Webkit", "O", "Moz", "ms"];
  xt.fn.extend({
    css: function (t, e) {
      return xt.access(this, function (t, e, n) {
        var r, o, i = {},
          a = 0;
        if (xt.isArray(e)) {
          for (o = re(t), r = e.length; a < r; a++) i[e[a]] = xt.css(t, e[a], !1, o);
          return i
        }
        return n !== k ? xt.style(t, e, n) : xt.css(t, e)
      }, t, e, 1 < arguments.length)
    },
    show: function () {
      return w(this, !0)
    },
    hide: function () {
      return w(this)
    },
    toggle: function (t) {
      return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function () {
        _(this) ? xt(this).show() : xt(this).hide()
      })
    }
  }), xt.extend({
    cssHooks: {
      opacity: {
        get: function (t, e) {
          if (e) {
            var n = oe(t, "opacity");
            return "" === n ? "1" : n
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      float: xt.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function (t, e, n, r) {
      if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
        var o, i, a, u = xt.camelCase(e),
          s = t.style;
        if (e = xt.cssProps[u] || (xt.cssProps[u] = d(s, u)), a = xt.cssHooks[e] || xt.cssHooks[u], n === k) return a && "get" in a && (o = a.get(t, !1, r)) !== k ? o : s[e];
        if ("string" === (i = typeof n) && (o = pe.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(xt.css(t, e)), i = "number"), !(null == n || "number" === i && isNaN(n) || ("number" !== i || xt.cssNumber[u] || (n += "px"), xt.support.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (s[e] = "inherit"), a && "set" in a && (n = a.set(t, n, r)) === k))) try {
          s[e] = n
        } catch (t) {}
      }
    },
    css: function (t, e, n, r) {
      var o, i, a, u = xt.camelCase(e);
      return e = xt.cssProps[u] || (xt.cssProps[u] = d(t.style, u)), (a = xt.cssHooks[e] || xt.cssHooks[u]) && "get" in a && (i = a.get(t, !0, n)), i === k && (i = oe(t, e, r)), "normal" === i && e in ge && (i = ge[e]), "" === n || n ? (o = parseFloat(i), !0 === n || xt.isNumeric(o) ? o || 0 : i) : i
    }
  }), h.getComputedStyle ? (re = function (t) {
    return h.getComputedStyle(t, null)
  }, oe = function (t, e, n) {
    var r, o, i, a = n || re(t),
      u = a ? a.getPropertyValue(e) || a[e] : k,
      s = t.style;
    return a && ("" !== u || xt.contains(t.ownerDocument, t) || (u = xt.style(t, e)), fe.test(u) && ce.test(e) && (r = s.width, o = s.minWidth, i = s.maxWidth, s.minWidth = s.maxWidth = s.width = u, u = a.width, s.width = r, s.minWidth = o, s.maxWidth = i)), u
  }) : z.documentElement.currentStyle && (re = function (t) {
    return t.currentStyle
  }, oe = function (t, e, n) {
    var r, o, i, a = n || re(t),
      u = a ? a[e] : k,
      s = t.style;
    return null == u && s && s[e] && (u = s[e]), fe.test(u) && !ue.test(e) && (r = s.left, (i = (o = t.runtimeStyle) && o.left) && (o.left = t.currentStyle.left), s.left = "fontSize" === e ? "1em" : u, u = s.pixelLeft + "px", s.left = r, i && (o.left = i)), "" === u ? "auto" : u
  }), xt.each(["height", "width"], function (t, o) {
    xt.cssHooks[o] = {
      get: function (t, e, n) {
        return e ? 0 === t.offsetWidth && se.test(xt.css(t, "display")) ? xt.swap(t, he, function () {
          return A(t, o, n)
        }) : A(t, o, n) : k
      },
      set: function (t, e, n) {
        var r = n && re(t);
        return T(0, e, n ? S(t, o, n, xt.support.boxSizing && "border-box" === xt.css(t, "boxSizing", !1, r), r) : 0)
      }
    }
  }), xt.support.opacity || (xt.cssHooks.opacity = {
    get: function (t, e) {
      return ae.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
    },
    set: function (t, e) {
      var n = t.style,
        r = t.currentStyle,
        o = xt.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
        i = r && r.filter || n.filter || "";
      ((n.zoom = 1) <= e || "" === e) && "" === xt.trim(i.replace(ie, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === e || r && !r.filter) || (n.filter = ie.test(i) ? i.replace(ie, o) : i + " " + o)
    }
  }), xt(function () {
    xt.support.reliableMarginRight || (xt.cssHooks.marginRight = {
      get: function (t, e) {
        return e ? xt.swap(t, {
          display: "inline-block"
        }, oe, [t, "marginRight"]) : k
      }
    }), !xt.support.pixelPosition && xt.fn.position && xt.each(["top", "left"], function (t, n) {
      xt.cssHooks[n] = {
        get: function (t, e) {
          return e ? (e = oe(t, n), fe.test(e) ? xt(t).position()[n] + "px" : e) : k
        }
      }
    })
  }), xt.expr && xt.expr.filters && (xt.expr.filters.hidden = function (t) {
    return t.offsetWidth <= 0 && t.offsetHeight <= 0 || !xt.support.reliableHiddenOffsets && "none" === (t.style && t.style.display || xt.css(t, "display"))
  }, xt.expr.filters.visible = function (t) {
    return !xt.expr.filters.hidden(t)
  }), xt.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (o, i) {
    xt.cssHooks[o + i] = {
      expand: function (t) {
        for (var e = 0, n = {}, r = "string" == typeof t ? t.split(" ") : [t]; e < 4; e++) n[o + me[e] + i] = r[e] || r[e - 2] || r[0];
        return n
      }
    }, ce.test(o) || (xt.cssHooks[o + i].set = T)
  });
  var ye = /%20/g,
    be = /\[\]$/,
    xe = /\r?\n/g,
    _e = /^(?:submit|button|image|reset|file)$/i,
    we = /^(?:input|select|textarea|keygen)/i;
  xt.fn.extend({
    serialize: function () {
      return xt.param(this.serializeArray())
    },
    serializeArray: function () {
      return this.map(function () {
        var t = xt.prop(this, "elements");
        return t ? xt.makeArray(t) : this
      }).filter(function () {
        var t = this.type;
        return this.name && !xt(this).is(":disabled") && we.test(this.nodeName) && !_e.test(t) && (this.checked || !Gt.test(t))
      }).map(function (t, e) {
        var n = xt(this).val();
        return null == n ? null : xt.isArray(n) ? xt.map(n, function (t) {
          return {
            name: e.name,
            value: t.replace(xe, "\r\n")
          }
        }) : {
          name: e.name,
          value: n.replace(xe, "\r\n")
        }
      }).get()
    }
  }), xt.param = function (t, e) {
    var n, r = [],
      o = function (t, e) {
        e = xt.isFunction(e) ? e() : null == e ? "" : e, r[r.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
      };
    if (e === k && (e = xt.ajaxSettings && xt.ajaxSettings.traditional), xt.isArray(t) || t.jquery && !xt.isPlainObject(t)) xt.each(t, function () {
      o(this.name, this.value)
    });
    else
      for (n in t) $(n, t[n], e, o);
    return r.join("&").replace(ye, "+")
  }, xt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (t, n) {
    xt.fn[n] = function (t, e) {
      return 0 < arguments.length ? this.on(n, null, t, e) : this.trigger(n)
    }
  }), xt.fn.extend({
    hover: function (t, e) {
      return this.mouseenter(t).mouseleave(e || t)
    },
    bind: function (t, e, n) {
      return this.on(t, null, e, n)
    },
    unbind: function (t, e) {
      return this.off(t, null, e)
    },
    delegate: function (t, e, n, r) {
      return this.on(e, t, n, r)
    },
    undelegate: function (t, e, n) {
      return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
    }
  });
  var ke, Te, Se = xt.now(),
    Ae = /\?/,
    Ne = /#.*$/,
    Ce = /([?&])_=[^&]*/,
    $e = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    De = /^(?:GET|HEAD)$/,
    Ee = /^\/\//,
    je = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    Le = xt.fn.load,
    Pe = {},
    Oe = {},
    Me = "*/".concat("*");
  try {
    Te = W.href
  } catch (t) {
    (Te = z.createElement("a")).href = "", Te = Te.href
  }
  ke = je.exec(Te.toLowerCase()) || [], xt.fn.load = function (t, e, n) {
    if ("string" != typeof t && Le) return Le.apply(this, arguments);
    var r, o, i, a = this,
      u = t.indexOf(" ");
    return 0 <= u && (r = t.slice(u, t.length), t = t.slice(0, u)), xt.isFunction(e) ? (n = e, e = k) : e && "object" == typeof e && (i = "POST"), 0 < a.length && xt.ajax({
      url: t,
      type: i,
      dataType: "html",
      data: e
    }).done(function (t) {
      o = arguments, a.html(r ? xt("<div>").append(xt.parseHTML(t)).find(r) : t)
    }).complete(n && function (t, e) {
      a.each(n, o || [t.responseText, e, t])
    }), this
  }, xt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (t, e) {
    xt.fn[e] = function (t) {
      return this.on(e, t)
    }
  }), xt.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: Te,
      type: "GET",
      isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ke[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": Me,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": xt.parseJSON,
        "text xml": xt.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function (t, e) {
      return e ? j(j(t, xt.ajaxSettings), e) : j(xt.ajaxSettings, t)
    },
    ajaxPrefilter: D(Pe),
    ajaxTransport: D(Oe),
    ajax: function (t, e) {
      function n(t, e, n, r) {
        var o, i, a, u, s, c = e;
        2 !== _ && (_ = 2, p && clearTimeout(p), h = k, f = r || "", w.readyState = 0 < t ? 4 : 0, o = 200 <= t && t < 300 || 304 === t, n && (u = function (t, e, n) {
          for (var r, o, i, a, u = t.contents, s = t.dataTypes;
            "*" === s[0];) s.shift(), o === k && (o = t.mimeType || e.getResponseHeader("Content-Type"));
          if (o)
            for (a in u)
              if (u[a] && u[a].test(o)) {
                s.unshift(a);
                break
              }
          if (s[0] in n) i = s[0];
          else {
            for (a in n) {
              if (!s[0] || t.converters[a + " " + s[0]]) {
                i = a;
                break
              }
              r || (r = a)
            }
            i = i || r
          }
          return i ? (i !== s[0] && s.unshift(i), n[i]) : k
        }(g, w, n)), u = function (t, e, n, r) {
          var o, i, a, u, s, c = {},
            l = t.dataTypes.slice();
          if (l[1])
            for (a in t.converters) c[a.toLowerCase()] = t.converters[a];
          for (i = l.shift(); i;)
            if (t.responseFields[i] && (n[t.responseFields[i]] = e), !s && r && t.dataFilter && (e = t.dataFilter(e, t.dataType)), s = i, i = l.shift())
              if ("*" === i) i = s;
              else if ("*" !== s && s !== i) {
            if (!(a = c[s + " " + i] || c["* " + i]))
              for (o in c)
                if ((u = o.split(" "))[1] === i && (a = c[s + " " + u[0]] || c["* " + u[0]])) {
                  !0 === a ? a = c[o] : !0 !== c[o] && (i = u[0], l.unshift(u[1]));
                  break
                }
            if (!0 !== a)
              if (a && t.throws) e = a(e);
              else try {
                e = a(e)
              } catch (t) {
                return {
                  state: "parsererror",
                  error: a ? t : "No conversion from " + s + " to " + i
                }
              }
          }
          return {
            state: "success",
            data: e
          }
        }(g, u, w, o), o ? (g.ifModified && ((s = w.getResponseHeader("Last-Modified")) && (xt.lastModified[l] = s), (s = w.getResponseHeader("etag")) && (xt.etag[l] = s)), 204 === t || "HEAD" === g.type ? c = "nocontent" : 304 === t ? c = "notmodified" : (c = u.state, i = u.data, o = !(a = u.error))) : (a = c, (t || !c) && (c = "error", t < 0 && (t = 0))), w.status = t, w.statusText = (e || c) + "", o ? y.resolveWith(m, [i, c, w]) : y.rejectWith(m, [w, c, a]), w.statusCode(x), x = k, d && v.trigger(o ? "ajaxSuccess" : "ajaxError", [w, g, o ? i : a]), b.fireWith(m, [w, c]), d && (v.trigger("ajaxComplete", [w, g]), --xt.active || xt.event.trigger("ajaxStop")))
      }
      "object" == typeof t && (e = t, t = k), e = e || {};
      var r, o, l, f, p, d, h, i, g = xt.ajaxSetup({}, e),
        m = g.context || g,
        v = g.context && (m.nodeType || m.jquery) ? xt(m) : xt.event,
        y = xt.Deferred(),
        b = xt.Callbacks("once memory"),
        x = g.statusCode || {},
        a = {},
        u = {},
        _ = 0,
        s = "canceled",
        w = {
          readyState: 0,
          getResponseHeader: function (t) {
            var e;
            if (2 === _) {
              if (!i)
                for (i = {}; e = $e.exec(f);) i[e[1].toLowerCase()] = e[2];
              e = i[t.toLowerCase()]
            }
            return null == e ? null : e
          },
          getAllResponseHeaders: function () {
            return 2 === _ ? f : null
          },
          setRequestHeader: function (t, e) {
            var n = t.toLowerCase();
            return _ || (t = u[n] = u[n] || t, a[t] = e), this
          },
          overrideMimeType: function (t) {
            return _ || (g.mimeType = t), this
          },
          statusCode: function (t) {
            var e;
            if (t)
              if (_ < 2)
                for (e in t) x[e] = [x[e], t[e]];
              else w.always(t[w.status]);
            return this
          },
          abort: function (t) {
            var e = t || s;
            return h && h.abort(e), n(0, e), this
          }
        };
      if (y.promise(w).complete = b.add, w.success = w.done, w.error = w.fail, g.url = ((t || g.url || Te) + "").replace(Ne, "").replace(Ee, ke[1] + "//"), g.type = e.method || e.type || g.method || g.type, g.dataTypes = xt.trim(g.dataType || "*").toLowerCase().match(it) || [""], null == g.crossDomain && (r = je.exec(g.url.toLowerCase()), g.crossDomain = !(!r || r[1] === ke[1] && r[2] === ke[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (ke[3] || ("http:" === ke[1] ? "80" : "443")))), g.data && g.processData && "string" != typeof g.data && (g.data = xt.param(g.data, g.traditional)), E(Pe, g, e, w), 2 === _) return w;
      for (o in (d = g.global) && 0 == xt.active++ && xt.event.trigger("ajaxStart"), g.type = g.type.toUpperCase(), g.hasContent = !De.test(g.type), l = g.url, g.hasContent || (g.data && (l = g.url += (Ae.test(l) ? "&" : "?") + g.data, delete g.data), !1 === g.cache && (g.url = Ce.test(l) ? l.replace(Ce, "$1_=" + Se++) : l + (Ae.test(l) ? "&" : "?") + "_=" + Se++)), g.ifModified && (xt.lastModified[l] && w.setRequestHeader("If-Modified-Since", xt.lastModified[l]), xt.etag[l] && w.setRequestHeader("If-None-Match", xt.etag[l])), (g.data && g.hasContent && !1 !== g.contentType || e.contentType) && w.setRequestHeader("Content-Type", g.contentType), w.setRequestHeader("Accept", g.dataTypes[0] && g.accepts[g.dataTypes[0]] ? g.accepts[g.dataTypes[0]] + ("*" !== g.dataTypes[0] ? ", " + Me + "; q=0.01" : "") : g.accepts["*"]), g.headers) w.setRequestHeader(o, g.headers[o]);
      if (g.beforeSend && (!1 === g.beforeSend.call(m, w, g) || 2 === _)) return w.abort();
      for (o in s = "abort", {
          success: 1,
          error: 1,
          complete: 1
        }) w[o](g[o]);
      if (h = E(Oe, g, e, w)) {
        w.readyState = 1, d && v.trigger("ajaxSend", [w, g]), g.async && 0 < g.timeout && (p = setTimeout(function () {
          w.abort("timeout")
        }, g.timeout));
        try {
          _ = 1, h.send(a, n)
        } catch (t) {
          if (!(_ < 2)) throw t;
          n(-1, t)
        }
      } else n(-1, "No Transport");
      return w
    },
    getJSON: function (t, e, n) {
      return xt.get(t, e, n, "json")
    },
    getScript: function (t, e) {
      return xt.get(t, k, e, "script")
    }
  }), xt.each(["get", "post"], function (t, o) {
    xt[o] = function (t, e, n, r) {
      return xt.isFunction(e) && (r = r || n, n = e, e = k), xt.ajax({
        url: t,
        type: o,
        dataType: r,
        data: e,
        success: n
      })
    }
  }), xt.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function (t) {
        return xt.globalEval(t), t
      }
    }
  }), xt.ajaxPrefilter("script", function (t) {
    t.cache === k && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
  }), xt.ajaxTransport("script", function (e) {
    if (e.crossDomain) {
      var r, o = z.head || xt("head")[0] || z.documentElement;
      return {
        send: function (t, n) {
          (r = z.createElement("script")).async = !0, e.scriptCharset && (r.charset = e.scriptCharset), r.src = e.url, r.onload = r.onreadystatechange = function (t, e) {
            (e || !r.readyState || /loaded|complete/.test(r.readyState)) && (r.onload = r.onreadystatechange = null, r.parentNode && r.parentNode.removeChild(r), r = null, e || n(200, "success"))
          }, o.inserasachinafore(r, o.firstChild)
        },
        abort: function () {
          r && r.onload(k, !0)
        }
      }
    }
  });
  var Ie = [],
    Fe = /(=)\?(?=&|$)|\?\?/;
  xt.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var t = Ie.pop() || xt.expando + "_" + Se++;
      return this[t] = !0, t
    }
  }), xt.ajaxPrefilter("json jsonp", function (t, e, n) {
    var r, o, i, a = !1 !== t.jsonp && (Fe.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Fe.test(t.data) && "data");
    return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = xt.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Fe, "$1" + r) : !1 !== t.jsonp && (t.url += (Ae.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
      return i || xt.error(r + " was not called"), i[0]
    }, t.dataTypes[0] = "json", o = h[r], h[r] = function () {
      i = arguments
    }, n.always(function () {
      h[r] = o, t[r] && (t.jsonpCallback = e.jsonpCallback, Ie.push(r)), i && xt.isFunction(o) && o(i[0]), i = o = k
    }), "script") : k
  });
  var He, Re, qe = 0,
    Be = h.ActiveXObject && function () {
      var t;
      for (t in He) He[t](k, !0)
    };
  xt.ajaxSettings.xhr = h.ActiveXObject ? function () {
    return !this.isLocal && L() || function () {
      try {
        return new h.ActiveXObject("Microsoft.XMLHTTP")
      } catch (t) {}
    }()
  } : L, Re = xt.ajaxSettings.xhr(), xt.support.cors = !!Re && "withCredentials" in Re, (Re = xt.support.ajax = !!Re) && xt.ajaxTransport(function (c) {
    var l;
    if (!c.crossDomain || xt.support.cors) return {
      send: function (t, a) {
        var u, e, s = c.xhr();
        if (c.username ? s.open(c.type, c.url, c.async, c.username, c.password) : s.open(c.type, c.url, c.async), c.xhrFields)
          for (e in c.xhrFields) s[e] = c.xhrFields[e];
        c.mimeType && s.overrideMimeType && s.overrideMimeType(c.mimeType), c.crossDomain || t["X-Requested-With"] || (t["X-Requested-With"] = "XMLHttpRequest");
        try {
          for (e in t) s.setRequestHeader(e, t[e])
        } catch (t) {}
        s.send(c.hasContent && c.data || null), l = function (t, e) {
          var n, r, o, i;
          try {
            if (l && (e || 4 === s.readyState))
              if (l = k, u && (s.onreadystatechange = xt.noop, Be && delete He[u]), e) 4 !== s.readyState && s.abort();
              else {
                i = {}, n = s.status, r = s.getAllResponseHeaders(), "string" == typeof s.responseText && (i.text = s.responseText);
                try {
                  o = s.statusText
                } catch (t) {
                  o = ""
                }
                n || !c.isLocal || c.crossDomain ? 1223 === n && (n = 204) : n = i.text ? 200 : 404
              }
          } catch (t) {
            e || a(-1, t)
          }
          i && a(n, o, i, r)
        }, c.async ? 4 === s.readyState ? setTimeout(l) : (u = ++qe, Be && (He || (He = {}, xt(h).unload(Be)), He[u] = l), s.onreadystatechange = l) : l()
      },
      abort: function () {
        l && l(k, !0)
      }
    }
  });
  var We, ze, Je = /^(?:toggle|show|hide)$/,
    Ue = RegExp("^(?:([+-])=|)(" + ot + ")([a-z%]*)$", "i"),
    Xe = /queueHooks$/,
    Ve = [function (e, t, n) {
      var r, o, i, a, u, s, c = this,
        l = {},
        f = e.style,
        p = e.nodeType && _(e),
        d = xt._data(e, "fxshow");
      for (r in n.queue || (null == (u = xt._queueHooks(e, "fx")).unqueued && (u.unqueued = 0, s = u.empty.fire, u.empty.fire = function () {
          u.unqueued || s()
        }), u.unqueued++, c.always(function () {
          c.always(function () {
            u.unqueued--, xt.queue(e, "fx").length || u.empty.fire()
          })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], "inline" === xt.css(e, "display") && "none" === xt.css(e, "float") && (xt.support.inlineBlockNeedsLayout && "inline" !== N(e.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", xt.support.shrinkWrapBlocks || c.always(function () {
          f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
        })), t)
        if (o = t[r], Je.exec(o)) {
          if (delete t[r], i = i || "toggle" === o, o === (p ? "hide" : "show")) continue;
          l[r] = d && d[r] || xt.style(e, r)
        }
      if (!xt.isEmptyObject(l))
        for (r in d ? "hidden" in d && (p = d.hidden) : d = xt._data(e, "fxshow", {}), i && (d.hidden = !p), p ? xt(e).show() : c.done(function () {
            xt(e).hide()
          }), c.done(function () {
            var t;
            for (t in xt._removeData(e, "fxshow"), l) xt.style(e, t, l[t])
          }), l) a = O(p ? d[r] : 0, r, c), r in d || (d[r] = a.start, p && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
    }],
    Ge = {
      "*": [function (t, e) {
        var n = this.createTween(t, e),
          r = n.cur(),
          o = Ue.exec(e),
          i = o && o[3] || (xt.cssNumber[t] ? "" : "px"),
          a = (xt.cssNumber[t] || "px" !== i && +r) && Ue.exec(xt.css(n.elem, t)),
          u = 1,
          s = 20;
        if (a && a[3] !== i)
          for (i = i || a[3], o = o || [], a = +r || 1; a /= u = u || ".5", xt.style(n.elem, t, a + i), u !== (u = n.cur() / r) && 1 !== u && --s;);
        return o && (a = n.start = +a || +r || 0, n.unit = i, n.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]), n
      }]
    };
  xt.Animation = xt.extend(M, {
    tweener: function (t, e) {
      xt.isFunction(t) ? (e = t, t = ["*"]) : t = t.split(" ");
      for (var n, r = 0, o = t.length; r < o; r++) n = t[r], Ge[n] = Ge[n] || [], Ge[n].unshift(e)
    },
    prefilter: function (t, e) {
      e ? Ve.unshift(t) : Ve.push(t)
    }
  }), ((xt.Tween = I).prototype = {
    constructor: I,
    init: function (t, e, n, r, o, i) {
      this.elem = t, this.prop = n, this.easing = o || "swing", this.options = e, this.start = this.now = this.cur(), this.end = r, this.unit = i || (xt.cssNumber[n] ? "" : "px")
    },
    cur: function () {
      var t = I.propHooks[this.prop];
      return t && t.get ? t.get(this) : I.propHooks._default.get(this)
    },
    run: function (t) {
      var e, n = I.propHooks[this.prop];
      return this.pos = e = this.options.duration ? xt.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : I.propHooks._default.set(this), this
    }
  }).init.prototype = I.prototype, (I.propHooks = {
    _default: {
      get: function (t) {
        var e;
        return null == t.elem[t.prop] || t.elem.style && null != t.elem.style[t.prop] ? (e = xt.css(t.elem, t.prop, "")) && "auto" !== e ? e : 0 : t.elem[t.prop]
      },
      set: function (t) {
        xt.fx.step[t.prop] ? xt.fx.step[t.prop](t) : t.elem.style && (null != t.elem.style[xt.cssProps[t.prop]] || xt.cssHooks[t.prop]) ? xt.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now
      }
    }
  }).scrollTop = I.propHooks.scrollLeft = {
    set: function (t) {
      t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
    }
  }, xt.each(["toggle", "show", "hide"], function (t, r) {
    var o = xt.fn[r];
    xt.fn[r] = function (t, e, n) {
      return null == t || "boolean" == typeof t ? o.apply(this, arguments) : this.animate(F(r, !0), t, e, n)
    }
  }), xt.fn.extend({
    fadeTo: function (t, e, n, r) {
      return this.filter(_).css("opacity", 0).show().end().animate({
        opacity: e
      }, t, n, r)
    },
    animate: function (e, t, n, r) {
      var o = xt.isEmptyObject(e),
        i = xt.speed(t, n, r),
        a = function () {
          var t = M(this, xt.extend({}, e), i);
          (o || xt._data(this, "finish")) && t.stop(!0)
        };
      return a.finish = a, o || !1 === i.queue ? this.each(a) : this.queue(i.queue, a)
    },
    stop: function (o, t, i) {
      var a = function (t) {
        var e = t.stop;
        delete t.stop, e(i)
      };
      return "string" != typeof o && (i = t, t = o, o = k), t && !1 !== o && this.queue(o || "fx", []), this.each(function () {
        var t = !0,
          e = null != o && o + "queueHooks",
          n = xt.timers,
          r = xt._data(this);
        if (e) r[e] && r[e].stop && a(r[e]);
        else
          for (e in r) r[e] && r[e].stop && Xe.test(e) && a(r[e]);
        for (e = n.length; e--;) n[e].elem !== this || null != o && n[e].queue !== o || (n[e].anim.stop(i), t = !1, n.splice(e, 1));
        (t || !i) && xt.dequeue(this, o)
      })
    },
    finish: function (a) {
      return !1 !== a && (a = a || "fx"), this.each(function () {
        var t, e = xt._data(this),
          n = e[a + "queue"],
          r = e[a + "queueHooks"],
          o = xt.timers,
          i = n ? n.length : 0;
        for (e.finish = !0, xt.queue(this, a, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === a && (o[t].anim.stop(!0), o.splice(t, 1));
        for (t = 0; t < i; t++) n[t] && n[t].finish && n[t].finish.call(this);
        delete e.finish
      })
    }
  }), xt.each({
    slideDown: F("show"),
    slideUp: F("hide"),
    slideToggle: F("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function (t, r) {
    xt.fn[t] = function (t, e, n) {
      return this.animate(r, t, e, n)
    }
  }), xt.speed = function (t, e, n) {
    var r = t && "object" == typeof t ? xt.extend({}, t) : {
      complete: n || !n && e || xt.isFunction(t) && t,
      duration: t,
      easing: n && e || e && !xt.isFunction(e) && e
    };
    return r.duration = xt.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in xt.fx.speeds ? xt.fx.speeds[r.duration] : xt.fx.speeds._default, (null == r.queue || !0 === r.queue) && (r.queue = "fx"), r.old = r.complete, r.complete = function () {
      xt.isFunction(r.old) && r.old.call(this), r.queue && xt.dequeue(this, r.queue)
    }, r
  }, xt.easing = {
    linear: function (t) {
      return t
    },
    swing: function (t) {
      return .5 - Math.cos(t * Math.PI) / 2
    }
  }, xt.timers = [], xt.fx = I.prototype.init, xt.fx.tick = function () {
    var t, e = xt.timers,
      n = 0;
    for (We = xt.now(); e.length > n; n++)(t = e[n])() || e[n] !== t || e.splice(n--, 1);
    e.length || xt.fx.stop(), We = k
  }, xt.fx.timer = function (t) {
    t() && xt.timers.push(t) && xt.fx.start()
  }, xt.fx.interval = 13, xt.fx.start = function () {
    ze || (ze = setInterval(xt.fx.tick, xt.fx.interval))
  }, xt.fx.stop = function () {
    clearInterval(ze), ze = null
  }, xt.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, xt.fx.step = {}, xt.expr && xt.expr.filters && (xt.expr.filters.animated = function (e) {
    return xt.grep(xt.timers, function (t) {
      return e === t.elem
    }).length
  }), xt.fn.offset = function (e) {
    if (arguments.length) return e === k ? this : this.each(function (t) {
      xt.offset.setOffset(this, e, t)
    });
    var t, n, r = {
        top: 0,
        left: 0
      },
      o = this[0],
      i = o && o.ownerDocument;
    return i ? (t = i.documentElement, xt.contains(t, o) ? (typeof o.getBoundingClientRect !== B && (r = o.getBoundingClientRect()), n = H(i), {
      top: r.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
      left: r.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
    }) : r) : void 0
  }, xt.offset = {
    setOffset: function (t, e, n) {
      var r = xt.css(t, "position");
      "static" === r && (t.style.position = "relative");
      var o, i, a = xt(t),
        u = a.offset(),
        s = xt.css(t, "top"),
        c = xt.css(t, "left"),
        l = {},
        f = {};
      ("absolute" === r || "fixed" === r) && -1 < xt.inArray("auto", [s, c]) ? (o = (f = a.position()).top, i = f.left) : (o = parseFloat(s) || 0, i = parseFloat(c) || 0), xt.isFunction(e) && (e = e.call(t, n, u)), null != e.top && (l.top = e.top - u.top + o), null != e.left && (l.left = e.left - u.left + i), "using" in e ? e.using.call(t, l) : a.css(l)
    }
  }, xt.fn.extend({
    position: function () {
      if (this[0]) {
        var t, e, n = {
            top: 0,
            left: 0
          },
          r = this[0];
        return "fixed" === xt.css(r, "position") ? e = r.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), xt.nodeName(t[0], "html") || (n = t.offset()), n.top += xt.css(t[0], "borderTopWidth", !0), n.left += xt.css(t[0], "borderLeftWidth", !0)), {
          top: e.top - n.top - xt.css(r, "marginTop", !0),
          left: e.left - n.left - xt.css(r, "marginLeft", !0)
        }
      }
    },
    offsetParent: function () {
      return this.map(function () {
        for (var t = this.offsetParent || J; t && !xt.nodeName(t, "html") && "static" === xt.css(t, "position");) t = t.offsetParent;
        return t || J
      })
    }
  }), xt.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (e, o) {
    var i = /Y/.test(o);
    xt.fn[e] = function (t) {
      return xt.access(this, function (t, e, n) {
        var r = H(t);
        return n === k ? r ? o in r ? r[o] : r.document.documentElement[e] : t[e] : (r ? r.scrollTo(i ? xt(r).scrollLeft() : n, i ? n : xt(r).scrollTop()) : t[e] = n, k)
      }, e, t, arguments.length, null)
    }
  }), xt.each({
    Height: "height",
    Width: "width"
  }, function (i, a) {
    xt.each({
      padding: "inner" + i,
      content: a,
      "": "outer" + i
    }, function (r, t) {
      xt.fn[t] = function (t, e) {
        var n = arguments.length && (r || "boolean" != typeof t),
          o = r || (!0 === t || !0 === e ? "margin" : "border");
        return xt.access(this, function (t, e, n) {
          var r;
          return xt.isWindow(t) ? t.document.documentElement["client" + i] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + i], r["scroll" + i], t.body["offset" + i], r["offset" + i], r["client" + i])) : n === k ? xt.css(t, e, o) : xt.style(t, e, n, o)
        }, a, n ? t : k, n, null)
      }
    })
  }), xt.fn.size = function () {
    return this.length
  }, xt.fn.andSelf = xt.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = xt : (h.jQuery = h.$ = xt, "function" == typeof define && define.amd && define("jquery", [], function () {
    return xt
  }))
}(window),
function () {
  function go(t, e) {
    if (t !== e) {
      var n = null === t,
        r = t === Lo,
        o = t == t,
        i = null === e,
        a = e === Lo,
        u = e == e;
      if (e < t && !i || !o || n && !a && u || r && u) return 1;
      if (t < e && !n || !u || i && !r && o || a && o) return -1
    }
    return 0
  }

  function mo(t, e, n) {
    for (var r = t.length, o = n ? r : -1; n ? o-- : ++o < r;)
      if (e(t[o], o, t)) return o;
    return -1
  }

  function vo(t, e, n) {
    if (e != e) return No(t, n);
    for (var r = n - 1, o = t.length; ++r < o;)
      if (t[r] === e) return r;
    return -1
  }

  function yo(t) {
    return "function" == typeof t || !1
  }

  function bo(t) {
    return null == t ? "" : t + ""
  }

  function xo(t, e) {
    for (var n = -1, r = t.length; ++n < r && -1 < e.indexOf(t.charAt(n)););
    return n
  }

  function _o(t, e) {
    for (var n = t.length; n-- && -1 < e.indexOf(t.charAt(n)););
    return n
  }

  function wo(t, e) {
    return go(t.criteria, e.criteria) || t.index - e.index
  }

  function ko(t) {
    return a[t]
  }

  function To(t) {
    return u[t]
  }

  function So(t, e, n) {
    return e ? t = l[t] : n && (t = f[t]), "\\" + t
  }

  function Ao(t) {
    return "\\" + f[t]
  }

  function No(t, e, n) {
    for (var r = t.length, o = e + (n ? 0 : -1); n ? o-- : ++o < r;) {
      var i = t[o];
      if (i != i) return o
    }
    return -1
  }

  function Co(t) {
    return !!t && "object" == typeof t
  }

  function r(t) {
    return t <= 160 && 9 <= t && t <= 13 || 32 == t || 160 == t || 5760 == t || 6158 == t || 8192 <= t && (t <= 8202 || 8232 == t || 8233 == t || 8239 == t || 8287 == t || 12288 == t || 65279 == t)
  }

  function $o(t, e) {
    for (var n = -1, r = t.length, o = -1, i = []; ++n < r;) t[n] === e && (t[n] = Qo, i[++o] = n);
    return i
  }

  function Do(t) {
    for (var e = -1, n = t.length; ++e < n && r(t.charCodeAt(e)););
    return e
  }

  function Eo(t) {
    for (var e = t.length; e-- && r(t.charCodeAt(e)););
    return e
  }

  function jo(t) {
    return s[t]
  }
  var Lo, t, e, Po = "3.10.1",
    Oo = 1,
    Mo = 2,
    Io = 4,
    Fo = 8,
    Ho = 16,
    Ro = 32,
    qo = 64,
    Bo = 128,
    Wo = 256,
    zo = 30,
    Jo = "...",
    Uo = 150,
    Xo = 16,
    Vo = 200,
    Go = 1,
    Ko = 2,
    Yo = "Expected a function",
    Qo = "__lodash_placeholder__",
    Zo = "[object Arguments]",
    ti = "[object Array]",
    ei = "[object Boolean]",
    ni = "[object Date]",
    ri = "[object Error]",
    oi = "[object Function]",
    n = "[object Map]",
    ii = "[object Number]",
    ai = "[object Object]",
    ui = "[object RegExp]",
    o = "[object Set]",
    si = "[object String]",
    i = "[object WeakMap]",
    ci = "[object ArrayBuffer]",
    li = "[object Float32Array]",
    fi = "[object Float64Array]",
    pi = "[object Int8Array]",
    di = "[object Int16Array]",
    hi = "[object Int32Array]",
    gi = "[object Uint8Array]",
    mi = "[object Uint8ClampedArray]",
    vi = "[object Uint16Array]",
    yi = "[object Uint32Array]",
    bi = /\b__p \+= '';/g,
    xi = /\b(__p \+=) '' \+/g,
    _i = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
    wi = /&(?:amp|lt|gt|quot|#39|#96);/g,
    ki = /[&<>"'`]/g,
    Ti = RegExp(wi.source),
    Si = RegExp(ki.source),
    Ai = /<%-([\s\S]+?)%>/g,
    Ni = /<%([\s\S]+?)%>/g,
    Ci = /<%=([\s\S]+?)%>/g,
    $i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    Di = /^\w*$/,
    Ei = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
    ji = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
    Li = RegExp(ji.source),
    Pi = /[\u0300-\u036f\ufe20-\ufe23]/g,
    Oi = /\\(\\)?/g,
    Mi = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
    Ii = /\w*$/,
    Fi = /^0[xX]/,
    Hi = /^\[object .+?Constructor\]$/,
    Ri = /^\d+$/,
    qi = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
    Bi = /($^)/,
    Wi = /['\n\r\u2028\u2029\\]/g,
    zi = (t = "[A-Z\\xc0-\\xd6\\xd8-\\xde]", e = "[a-z\\xdf-\\xf6\\xf8-\\xff]+", RegExp(t + "+(?=" + t + e + ")|" + t + "?" + e + "|" + t + "+|[0-9]+", "g")),
    Ji = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"],
    Ui = -1,
    Xi = {};
  Xi[li] = Xi[fi] = Xi[pi] = Xi[di] = Xi[hi] = Xi[gi] = Xi[mi] = Xi[vi] = Xi[yi] = !0, Xi[Zo] = Xi[ti] = Xi[ci] = Xi[ei] = Xi[ni] = Xi[ri] = Xi[oi] = Xi[n] = Xi[ii] = Xi[ai] = Xi[ui] = Xi[o] = Xi[si] = Xi[i] = !1;
  var Vi = {};
  Vi[Zo] = Vi[ti] = Vi[ci] = Vi[ei] = Vi[ni] = Vi[li] = Vi[fi] = Vi[pi] = Vi[di] = Vi[hi] = Vi[ii] = Vi[ai] = Vi[ui] = Vi[si] = Vi[gi] = Vi[mi] = Vi[vi] = Vi[yi] = !0, Vi[ri] = Vi[oi] = Vi[n] = Vi[o] = Vi[i] = !1;
  var a = {
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "Ä": "A",
      "Å": "A",
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "ä": "a",
      "å": "a",
      "Ç": "C",
      "ç": "c",
      "Ð": "D",
      "ð": "d",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "Ñ": "N",
      "ñ": "n",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ö": "O",
      "Ø": "O",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ö": "o",
      "ø": "o",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ü": "U",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ü": "u",
      "Ý": "Y",
      "ý": "y",
      "ÿ": "y",
      "Æ": "Ae",
      "æ": "ae",
      "Þ": "Th",
      "þ": "th",
      "ß": "ss"
    },
    u = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;"
    },
    s = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#96;": "`"
    },
    c = {
      function: !0,
      object: !0
    },
    l = {
      0: "x30",
      1: "x31",
      2: "x32",
      3: "x33",
      4: "x34",
      5: "x35",
      6: "x36",
      7: "x37",
      8: "x38",
      9: "x39",
      A: "x41",
      B: "x42",
      C: "x43",
      D: "x44",
      E: "x45",
      F: "x46",
      a: "x61",
      b: "x62",
      c: "x63",
      d: "x64",
      e: "x65",
      f: "x66",
      n: "x6e",
      r: "x72",
      t: "x74",
      u: "x75",
      v: "x76",
      x: "x78"
    },
    f = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    },
    p = c[typeof exports] && exports && !exports.nodeType && exports,
    d = c[typeof module] && module && !module.nodeType && module,
    h = p && d && "object" == typeof global && global && global.Object && global,
    g = c[typeof self] && self && self.Object && self,
    m = c[typeof window] && window && window.Object && window,
    v = d && d.exports === p && p,
    Gi = h || m !== (this && this.window) && m || g || this,
    Ki = function t(e) {
      function m(t) {
        if (Co(t) && !Fr(t) && !(t instanceof v)) {
          if (t instanceof g) return t;
          if (un.call(t, "__chain__") && un.call(t, "__wrapped__")) return Vt(t)
        }
        return new g(t)
      }

      function i() {}

      function g(t, e, n) {
        this.__wrapped__ = t, this.__actions__ = n || [], this.__chain__ = !!e
      }

      function v(t) {
        this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Pn, this.__views__ = []
      }

      function n() {
        this.__data__ = {}
      }

      function r(t) {
        var e = t ? t.length : 0;
        for (this.data = {
            hash: kn(null),
            set: new vn
          }; e--;) this.push(t[e])
      }

      function d(t, e) {
        var n = t.data;
        return ("string" == typeof e || we(e) ? n.set.has(e) : n.hash[e]) ? 0 : -1
      }

      function $(t, e) {
        var n = -1,
          r = t.length;
        for (e || (e = Ue(r)); ++n < r;) e[n] = t[n];
        return e
      }

      function y(t, e) {
        for (var n = -1, r = t.length; ++n < r && !1 !== e(t[n], n, t););
        return t
      }

      function a(t, e) {
        for (var n = -1, r = t.length; ++n < r;)
          if (!e(t[n], n, t)) return !1;
        return !0
      }

      function o(t, e) {
        for (var n = -1, r = t.length, o = -1, i = []; ++n < r;) {
          var a = t[n];
          e(a, n, t) && (i[++o] = a)
        }
        return i
      }

      function u(t, e) {
        for (var n = -1, r = t.length, o = Ue(r); ++n < r;) o[n] = e(t[n], n, t);
        return o
      }

      function b(t, e) {
        for (var n = -1, r = e.length, o = t.length; ++n < r;) t[o + n] = e[n];
        return t
      }

      function s(t, e, n, r) {
        var o = -1,
          i = t.length;
        for (r && i && (n = t[++o]); ++o < i;) n = e(n, t[o], o, t);
        return n
      }

      function x(t, e) {
        for (var n = -1, r = t.length; ++n < r;)
          if (e(t[n], n, t)) return !0;
        return !1
      }

      function _(t, e, n, r) {
        return t !== Lo && un.call(r, n) ? t : e
      }

      function w(t, e, n) {
        for (var r = -1, o = Gr(e), i = o.length; ++r < i;) {
          var a = o[r],
            u = t[a],
            s = n(u, e[a], a, t, e);
          (s == s ? s === u : u != u) && (u !== Lo || a in t) || (t[a] = s)
        }
        return t
      }

      function k(t, e) {
        return null == e ? t : l(e, Gr(e), t)
      }

      function c(t, e) {
        for (var n = -1, r = null == t, o = !r && Ot(t), i = o ? t.length : 0, a = e.length, u = Ue(a); ++n < a;) {
          var s = e[n];
          u[n] = o ? Mt(s, i) ? t[s] : Lo : r ? Lo : t[s]
        }
        return u
      }

      function l(t, e, n) {
        n || (n = {});
        for (var r = -1, o = e.length; ++r < o;) {
          var i = e[r];
          n[i] = t[i]
        }
        return n
      }

      function f(t, e, n) {
        var r = typeof t;
        return "function" == r ? e === Lo ? t : Z(t, e, n) : null == t ? qe : "object" == r ? F(t) : e === Lo ? Je(t) : H(t, e)
      }

      function T(n, r, o, t, e, i, a) {
        var u;
        if (o && (u = e ? o(n, t, e) : o(n)), u !== Lo) return u;
        if (!we(n)) return n;
        var s, c, l, f, p = Fr(n);
        if (p) {
          if (l = (c = n).length, f = new c.constructor(l), l && "string" == typeof c[0] && un.call(c, "index") && (f.index = c.index, f.input = c.input), u = f, !r) return $(n, u)
        } else {
          var d = cn.call(n),
            h = d == oi;
          if (d != ai && d != Zo && (!h || e)) return Vi[d] ? function (t, e, n) {
            var r = t.constructor;
            switch (e) {
              case ci:
                return tt(t);
              case ei:
              case ni:
                return new r(+t);
              case li:
              case fi:
              case pi:
              case di:
              case hi:
              case gi:
              case mi:
              case vi:
              case yi:
                var o = t.buffer;
                return new r(n ? tt(o) : o, t.byteOffset, t.length);
              case ii:
              case si:
                return new r(t);
              case ui:
                var i = new r(t.source, Ii.exec(t));
                i.lastIndex = t.lastIndex
            }
            return i
          }(n, d, r) : e ? n : {};
          if ("function" == typeof (s = (h ? {} : n).constructor) && s instanceof s || (s = Qe), u = new s, !r) return k(u, n)
        }
        i || (i = []), a || (a = []);
        for (var g = i.length; g--;)
          if (i[g] == n) return a[g];
        return i.push(n), a.push(u), (p ? y : E)(n, function (t, e) {
          u[e] = T(t, r, o, e, n, i, a)
        }), u
      }

      function p(t, e, n) {
        if ("function" != typeof t) throw new en(Yo);
        return yn(function () {
          t.apply(Lo, n)
        }, e)
      }

      function h(t, e) {
        var n = t ? t.length : 0,
          r = [];
        if (!n) return r;
        var o = -1,
          i = Et(),
          a = i === vo,
          u = a && e.length >= Vo ? ut(e) : null,
          s = e.length;
        u && (i = d, a = !1, e = u);
        t: for (; ++o < n;) {
          var c = t[o];
          if (a && c == c) {
            for (var l = s; l--;)
              if (e[l] === c) continue t;
            r.push(c)
          } else i(e, c, 0) < 0 && r.push(c)
        }
        return r
      }

      function S(t, r) {
        var o = !0;
        return Jn(t, function (t, e, n) {
          return o = !!r(t, e, n)
        }), o
      }

      function A(t, r) {
        var o = [];
        return Jn(t, function (t, e, n) {
          r(t, e, n) && o.push(t)
        }), o
      }

      function N(t, r, e, o) {
        var i;
        return e(t, function (t, e, n) {
          return r(t, e, n) ? (i = o ? e : t, !1) : void 0
        }), i
      }

      function C(t, e, n, r) {
        r || (r = []);
        for (var o = -1, i = t.length; ++o < i;) {
          var a = t[o];
          Co(a) && Ot(a) && (n || Fr(a) || ye(a)) ? e ? C(a, e, n, r) : b(r, a) : n || (r[r.length] = a)
        }
        return r
      }

      function D(t, e) {
        return Xn(t, e, Le)
      }

      function E(t, e) {
        return Xn(t, e, Gr)
      }

      function j(t, e) {
        return Vn(t, e, Gr)
      }

      function L(t, e) {
        for (var n = -1, r = e.length, o = -1, i = []; ++n < r;) {
          var a = e[n];
          _e(t[a]) && (i[++o] = a)
        }
        return i
      }

      function P(t, e, n) {
        if (null != t) {
          n !== Lo && n in Ut(t) && (e = [n]);
          for (var r = 0, o = e.length; null != t && r < o;) t = t[e[r++]];
          return r && r == o ? t : Lo
        }
      }

      function O(t, e, n, r, o, i) {
        return t === e || (null == t || null == e || !we(t) && !Co(e) ? t != t && e != e : function (t, e, n, r, o, i, a) {
          var u = Fr(t),
            s = Fr(e),
            c = ti,
            l = ti;
          u || ((c = cn.call(t)) == Zo ? c = ai : c != ai && (u = Ce(t))), s || ((l = cn.call(e)) == Zo ? l = ai : l != ai && (s = Ce(e)));
          var f = c == ai,
            p = l == ai,
            d = c == l;
          if (d && !u && !f) return function (t, e, n) {
            switch (n) {
              case ei:
              case ni:
                return +t == +e;
              case ri:
                return t.name == e.name && t.message == e.message;
              case ii:
                return t != +t ? e != +e : t == +e;
              case ui:
              case si:
                return t == e + ""
            }
            return !1
          }(t, e, c);
          if (!o) {
            var h = f && un.call(t, "__wrapped__"),
              g = p && un.call(e, "__wrapped__");
            if (h || g) return n(h ? t.value() : t, g ? e.value() : e, r, o, i, a)
          }
          if (!d) return !1;
          i || (i = []), a || (a = []);
          for (var m = i.length; m--;)
            if (i[m] == t) return a[m] == e;
          i.push(t), a.push(e);
          var v = (u ? function (t, e, n, r, o, i, a) {
            var u = -1,
              s = t.length,
              c = e.length;
            if (s != c && !(o && s < c)) return !1;
            for (; ++u < s;) {
              var l = t[u],
                f = e[u],
                p = r ? r(o ? f : l, o ? l : f, u) : Lo;
              if (p !== Lo) {
                if (p) continue;
                return !1
              }
              if (o) {
                if (!x(e, function (t) {
                    return l === t || n(l, t, r, o, i, a)
                  })) return !1
              } else if (l !== f && !n(l, f, r, o, i, a)) return !1
            }
            return !0
          } : function (t, e, n, r, o, i, a) {
            var u = Gr(t),
              s = u.length,
              c = Gr(e).length;
            if (s != c && !o) return !1;
            for (var l = s; l--;) {
              var f = u[l];
              if (!(o ? f in e : un.call(e, f))) return !1
            }
            for (var p = o; ++l < s;) {
              f = u[l];
              var d = t[f],
                h = e[f],
                g = r ? r(o ? h : d, o ? d : h, f) : Lo;
              if (!(g === Lo ? n(d, h, r, o, i, a) : g)) return !1;
              p || (p = "constructor" == f)
            }
            if (!p) {
              var m = t.constructor,
                v = e.constructor;
              if (m != v && "constructor" in t && "constructor" in e && !("function" == typeof m && m instanceof m && "function" == typeof v && v instanceof v)) return !1
            }
            return !0
          })(t, e, n, r, o, i, a);
          return i.pop(), a.pop(), v
        }(t, e, O, n, r, o, i))
      }

      function M(t, e, n) {
        var r = e.length,
          o = r,
          i = !n;
        if (null == t) return !o;
        for (t = Ut(t); r--;) {
          var a = e[r];
          if (i && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1
        }
        for (; ++r < o;) {
          var u = (a = e[r])[0],
            s = t[u],
            c = a[1];
          if (i && a[2]) {
            if (s === Lo && !(u in t)) return !1
          } else {
            var l = n ? n(s, c, u) : Lo;
            if (!(l === Lo ? O(c, s, n, !0) : l)) return !1
          }
        }
        return !0
      }

      function I(t, r) {
        var o = -1,
          i = Ot(t) ? Ue(t.length) : [];
        return Jn(t, function (t, e, n) {
          i[++o] = r(t, e, n)
        }), i
      }

      function F(t) {
        var e = jt(t);
        if (1 == e.length && e[0][2]) {
          var n = e[0][0],
            r = e[0][1];
          return function (t) {
            return null != t && t[n] === r && (r !== Lo || n in Ut(t))
          }
        }
        return function (t) {
          return M(t, e)
        }
      }

      function H(n, r) {
        var o = Fr(n),
          i = Ft(n) && qt(r),
          a = n + "";
        return n = Xt(n),
          function (t) {
            if (null == t) return !1;
            var e = a;
            if (t = Ut(t), !(!o && i || e in t)) {
              if (null == (t = 1 == n.length ? t : P(t, W(n, 0, -1)))) return !1;
              e = Zt(n), t = Ut(t)
            }
            return t[e] === r ? r !== Lo || e in t : O(r, t[e], Lo, !0)
          }
      }

      function R(e) {
        return function (t) {
          return null == t ? Lo : t[e]
        }
      }

      function q(t, e) {
        for (var n = t ? e.length : 0; n--;) {
          var r = e[n];
          if (r != o && Mt(r)) {
            var o = r;
            bn.call(t, r, 1)
          }
        }
        return t
      }

      function B(t, e) {
        return t + Tn(jn() * (e - t + 1))
      }

      function W(t, e, n) {
        var r = -1,
          o = t.length;
        (e = null == e ? 0 : +e || 0) < 0 && (e = o < -e ? 0 : o + e), (n = n === Lo || o < n ? o : +n || 0) < 0 && (n += o), o = n < e ? 0 : n - e >>> 0, e >>>= 0;
        for (var i = Ue(o); ++r < o;) i[r] = t[r + e];
        return i
      }

      function z(t, r) {
        var o;
        return Jn(t, function (t, e, n) {
          return !(o = r(t, e, n))
        }), !!o
      }

      function J(t, e) {
        var n = t.length;
        for (t.sort(e); n--;) t[n] = t[n].value;
        return t
      }

      function U(t, n, r) {
        var e = $t(),
          o = -1;
        return n = u(n, function (t) {
          return e(t)
        }), J(I(t, function (e) {
          return {
            criteria: u(n, function (t) {
              return t(e)
            }),
            index: ++o,
            value: e
          }
        }), function (t, e) {
          return function (t, e, n) {
            for (var r = -1, o = t.criteria, i = e.criteria, a = o.length, u = n.length; ++r < a;) {
              var s = go(o[r], i[r]);
              if (s) {
                if (u <= r) return s;
                var c = n[r];
                return s * ("asc" === c || !0 === c ? 1 : -1)
              }
            }
            return t.index - e.index
          }(t, e, r)
        })
      }

      function X(t, e) {
        var n = -1,
          r = Et(),
          o = t.length,
          i = r === vo,
          a = i && Vo <= o,
          u = a ? ut() : null,
          s = [];
        u ? (r = d, i = !1) : (a = !1, u = e ? [] : s);
        t: for (; ++n < o;) {
          var c = t[n],
            l = e ? e(c, n, t) : c;
          if (i && c == c) {
            for (var f = u.length; f--;)
              if (u[f] === l) continue t;
            e && u.push(l), s.push(c)
          } else r(u, l, 0) < 0 && ((e || a) && u.push(l), s.push(c))
        }
        return s
      }

      function V(t, e) {
        for (var n = -1, r = e.length, o = Ue(r); ++n < r;) o[n] = t[e[n]];
        return o
      }

      function G(t, e, n, r) {
        for (var o = t.length, i = r ? o : -1;
          (r ? i-- : ++i < o) && e(t[i], i, t););
        return n ? W(t, r ? 0 : i, r ? i + 1 : o) : W(t, r ? i + 1 : 0, r ? o : i)
      }

      function K(t, e) {
        var n = t;
        n instanceof v && (n = n.value());
        for (var r = -1, o = e.length; ++r < o;) {
          var i = e[r];
          n = i.func.apply(i.thisArg, b([n], i.args))
        }
        return n
      }

      function Y(t, e, n) {
        var r = 0,
          o = t ? t.length : r;
        if ("number" == typeof e && e == e && o <= In) {
          for (; r < o;) {
            var i = r + o >>> 1,
              a = t[i];
            (n ? a <= e : a < e) && null !== a ? r = i + 1 : o = i
          }
          return o
        }
        return Q(t, e, qe, n)
      }

      function Q(t, e, n, r) {
        e = n(e);
        for (var o = 0, i = t ? t.length : 0, a = e != e, u = null === e, s = e === Lo; o < i;) {
          var c = Tn((o + i) / 2),
            l = n(t[c]),
            f = l !== Lo,
            p = l == l;
          if (a) var d = p || r;
          else d = u ? p && f && (r || null != l) : s ? p && (r || f) : null != l && (r ? l <= e : l < e);
          d ? o = c + 1 : i = c
        }
        return $n(i, Mn)
      }

      function Z(i, a, t) {
        if ("function" != typeof i) return qe;
        if (a === Lo) return i;
        switch (t) {
          case 1:
            return function (t) {
              return i.call(a, t)
            };
          case 3:
            return function (t, e, n) {
              return i.call(a, t, e, n)
            };
          case 4:
            return function (t, e, n, r) {
              return i.call(a, t, e, n, r)
            };
          case 5:
            return function (t, e, n, r, o) {
              return i.call(a, t, e, n, r, o)
            }
        }
        return function () {
          return i.apply(a, arguments)
        }
      }

      function tt(t) {
        var e = new pn(t.byteLength);
        return new xn(e).set(new xn(t)), e
      }

      function et(t, e, n) {
        for (var r = n.length, o = -1, i = Cn(t.length - r, 0), a = -1, u = e.length, s = Ue(u + i); ++a < u;) s[a] = e[a];
        for (; ++o < r;) s[n[o]] = t[o];
        for (; i--;) s[a++] = t[o++];
        return s
      }

      function nt(t, e, n) {
        for (var r = -1, o = n.length, i = -1, a = Cn(t.length - o, 0), u = -1, s = e.length, c = Ue(a + s); ++i < a;) c[i] = t[i];
        for (var l = i; ++u < s;) c[l + u] = e[u];
        for (; ++r < o;) c[l + n[r]] = t[i++];
        return c
      }

      function rt(u, s) {
        return function (t, r, e) {
          var o = s ? s() : {};
          if (r = $t(r, e, 3), Fr(t))
            for (var n = -1, i = t.length; ++n < i;) {
              var a = t[n];
              u(o, a, r(a, n, t), t)
            } else Jn(t, function (t, e, n) {
              u(o, t, r(t, e, n), n)
            });
          return o
        }
      }

      function ot(s) {
        return me(function (t, e) {
          var n = -1,
            r = null == t ? 0 : e.length,
            o = 2 < r ? e[r - 2] : Lo,
            i = 2 < r ? e[2] : Lo,
            a = 1 < r ? e[r - 1] : Lo;
          for ("function" == typeof o ? (o = Z(o, a, 5), r -= 2) : r -= (o = "function" == typeof a ? a : Lo) ? 1 : 0, i && It(e[0], e[1], i) && (o = r < 3 ? Lo : o, r = 1); ++n < r;) {
            var u = e[n];
            u && s(t, u, o)
          }
          return t
        })
      }

      function it(i, a) {
        return function (t, e) {
          var n = t ? Yn(t) : 0;
          if (!Rt(n)) return i(t, e);
          for (var r = a ? n : -1, o = Ut(t);
            (a ? r-- : ++r < n) && !1 !== e(o[r], r, o););
          return t
        }
      }

      function at(s) {
        return function (t, e, n) {
          for (var r = Ut(t), o = n(t), i = o.length, a = s ? i : -1; s ? a-- : ++a < i;) {
            var u = o[a];
            if (!1 === e(r[u], u, r)) break
          }
          return t
        }
      }

      function ut(t) {
        return kn && vn ? new r(t) : null
      }

      function st(i) {
        return function (t) {
          for (var e = -1, n = He(Me(t)), r = n.length, o = ""; ++e < r;) o = i(o, n[e], e);
          return o
        }
      }

      function ct(r) {
        return function () {
          var t = arguments;
          switch (t.length) {
            case 0:
              return new r;
            case 1:
              return new r(t[0]);
            case 2:
              return new r(t[0], t[1]);
            case 3:
              return new r(t[0], t[1], t[2]);
            case 4:
              return new r(t[0], t[1], t[2], t[3]);
            case 5:
              return new r(t[0], t[1], t[2], t[3], t[4]);
            case 6:
              return new r(t[0], t[1], t[2], t[3], t[4], t[5]);
            case 7:
              return new r(t[0], t[1], t[2], t[3], t[4], t[5], t[6])
          }
          var e = zn(r.prototype),
            n = r.apply(e, t);
          return we(n) ? n : e
        }
      }

      function lt(i) {
        return function t(e, n, r) {
          r && It(e, n, r) && (n = Lo);
          var o = Ct(e, i, Lo, Lo, Lo, Lo, Lo, n);
          return o.placeholder = t.placeholder, o
        }
      }

      function ft(n, r) {
        return me(function (t) {
          var e = t[0];
          return null == e ? e : (t.push(r), n.apply(Lo, t))
        })
      }

      function pt(c, l) {
        return function (t, e, n) {
          if (n && It(t, e, n) && (e = Lo), 1 == (e = $t(e, n, 3)).length) {
            var r = function (t, e, n, r) {
              for (var o = -1, i = t.length, a = r, u = a; ++o < i;) {
                var s = t[o],
                  c = +e(s);
                n(c, a) && (a = c, u = s)
              }
              return u
            }(t = Fr(t) ? t : Jt(t), e, c, l);
            if (!t.length || r !== l) return r
          }
          return o = e, i = c, s = u = a = l, Jn(t, function (t, e, n) {
            var r = +o(t, e, n);
            (i(r, u) || r === a && r === s) && (u = r, s = t)
          }), s;
          var o, i, a, u, s
        }
      }

      function dt(o, i) {
        return function (t, e, n) {
          if (e = $t(e, n, 3), Fr(t)) {
            var r = mo(t, e, i);
            return -1 < r ? t[r] : Lo
          }
          return N(t, e, o)
        }
      }

      function ht(r) {
        return function (t, e, n) {
          return t && t.length ? mo(t, e = $t(e, n, 3), r) : -1
        }
      }

      function gt(r) {
        return function (t, e, n) {
          return N(t, e = $t(e, n, 3), r, !0)
        }
      }

      function mt(s) {
        return function () {
          for (var o, i = arguments.length, t = s ? i : -1, e = 0, a = Ue(i); s ? t-- : ++t < i;) {
            var n = a[e++] = arguments[t];
            if ("function" != typeof n) throw new en(Yo);
            !o && g.prototype.thru && "wrapper" == Dt(n) && (o = new g([], !0))
          }
          for (t = o ? -1 : i; ++t < i;) {
            var r = Dt(n = a[t]),
              u = "wrapper" == r ? Kn(n) : Lo;
            o = u && Ht(u[0]) && u[1] == (Bo | Fo | Ro | Wo) && !u[4].length && 1 == u[9] ? o[Dt(u[0])].apply(o, u[3]) : 1 == n.length && Ht(n) ? o[r]() : o.thru(n)
          }
          return function () {
            var t = arguments,
              e = t[0];
            if (o && 1 == t.length && Fr(e) && e.length >= Vo) return o.plant(e).value();
            for (var n = 0, r = i ? a[n].apply(this, t) : e; ++n < i;) r = a[n].call(this, r);
            return r
          }
        }
      }

      function vt(r, o) {
        return function (t, e, n) {
          return "function" == typeof e && n === Lo && Fr(t) ? r(t, e) : o(t, Z(e, n, 3))
        }
      }

      function yt(r) {
        return function (t, e, n) {
          return ("function" != typeof e || n !== Lo) && (e = Z(e, n, 3)), r(t, e, Le)
        }
      }

      function bt(r) {
        return function (t, e, n) {
          return ("function" != typeof e || n !== Lo) && (e = Z(e, n, 3)), r(t, e)
        }
      }

      function xt(a) {
        return function (t, o, e) {
          var i = {};
          return o = $t(o, e, 3), E(t, function (t, e, n) {
            var r = o(t, e, n);
            t = a ? t : r, i[e = a ? r : e] = t
          }), i
        }
      }

      function _t(r) {
        return function (t, e, n) {
          return t = bo(t), (r ? t : "") + St(t, e, n) + (r ? "" : t)
        }
      }

      function wt(r) {
        var o = me(function (t, e) {
          var n = $o(e, o.placeholder);
          return Ct(t, r, Lo, e, n)
        });
        return o
      }

      function kt(c, l) {
        return function (t, e, n, r) {
          var o, i, a, u, s = arguments.length < 3;
          return "function" == typeof e && r === Lo && Fr(t) ? c(t, e, n, s) : (o = t, i = $t(e, r, 4), a = n, u = s, l(o, function (t, e, n) {
            a = u ? (u = !1, t) : i(a, t, e, n)
          }), a)
        }
      }

      function Tt(p, d, h, g, m, v, y, b, x, _) {
        var w = d & Bo,
          k = d & Oo,
          T = d & Mo,
          S = d & Fo,
          A = d & Io,
          N = d & Ho,
          C = T ? Lo : ct(p);
        return function t() {
          for (var e = arguments.length, n = e, r = Ue(e); n--;) r[n] = arguments[n];
          if (g && (r = et(r, g, m)), v && (r = nt(r, v, y)), S || N) {
            var o = t.placeholder,
              i = $o(r, o);
            if ((e -= i.length) < _) {
              var a = b ? $(b) : Lo,
                u = Cn(_ - e, 0);
              d |= S ? Ro : qo, d &= ~(S ? qo : Ro), A || (d &= ~(Oo | Mo));
              var s = [p, d, h, S ? r : Lo, S ? i : Lo, S ? Lo : r, S ? Lo : i, a, x, u],
                c = Tt.apply(Lo, s);
              return Ht(p) && Qn(c, s), c.placeholder = o, c
            }
          }
          var l = k ? h : this,
            f = T ? l[p] : p;
          return b && (r = function (t, e) {
            for (var n = t.length, r = $n(e.length, n), o = $(t); r--;) {
              var i = e[r];
              t[r] = Mt(i, n) ? o[i] : Lo
            }
            return t
          }(r, b)), w && x < r.length && (r.length = x), this && this !== Gi && this instanceof t && (f = C || ct(p)), f.apply(l, r)
        }
      }

      function St(t, e, n) {
        var r = t.length;
        if ((e = +e) <= r || !An(e)) return "";
        var o = e - r;
        return Ie(n = null == n ? " " : n + "", wn(o / n.length)).slice(0, o)
      }

      function At(t) {
        var n = Ke[t];
        return function (t, e) {
          return (e = e === Lo ? 0 : +e || 0) ? (e = gn(10, e), n(t * e) / e) : n(t)
        }
      }

      function Nt(i) {
        return function (t, e, n, r) {
          var o = $t(n);
          return null == n && o === f ? Y(t, e, i) : Q(t, e, o(n, r, 1), i)
        }
      }

      function Ct(t, e, n, r, o, i, a, u) {
        var s = e & Mo;
        if (!s && "function" != typeof t) throw new en(Yo);
        var c = r ? r.length : 0;
        if (c || (e &= ~(Ro | qo), r = o = Lo), c -= o ? o.length : 0, e & qo) {
          var l = r,
            f = o;
          r = o = Lo
        }
        var p, d, h, g = s ? Lo : Kn(t),
          m = [t, e, n, r, o, l, f, i, a, u];
        if (g && (function (t, e) {
            var n = t[1],
              r = e[1],
              o = n | r,
              i = o < Bo,
              a = r == Bo && n == Fo || r == Bo && n == Wo && t[7].length <= e[8] || r == (Bo | Wo) && n == Fo;
            if (i || a) {
              r & Oo && (t[2] = e[2], o |= n & Oo ? 0 : Io);
              var u = e[3];
              if (u) {
                var s = t[3];
                t[3] = s ? et(s, u, e[4]) : $(u), t[4] = s ? $o(t[3], Qo) : $(e[4])
              }(u = e[5]) && (s = t[5], t[5] = s ? nt(s, u, e[6]) : $(u), t[6] = s ? $o(t[5], Qo) : $(e[6])), (u = e[7]) && (t[7] = $(u)), r & Bo && (t[8] = null == t[8] ? e[8] : $n(t[8], e[8])), null == t[9] && (t[9] = e[9]), t[0] = e[0], t[1] = o
            }
          }(m, g), e = m[1], u = m[9]), m[9] = null == u ? s ? 0 : t.length : Cn(u - c, 0) || 0, e == Oo) var v = (p = m[0], d = m[2], h = ct(p), function t() {
          return (this && this !== Gi && this instanceof t ? h : p).apply(d, arguments)
        });
        else v = e != Ro && e != (Oo | Ro) || m[4].length ? Tt.apply(Lo, m) : function (a, t, u, s) {
          var c = t & Oo,
            l = ct(a);
          return function t() {
            for (var e = -1, n = arguments.length, r = -1, o = s.length, i = Ue(o + n); ++r < o;) i[r] = s[r];
            for (; n--;) i[r++] = arguments[++e];
            return (this && this !== Gi && this instanceof t ? l : a).apply(c ? u : this, i)
          }
        }.apply(Lo, m);
        return (g ? Gn : Qn)(v, m)
      }

      function $t(t, e, n) {
        var r = m.callback || Re;
        return r = r === Re ? f : r, n ? r(t, e, n) : r
      }

      function Dt(t) {
        for (var e = t.name + "", n = Rn[e], r = n ? n.length : 0; r--;) {
          var o = n[r],
            i = o.func;
          if (null == i || i == t) return o.name
        }
        return e
      }

      function Et(t, e, n) {
        var r = m.indexOf || Qt;
        return r = r === Qt ? vo : r, t ? r(t, e, n) : r
      }

      function jt(t) {
        for (var e = Pe(t), n = e.length; n--;) e[n][2] = qt(e[n][1]);
        return e
      }

      function Lt(t, e) {
        var n = null == t ? Lo : t[e];
        return ke(n) ? n : Lo
      }

      function Pt(t, e, n) {
        null == t || Ft(e, t) || (t = 1 == (e = Xt(e)).length ? t : P(t, W(e, 0, -1)), e = Zt(e));
        var r = null == t ? t : t[e];
        return null == r ? Lo : r.apply(t, n)
      }

      function Ot(t) {
        return null != t && Rt(Yn(t))
      }

      function Mt(t, e) {
        return t = "number" == typeof t || Ri.test(t) ? +t : -1, e = null == e ? Fn : e, -1 < t && t % 1 == 0 && t < e
      }

      function It(t, e, n) {
        if (!we(n)) return !1;
        var r = typeof e;
        if ("number" == r ? Ot(n) && Mt(e, n.length) : "string" == r && e in n) {
          var o = n[e];
          return t == t ? t === o : o != o
        }
        return !1
      }

      function Ft(t, e) {
        var n = typeof t;
        return !!("string" == n && Di.test(t) || "number" == n) || !Fr(t) && (!$i.test(t) || null != e && t in Ut(e))
      }

      function Ht(t) {
        var e = Dt(t),
          n = m[e];
        if ("function" != typeof n || !(e in v.prototype)) return !1;
        if (t === n) return !0;
        var r = Kn(n);
        return !!r && t === r[0]
      }

      function Rt(t) {
        return "number" == typeof t && -1 < t && t % 1 == 0 && t <= Fn
      }

      function qt(t) {
        return t == t && !we(t)
      }

      function Bt(t, e) {
        t = Ut(t);
        for (var n = -1, r = e.length, o = {}; ++n < r;) {
          var i = e[n];
          i in t && (o[i] = t[i])
        }
        return o
      }

      function Wt(t, r) {
        var o = {};
        return D(t, function (t, e, n) {
          r(t, e, n) && (o[e] = t)
        }), o
      }

      function zt(t) {
        for (var e = Le(t), n = e.length, r = n && t.length, o = !!r && Rt(r) && (Fr(t) || ye(t)), i = -1, a = []; ++i < n;) {
          var u = e[i];
          (o && Mt(u, r) || un.call(t, u)) && a.push(u)
        }
        return a
      }

      function Jt(t) {
        return null == t ? [] : Ot(t) ? we(t) ? t : Qe(t) : Oe(t)
      }

      function Ut(t) {
        return we(t) ? t : Qe(t)
      }

      function Xt(t) {
        if (Fr(t)) return t;
        var o = [];
        return bo(t).replace(Ei, function (t, e, n, r) {
          o.push(n ? r.replace(Oi, "$1") : e || t)
        }), o
      }

      function Vt(t) {
        return t instanceof v ? t.clone() : new g(t.__wrapped__, t.__chain__, $(t.__actions__))
      }

      function Gt(t, e, n) {
        return t && t.length ? ((n ? It(t, e, n) : null == e) && (e = 1), W(t, e < 0 ? 0 : e)) : []
      }

      function Kt(t, e, n) {
        var r = t ? t.length : 0;
        return r ? ((n ? It(t, e, n) : null == e) && (e = 1), W(t, 0, (e = r - (+e || 0)) < 0 ? 0 : e)) : []
      }

      function Yt(t) {
        return t ? t[0] : Lo
      }

      function Qt(t, e, n) {
        var r = t ? t.length : 0;
        if (!r) return -1;
        if ("number" == typeof n) n = n < 0 ? Cn(r + n, 0) : n;
        else if (n) {
          var o = Y(t, e);
          return o < r && (e == e ? e === t[o] : t[o] != t[o]) ? o : -1
        }
        return vo(t, e, n || 0)
      }

      function Zt(t) {
        var e = t ? t.length : 0;
        return e ? t[e - 1] : Lo
      }

      function te(t) {
        return Gt(t, 1)
      }

      function ee(t, e, n, r) {
        if (!t || !t.length) return [];
        null != e && "boolean" != typeof e && (n = It(t, e, r = n) ? Lo : e, e = !1);
        var o = $t();
        return (null != n || o !== f) && (n = o(n, r, 3)), e && Et() === vo ? function (t, e) {
          for (var n, r = -1, o = t.length, i = -1, a = []; ++r < o;) {
            var u = t[r],
              s = e ? e(u, r, t) : u;
            r && n === s || (n = s, a[++i] = u)
          }
          return a
        }(t, n) : X(t, n)
      }

      function ne(t) {
        if (!t || !t.length) return [];
        var e = -1,
          n = 0;
        t = o(t, function (t) {
          return Ot(t) ? (n = Cn(t.length, n), !0) : void 0
        });
        for (var r = Ue(n); ++e < n;) r[e] = u(t, R(e));
        return r
      }

      function re(t, e, n) {
        if (!t || !t.length) return [];
        var r = ne(t);
        return null == e ? r : (e = Z(e, n, 4), u(r, function (t) {
          return s(t, e, Lo, !0)
        }))
      }

      function oe(t, e) {
        var n = -1,
          r = t ? t.length : 0,
          o = {};
        for (!r || e || Fr(t[0]) || (e = []); ++n < r;) {
          var i = t[n];
          e ? o[i] = e[n] : i && (o[i[0]] = i[1])
        }
        return o
      }

      function ie(t) {
        var e = m(t);
        return e.__chain__ = !0, e
      }

      function ae(t, e, n) {
        return e.call(n, t)
      }

      function ue(t, e, n) {
        var r = Fr(t) ? a : S;
        return n && It(t, e, n) && (e = Lo), ("function" != typeof e || n !== Lo) && (e = $t(e, n, 3)), r(t, e)
      }

      function se(t, e, n) {
        return (Fr(t) ? o : A)(t, e = $t(e, n, 3))
      }

      function ce(t, e, n, r) {
        var o = t ? Yn(t) : 0;
        return Rt(o) || (o = (t = Oe(t)).length), n = "number" != typeof n || r && It(e, n, r) ? 0 : n < 0 ? Cn(o + n, 0) : n || 0, "string" == typeof t || !Fr(t) && Ne(t) ? n <= o && -1 < t.indexOf(e, n) : !!o && -1 < Et(t, e, n)
      }

      function le(t, e, n) {
        return (Fr(t) ? u : I)(t, e = $t(e, n, 3))
      }

      function fe(t, e, n) {
        if (n ? It(t, e, n) : null == e) return 0 < (r = (t = Jt(t)).length) ? t[B(0, r - 1)] : Lo;
        var r, o = -1,
          i = De(t),
          a = (r = i.length) - 1;
        for (e = $n(e < 0 ? 0 : +e || 0, r); ++o < e;) {
          var u = B(o, a),
            s = i[u];
          i[u] = i[o], i[o] = s
        }
        return i.length = e, i
      }

      function pe(t, e, n) {
        var r = Fr(t) ? x : z;
        return n && It(t, e, n) && (e = Lo), ("function" != typeof e || n !== Lo) && (e = $t(e, n, 3)), r(t, e)
      }

      function de(t, e) {
        var n;
        if ("function" != typeof e) {
          if ("function" != typeof t) throw new en(Yo);
          var r = t;
          t = e, e = r
        }
        return function () {
          return 0 < --t && (n = e.apply(this, arguments)), t <= 1 && (e = Lo), n
        }
      }

      function he(r, o, t) {
        function e(t, e) {
          e && dn(e), s = p = d = Lo, t && (h = Tr(), c = r.apply(f, u), p || s || (u = f = Lo))
        }

        function i() {
          var t = o - (Tr() - l);
          t <= 0 || o < t ? e(d, s) : p = yn(i, t)
        }

        function a() {
          e(m, p)
        }

        function n() {
          if (u = arguments, l = Tr(), f = this, d = m && (p || !v), !1 === g) var t = v && !p;
          else {
            s || v || (h = l);
            var e = g - (l - h),
              n = e <= 0 || g < e;
            n ? (s && (s = dn(s)), h = l, c = r.apply(f, u)) : s || (s = yn(a, e))
          }
          return n && p ? p = dn(p) : p || o === g || (p = yn(i, o)), t && (n = !0, c = r.apply(f, u)), !n || p || s || (u = f = Lo), c
        }
        var u, s, c, l, f, p, d, h = 0,
          g = !1,
          m = !0;
        if ("function" != typeof r) throw new en(Yo);
        if (o = o < 0 ? 0 : +o || 0, !0 === t) {
          var v = !0;
          m = !1
        } else we(t) && (v = !!t.leading, g = "maxWait" in t && Cn(+t.maxWait || 0, o), m = "trailing" in t ? !!t.trailing : m);
        return n.cancel = function () {
          p && dn(p), s && dn(s), h = 0, s = p = d = Lo
        }, n
      }

      function ge(o, i) {
        if ("function" != typeof o || i && "function" != typeof i) throw new en(Yo);
        var a = function () {
          var t = arguments,
            e = i ? i.apply(this, t) : t[0],
            n = a.cache;
          if (n.has(e)) return n.get(e);
          var r = o.apply(this, t);
          return a.cache = n.set(e, r), r
        };
        return a.cache = new ge.Cache, a
      }

      function me(i, a) {
        if ("function" != typeof i) throw new en(Yo);
        return a = Cn(a === Lo ? i.length - 1 : +a || 0, 0),
          function () {
            for (var t = arguments, e = -1, n = Cn(t.length - a, 0), r = Ue(n); ++e < n;) r[e] = t[a + e];
            switch (a) {
              case 0:
                return i.call(this, r);
              case 1:
                return i.call(this, t[0], r);
              case 2:
                return i.call(this, t[0], t[1], r)
            }
            var o = Ue(a + 1);
            for (e = -1; ++e < a;) o[e] = t[e];
            return o[a] = r, i.apply(this, o)
          }
      }

      function ve(t, e) {
        return e < t
      }

      function ye(t) {
        return Co(t) && Ot(t) && un.call(t, "callee") && !mn.call(t, "callee")
      }

      function be(t, e, n, r) {
        var o = (n = "function" == typeof n ? Z(n, r, 3) : Lo) ? n(t, e) : Lo;
        return o === Lo ? O(t, e, n) : !!o
      }

      function xe(t) {
        return Co(t) && "string" == typeof t.message && cn.call(t) == ri
      }

      function _e(t) {
        return we(t) && cn.call(t) == oi
      }

      function we(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
      }

      function ke(t) {
        return null != t && (_e(t) ? fn.test(an.call(t)) : Co(t) && Hi.test(t))
      }

      function Te(t) {
        return "number" == typeof t || Co(t) && cn.call(t) == ii
      }

      function Se(t) {
        var e, n;
        return !(!Co(t) || cn.call(t) != ai || ye(t) || !un.call(t, "constructor") && !("function" != typeof (e = t.constructor) || e instanceof e)) && (D(t, function (t, e) {
          n = e
        }), n === Lo || un.call(t, n))
      }

      function Ae(t) {
        return we(t) && cn.call(t) == ui
      }

      function Ne(t) {
        return "string" == typeof t || Co(t) && cn.call(t) == si
      }

      function Ce(t) {
        return Co(t) && Rt(t.length) && !!Xi[cn.call(t)]
      }

      function $e(t, e) {
        return t < e
      }

      function De(t) {
        var e = t ? Yn(t) : 0;
        return Rt(e) ? e ? $(t) : [] : Oe(t)
      }

      function Ee(t) {
        return l(t, Le(t))
      }

      function je(t) {
        return L(t, Le(t))
      }

      function Le(t) {
        if (null == t) return [];
        we(t) || (t = Qe(t));
        var e = t.length;
        e = e && Rt(e) && (Fr(t) || ye(t)) && e || 0;
        for (var n = t.constructor, r = -1, o = "function" == typeof n && n.prototype === t, i = Ue(e), a = 0 < e; ++r < e;) i[r] = r + "";
        for (var u in t) a && Mt(u, e) || "constructor" == u && (o || !un.call(t, u)) || i.push(u);
        return i
      }

      function Pe(t) {
        t = Ut(t);
        for (var e = -1, n = Gr(t), r = n.length, o = Ue(r); ++e < r;) {
          var i = n[e];
          o[e] = [i, t[i]]
        }
        return o
      }

      function Oe(t) {
        return V(t, Gr(t))
      }

      function Me(t) {
        return (t = bo(t)) && t.replace(qi, ko).replace(Pi, "")
      }

      function Ie(t, e) {
        var n = "";
        if (t = bo(t), (e = +e) < 1 || !t || !An(e)) return n;
        for (; e % 2 && (n += t), t += t, e = Tn(e / 2););
        return n
      }

      function Fe(t, e, n) {
        var r = t;
        return (t = bo(t)) ? (n ? It(r, e, n) : null == e) ? t.slice(Do(t), Eo(t) + 1) : (e += "", t.slice(xo(t, e), _o(t, e) + 1)) : t
      }

      function He(t, e, n) {
        return n && It(t, e, n) && (e = Lo), (t = bo(t)).match(e || zi) || []
      }

      function Re(t, e, n) {
        return n && It(t, e, n) && (e = Lo), Co(t) ? Be(t) : f(t, e)
      }

      function qe(t) {
        return t
      }

      function Be(t) {
        return F(T(t, !0))
      }

      function We(r, t, e) {
        if (null == e) {
          var n = we(t),
            o = n ? Gr(t) : Lo,
            i = o && o.length ? L(t, o) : Lo;
          (i ? i.length : n) || (i = !1, e = t, t = r, r = this)
        }
        i || (i = L(t, Gr(t)));
        var a = !0,
          u = -1,
          s = _e(r),
          c = i.length;
        !1 === e ? a = !1 : we(e) && "chain" in e && (a = e.chain);
        for (; ++u < c;) {
          var l = i[u],
            f = t[l];
          r[l] = f, s && (r.prototype[l] = function (n) {
            return function () {
              var t = this.__chain__;
              if (a || t) {
                var e = r(this.__wrapped__);
                return (e.__actions__ = $(this.__actions__)).push({
                  func: n,
                  args: arguments,
                  thisArg: r
                }), e.__chain__ = t, e
              }
              return n.apply(r, b([this.value()], arguments))
            }
          }(f))
        }
        return r
      }

      function ze() {}

      function Je(t) {
        return Ft(t) ? R(t) : (n = (e = t) + "", e = Xt(e), function (t) {
          return P(t, e, n)
        });
        var e, n
      }
      var Ue = (e = e ? Ki.defaults(Gi.Object(), e, Ki.pick(Gi, Ji)) : Gi).Array,
        Xe = e.Date,
        Ve = e.Error,
        Ge = e.Function,
        Ke = e.Math,
        Ye = e.Number,
        Qe = e.Object,
        Ze = e.RegExp,
        tn = e.String,
        en = e.TypeError,
        nn = Ue.prototype,
        rn = Qe.prototype,
        on = tn.prototype,
        an = Ge.prototype.toString,
        un = rn.hasOwnProperty,
        sn = 0,
        cn = rn.toString,
        ln = Gi._,
        fn = Ze("^" + an.call(un).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        pn = e.ArrayBuffer,
        dn = e.clearTimeout,
        hn = e.parseFloat,
        gn = Ke.pow,
        mn = rn.propertyIsEnumerable,
        vn = Lt(e, "Set"),
        yn = e.setTimeout,
        bn = nn.splice,
        xn = e.Uint8Array,
        _n = Lt(e, "WeakMap"),
        wn = Ke.ceil,
        kn = Lt(Qe, "create"),
        Tn = Ke.floor,
        Sn = Lt(Ue, "isArray"),
        An = e.isFinite,
        Nn = Lt(Qe, "keys"),
        Cn = Ke.max,
        $n = Ke.min,
        Dn = Lt(Xe, "now"),
        En = e.parseInt,
        jn = Ke.random,
        Ln = Ye.NEGATIVE_INFINITY,
        Pn = Ye.POSITIVE_INFINITY,
        On = 4294967295,
        Mn = On - 1,
        In = On >>> 1,
        Fn = 9007199254740991,
        Hn = _n && new _n,
        Rn = {};
      m.support = {}, m.templateSettings = {
        escape: Ai,
        evaluate: Ni,
        interpolate: Ci,
        variable: "",
        imports: {
          _: m
        }
      };
      var qn, Bn, Wn, zn = function () {
          function n() {}
          return function (t) {
            if (we(t)) {
              n.prototype = t;
              var e = new n;
              n.prototype = Lo
            }
            return e || {}
          }
        }(),
        Jn = it(E),
        Un = it(j, !0),
        Xn = at(),
        Vn = at(!0),
        Gn = Hn ? function (t, e) {
          return Hn.set(t, e), t
        } : qe,
        Kn = Hn ? function (t) {
          return Hn.get(t)
        } : ze,
        Yn = R("length"),
        Qn = (Bn = qn = 0, function (t, e) {
          var n = Tr(),
            r = Xo - (n - Bn);
          if (Bn = n, 0 < r) {
            if (++qn >= Uo) return t
          } else qn = 0;
          return Gn(t, e)
        }),
        Zn = me(function (t, e) {
          return Co(t) && Ot(t) ? h(t, C(e, !1, !0)) : []
        }),
        tr = ht(),
        er = ht(!0),
        nr = me(function (t) {
          for (var e = t.length, n = e, r = Ue(l), o = Et(), i = o === vo, a = []; n--;) {
            var u = t[n] = Ot(u = t[n]) ? u : [];
            r[n] = i && 120 <= u.length ? ut(n && u) : null
          }
          var s = t[0],
            c = -1,
            l = s ? s.length : 0,
            f = r[0];
          t: for (; ++c < l;)
            if (u = s[c], (f ? d(f, u) : o(a, u, 0)) < 0) {
              for (n = e; --n;) {
                var p = r[n];
                if ((p ? d(p, u) : o(t[n], u, 0)) < 0) continue t
              }
              f && f.push(u), a.push(u)
            }
          return a
        }),
        rr = me(function (t, e) {
          var n = c(t, e = C(e));
          return q(t, e.sort(go)), n
        }),
        or = Nt(),
        ir = Nt(!0),
        ar = me(function (t) {
          return X(C(t, !1, !0))
        }),
        ur = me(function (t, e) {
          return Ot(t) ? h(t, e) : []
        }),
        sr = me(ne),
        cr = me(function (t) {
          var e = t.length,
            n = 2 < e ? t[e - 2] : Lo,
            r = 1 < e ? t[e - 1] : Lo;
          return 2 < e && "function" == typeof n ? e -= 2 : (n = 1 < e && "function" == typeof r ? (--e, r) : Lo, r = Lo), t.length = e, re(t, n, r)
        }),
        lr = me(function (e) {
          return e = C(e), this.thru(function (t) {
            return function (t, e) {
              for (var n = -1, r = t.length, o = -1, i = e.length, a = Ue(r + i); ++n < r;) a[n] = t[n];
              for (; ++o < i;) a[n++] = e[o];
              return a
            }(Fr(t) ? t : [Ut(t)], e)
          })
        }),
        fr = me(function (t, e) {
          return c(t, C(e))
        }),
        pr = rt(function (t, e, n) {
          un.call(t, n) ? ++t[n] : t[n] = 1
        }),
        dr = dt(Jn),
        hr = dt(Un, !0),
        gr = vt(y, Jn),
        mr = vt(function (t, e) {
          for (var n = t.length; n-- && !1 !== e(t[n], n, t););
          return t
        }, Un),
        vr = rt(function (t, e, n) {
          un.call(t, n) ? t[n].push(e) : t[n] = [e]
        }),
        yr = rt(function (t, e, n) {
          t[n] = e
        }),
        br = me(function (t, n, r) {
          var o = -1,
            i = "function" == typeof n,
            a = Ft(n),
            u = Ot(t) ? Ue(t.length) : [];
          return Jn(t, function (t) {
            var e = i ? n : a && null != t ? t[n] : Lo;
            u[++o] = e ? e.apply(t, r) : Pt(t, n, r)
          }), u
        }),
        xr = rt(function (t, e, n) {
          t[n ? 0 : 1].push(e)
        }, function () {
          return [
            [],
            []
          ]
        }),
        _r = kt(s, Jn),
        wr = kt(function (t, e, n, r) {
          var o = t.length;
          for (r && o && (n = t[--o]); o--;) n = e(n, t[o], o, t);
          return n
        }, Un),
        kr = me(function (t, e) {
          if (null == t) return [];
          var n = e[2];
          return n && It(e[0], e[1], n) && (e.length = 1), U(t, C(e), [])
        }),
        Tr = Dn || function () {
          return (new Xe).getTime()
        },
        Sr = me(function (t, e, n) {
          var r = Oo;
          if (n.length) {
            var o = $o(n, Sr.placeholder);
            r |= Ro
          }
          return Ct(t, r, e, n, o)
        }),
        Ar = me(function (t, e) {
          for (var n = -1, r = (e = e.length ? C(e) : je(t)).length; ++n < r;) {
            var o = e[n];
            t[o] = Ct(t[o], Oo, t)
          }
          return t
        }),
        Nr = me(function (t, e, n) {
          var r = Oo | Mo;
          if (n.length) {
            var o = $o(n, Nr.placeholder);
            r |= Ro
          }
          return Ct(e, r, t, n, o)
        }),
        Cr = lt(Fo),
        $r = lt(Ho),
        Dr = me(function (t, e) {
          return p(t, 1, e)
        }),
        Er = me(function (t, e, n) {
          return p(t, e, n)
        }),
        jr = mt(),
        Lr = mt(!0),
        Pr = me(function (n, r) {
          if (r = C(r), "function" != typeof n || !a(r, yo)) throw new en(Yo);
          var o = r.length;
          return me(function (t) {
            for (var e = $n(t.length, o); e--;) t[e] = r[e](t[e]);
            return n.apply(this, t)
          })
        }),
        Or = wt(Ro),
        Mr = wt(qo),
        Ir = me(function (t, e) {
          return Ct(t, Wo, Lo, Lo, Lo, C(e))
        }),
        Fr = Sn || function (t) {
          return Co(t) && Rt(t.length) && cn.call(t) == ti
        },
        Hr = ot(function i(a, u, s, c, l) {
          if (!we(a)) return a;
          var f = Ot(u) && (Fr(u) || Ce(u)),
            p = f ? Lo : Gr(u);
          return y(p || u, function (t, e) {
            if (p && (t = u[e = t]), Co(t)) c || (c = []), l || (l = []),
              function (t, e, n, r, o, i, a) {
                for (var u = i.length, s = e[n]; u--;)
                  if (i[u] == s) return t[n] = a[u];
                var c = t[n],
                  l = o ? o(c, s, n, t, e) : Lo,
                  f = l === Lo;
                f && (Ot(l = s) && (Fr(s) || Ce(s)) ? l = Fr(c) ? c : Ot(c) ? $(c) : [] : Se(s) || ye(s) ? l = ye(c) ? Ee(c) : Se(c) ? c : {} : f = !1), i.push(s), a.push(l), f ? t[n] = r(l, s, o, i, a) : (l == l ? l !== c : c == c) && (t[n] = l)
              }(a, u, e, i, s, c, l);
            else {
              var n = a[e],
                r = s ? s(n, t, e, a, u) : Lo,
                o = r === Lo;
              o && (r = t), r === Lo && (!f || e in a) || !o && (r == r ? r === n : n != n) || (a[e] = r)
            }
          }), a
        }),
        Rr = ot(function (t, e, n) {
          return n ? w(t, e, n) : k(t, e)
        }),
        qr = ft(Rr, function (t, e) {
          return t === Lo ? e : t
        }),
        Br = ft(Hr, function t(e, n) {
          return e === Lo ? n : Hr(e, n, t)
        }),
        Wr = gt(E),
        zr = gt(j),
        Jr = yt(Xn),
        Ur = yt(Vn),
        Xr = bt(E),
        Vr = bt(j),
        Gr = Nn ? function (t) {
          var e = null == t ? Lo : t.constructor;
          return "function" == typeof e && e.prototype === t || "function" != typeof t && Ot(t) ? zt(t) : we(t) ? Nn(t) : []
        } : zt,
        Kr = xt(!0),
        Yr = xt(),
        Qr = me(function (t, e) {
          if (null == t) return {};
          if ("function" != typeof e[0]) return e = u(C(e), tn), Bt(t, h(Le(t), e));
          var r = Z(e[0], e[1], 3);
          return Wt(t, function (t, e, n) {
            return !r(t, e, n)
          })
        }),
        Zr = me(function (t, e) {
          return null == t ? {} : "function" == typeof e[0] ? Wt(t, Z(e[0], e[1], 3)) : Bt(t, C(e))
        }),
        to = st(function (t, e, n) {
          return e = e.toLowerCase(), t + (n ? e.charAt(0).toUpperCase() + e.slice(1) : e)
        }),
        eo = st(function (t, e, n) {
          return t + (n ? "-" : "") + e.toLowerCase()
        }),
        no = _t(),
        ro = _t(!0),
        oo = st(function (t, e, n) {
          return t + (n ? "_" : "") + e.toLowerCase()
        }),
        io = st(function (t, e, n) {
          return t + (n ? " " : "") + (e.charAt(0).toUpperCase() + e.slice(1))
        }),
        ao = me(function (t, e) {
          try {
            return t.apply(Lo, e)
          } catch (t) {
            return xe(t) ? t : new Ve(t)
          }
        }),
        uo = me(function (e, n) {
          return function (t) {
            return Pt(t, e, n)
          }
        }),
        so = me(function (e, n) {
          return function (t) {
            return Pt(e, t, n)
          }
        }),
        co = At("ceil"),
        lo = At("floor"),
        fo = pt(ve, Ln),
        po = pt($e, Pn),
        ho = At("round");
      return m.prototype = i.prototype, (g.prototype = zn(i.prototype)).constructor = g, (v.prototype = zn(i.prototype)).constructor = v, n.prototype.delete = function (t) {
        return this.has(t) && delete this.__data__[t]
      }, n.prototype.get = function (t) {
        return "__proto__" == t ? Lo : this.__data__[t]
      }, n.prototype.has = function (t) {
        return "__proto__" != t && un.call(this.__data__, t)
      }, n.prototype.set = function (t, e) {
        return "__proto__" != t && (this.__data__[t] = e), this
      }, r.prototype.push = function (t) {
        var e = this.data;
        "string" == typeof t || we(t) ? e.set.add(t) : e.hash[t] = !0
      }, ge.Cache = n, m.after = function (t, e) {
        if ("function" != typeof e) {
          if ("function" != typeof t) throw new en(Yo);
          var n = t;
          t = e, e = n
        }
        return t = An(t = +t) ? t : 0,
          function () {
            return --t < 1 ? e.apply(this, arguments) : void 0
          }
      }, m.ary = function (t, e, n) {
        return n && It(t, e, n) && (e = Lo), e = t && null == e ? t.length : Cn(+e || 0, 0), Ct(t, Bo, Lo, Lo, Lo, Lo, e)
      }, m.assign = Rr, m.at = fr, m.before = de, m.bind = Sr, m.bindAll = Ar, m.bindKey = Nr, m.callback = Re, m.chain = ie, m.chunk = function (t, e, n) {
        e = (n ? It(t, e, n) : null == e) ? 1 : Cn(Tn(e) || 1, 1);
        for (var r = 0, o = t ? t.length : 0, i = -1, a = Ue(wn(o / e)); r < o;) a[++i] = W(t, r, r += e);
        return a
      }, m.compact = function (t) {
        for (var e = -1, n = t ? t.length : 0, r = -1, o = []; ++e < n;) {
          var i = t[e];
          i && (o[++r] = i)
        }
        return o
      }, m.constant = function (t) {
        return function () {
          return t
        }
      }, m.countBy = pr, m.create = function (t, e, n) {
        var r = zn(t);
        return n && It(t, e, n) && (e = Lo), e ? k(r, e) : r
      }, m.curry = Cr, m.curryRight = $r, m.debounce = he, m.defaults = qr, m.defaultsDeep = Br, m.defer = Dr, m.delay = Er, m.difference = Zn, m.drop = Gt, m.dropRight = Kt, m.dropRightWhile = function (t, e, n) {
        return t && t.length ? G(t, $t(e, n, 3), !0, !0) : []
      }, m.dropWhile = function (t, e, n) {
        return t && t.length ? G(t, $t(e, n, 3), !0) : []
      }, m.fill = function (t, e, n, r) {
        var o = t ? t.length : 0;
        return o ? (n && "number" != typeof n && It(t, e, n) && (n = 0, r = o), function (t, e, n, r) {
          var o = t.length;
          for ((n = null == n ? 0 : +n || 0) < 0 && (n = o < -n ? 0 : o + n), (r = r === Lo || o < r ? o : +r || 0) < 0 && (r += o), o = r < n ? 0 : r >>> 0, n >>>= 0; n < o;) t[n++] = e;
          return t
        }(t, e, n, r)) : []
      }, m.filter = se, m.flatten = function (t, e, n) {
        var r = t ? t.length : 0;
        return n && It(t, e, n) && (e = !1), r ? C(t, e) : []
      }, m.flattenDeep = function (t) {
        return t && t.length ? C(t, !0) : []
      }, m.flow = jr, m.flowRight = Lr, m.forEach = gr, m.forEachRight = mr, m.forIn = Jr, m.forInRight = Ur, m.forOwn = Xr, m.forOwnRight = Vr, m.functions = je, m.groupBy = vr, m.indexBy = yr, m.initial = function (t) {
        return Kt(t, 1)
      }, m.intersection = nr, m.invert = function (t, e, n) {
        n && It(t, e, n) && (e = Lo);
        for (var r = -1, o = Gr(t), i = o.length, a = {}; ++r < i;) {
          var u = o[r],
            s = t[u];
          e ? un.call(a, s) ? a[s].push(u) : a[s] = [u] : a[s] = u
        }
        return a
      }, m.invoke = br, m.keys = Gr, m.keysIn = Le, m.map = le, m.mapKeys = Kr, m.mapValues = Yr, m.matches = Be, m.matchesProperty = function (t, e) {
        return H(t, T(e, !0))
      }, m.memoize = ge, m.merge = Hr, m.method = uo, m.methodOf = so, m.mixin = We, m.modArgs = Pr, m.negate = function (t) {
        if ("function" != typeof t) throw new en(Yo);
        return function () {
          return !t.apply(this, arguments)
        }
      }, m.omit = Qr, m.once = function (t) {
        return de(2, t)
      }, m.pairs = Pe, m.partial = Or, m.partialRight = Mr, m.partition = xr, m.pick = Zr, m.pluck = function (t, e) {
        return le(t, Je(e))
      }, m.property = Je, m.propertyOf = function (e) {
        return function (t) {
          return P(e, Xt(t), t + "")
        }
      }, m.pull = function () {
        var t = arguments,
          e = t[0];
        if (!e || !e.length) return e;
        for (var n = 0, r = Et(), o = t.length; ++n < o;)
          for (var i = 0, a = t[n]; - 1 < (i = r(e, a, i));) bn.call(e, i, 1);
        return e
      }, m.pullAt = rr, m.range = function (t, e, n) {
        n && It(t, e, n) && (e = n = Lo), t = +t || 0, null == e ? (e = t, t = 0) : e = +e || 0;
        for (var r = -1, o = Cn(wn((e - t) / ((n = null == n ? 1 : +n || 0) || 1)), 0), i = Ue(o); ++r < o;) i[r] = t, t += n;
        return i
      }, m.rearg = Ir, m.reject = function (t, r, e) {
        var n = Fr(t) ? o : A;
        return r = $t(r, e, 3), n(t, function (t, e, n) {
          return !r(t, e, n)
        })
      }, m.remove = function (t, e, n) {
        var r = [];
        if (!t || !t.length) return r;
        var o = -1,
          i = [],
          a = t.length;
        for (e = $t(e, n, 3); ++o < a;) {
          var u = t[o];
          e(u, o, t) && (r.push(u), i.push(o))
        }
        return q(t, i), r
      }, m.rest = te, m.restParam = me, m.set = function (t, e, n) {
        if (null == t) return t;
        for (var r = e + "", o = -1, i = (e = null != t[r] || Ft(e, t) ? [r] : Xt(e)).length, a = i - 1, u = t; null != u && ++o < i;) {
          var s = e[o];
          we(u) && (o == a ? u[s] = n : null == u[s] && (u[s] = Mt(e[o + 1]) ? [] : {})), u = u[s]
        }
        return t
      }, m.shuffle = function (t) {
        return fe(t, Pn)
      }, m.slice = function (t, e, n) {
        var r = t ? t.length : 0;
        return r ? (n && "number" != typeof n && It(t, e, n) && (e = 0, n = r), W(t, e, n)) : []
      }, m.sortBy = function (t, r, e) {
        if (null == t) return [];
        e && It(t, r, e) && (r = Lo);
        var o = -1;
        return r = $t(r, e, 3), J(I(t, function (t, e, n) {
          return {
            criteria: r(t, e, n),
            index: ++o,
            value: t
          }
        }), wo)
      }, m.sortByAll = kr, m.sortByOrder = function (t, e, n, r) {
        return null == t ? [] : (r && It(e, n, r) && (n = Lo), Fr(e) || (e = null == e ? [] : [e]), Fr(n) || (n = null == n ? [] : [n]), U(t, e, n))
      }, m.spread = function (e) {
        if ("function" != typeof e) throw new en(Yo);
        return function (t) {
          return e.apply(this, t)
        }
      }, m.take = function (t, e, n) {
        return t && t.length ? ((n ? It(t, e, n) : null == e) && (e = 1), W(t, 0, e < 0 ? 0 : e)) : []
      }, m.takeRight = function (t, e, n) {
        var r = t ? t.length : 0;
        return r ? ((n ? It(t, e, n) : null == e) && (e = 1), W(t, (e = r - (+e || 0)) < 0 ? 0 : e)) : []
      }, m.takeRightWhile = function (t, e, n) {
        return t && t.length ? G(t, $t(e, n, 3), !1, !0) : []
      }, m.takeWhile = function (t, e, n) {
        return t && t.length ? G(t, $t(e, n, 3)) : []
      }, m.tap = function (t, e, n) {
        return e.call(n, t), t
      }, m.throttle = function (t, e, n) {
        var r = !0,
          o = !0;
        if ("function" != typeof t) throw new en(Yo);
        return !1 === n ? r = !1 : we(n) && (r = "leading" in n ? !!n.leading : r, o = "trailing" in n ? !!n.trailing : o), he(t, e, {
          leading: r,
          maxWait: +e,
          trailing: o
        })
      }, m.thru = ae, m.times = function (t, e, n) {
        if ((t = Tn(t)) < 1 || !An(t)) return [];
        var r = -1,
          o = Ue($n(t, On));
        for (e = Z(e, n, 1); ++r < t;) r < On ? o[r] = e(r) : e(r);
        return o
      }, m.toArray = De, m.toPlainObject = Ee, m.transform = function (t, r, o, e) {
        var n = Fr(t) || Ce(t);
        if (r = $t(r, e, 4), null == o)
          if (n || we(t)) {
            var i = t.constructor;
            o = n ? Fr(t) ? new i : [] : zn(_e(i) ? i.prototype : Lo)
          } else o = {};
        return (n ? y : E)(t, function (t, e, n) {
          return r(o, t, e, n)
        }), o
      }, m.union = ar, m.uniq = ee, m.unzip = ne, m.unzipWith = re, m.values = Oe, m.valuesIn = function (t) {
        return V(t, Le(t))
      }, m.where = function (t, e) {
        return se(t, F(e))
      }, m.without = ur, m.wrap = function (t, e) {
        return Ct(e = null == e ? qe : e, Ro, Lo, [t], [])
      }, m.xor = function () {
        for (var t = -1, e = arguments.length; ++t < e;) {
          var n = arguments[t];
          if (Ot(n)) var r = r ? b(h(r, n), h(n, r)) : n
        }
        return r ? X(r) : []
      }, m.zip = sr, m.zipObject = oe, m.zipWith = cr, m.backflow = Lr, m.collect = le, m.compose = Lr, m.each = gr, m.eachRight = mr, m.extend = Rr, m.iteratee = Re, m.methods = je, m.object = oe, m.select = se, m.tail = te, m.unique = ee, We(m, m), m.add = function (t, e) {
        return (+t || 0) + (+e || 0)
      }, m.attempt = ao, m.camelCase = to, m.capitalize = function (t) {
        return (t = bo(t)) && t.charAt(0).toUpperCase() + t.slice(1)
      }, m.ceil = co, m.clone = function (t, e, n, r) {
        return e && "boolean" != typeof e && It(t, e, n) ? e = !1 : "function" == typeof e && (r = n, n = e, e = !1), "function" == typeof n ? T(t, e, Z(n, r, 3)) : T(t, e)
      }, m.cloneDeep = function (t, e, n) {
        return "function" == typeof e ? T(t, !0, Z(e, n, 3)) : T(t, !0)
      }, m.deburr = Me, m.endsWith = function (t, e, n) {
        e += "";
        var r = (t = bo(t)).length;
        return n = n === Lo ? r : $n(n < 0 ? 0 : +n || 0, r), 0 <= (n -= e.length) && t.indexOf(e, n) == n
      }, m.escape = function (t) {
        return (t = bo(t)) && Si.test(t) ? t.replace(ki, To) : t
      }, m.escapeRegExp = function (t) {
        return (t = bo(t)) && Li.test(t) ? t.replace(ji, So) : t || "(?:)"
      }, m.every = ue, m.find = dr, m.findIndex = tr, m.findKey = Wr, m.findLast = hr, m.findLastIndex = er, m.findLastKey = zr, m.findWhere = function (t, e) {
        return dr(t, F(e))
      }, m.first = Yt, m.floor = lo, m.get = function (t, e, n) {
        var r = null == t ? Lo : P(t, Xt(e), e + "");
        return r === Lo ? n : r
      }, m.gt = ve, m.gte = function (t, e) {
        return e <= t
      }, m.has = function (t, e) {
        if (null == t) return !1;
        var n = un.call(t, e);
        if (!n && !Ft(e)) {
          if (null == (t = 1 == (e = Xt(e)).length ? t : P(t, W(e, 0, -1)))) return !1;
          e = Zt(e), n = un.call(t, e)
        }
        return n || Rt(t.length) && Mt(e, t.length) && (Fr(t) || ye(t))
      }, m.identity = qe, m.includes = ce, m.indexOf = Qt, m.inRange = function (t, e, n) {
        return e = +e || 0, n === Lo ? (n = e, e = 0) : n = +n || 0, t >= $n(e, n) && t < Cn(e, n)
      }, m.isArguments = ye, m.isArray = Fr, m.isBoolean = function (t) {
        return !0 === t || !1 === t || Co(t) && cn.call(t) == ei
      }, m.isDate = function (t) {
        return Co(t) && cn.call(t) == ni
      }, m.isElement = function (t) {
        return !!t && 1 === t.nodeType && Co(t) && !Se(t)
      }, m.isEmpty = function (t) {
        return null == t || (Ot(t) && (Fr(t) || Ne(t) || ye(t) || Co(t) && _e(t.splice)) ? !t.length : !Gr(t).length)
      }, m.isEqual = be, m.isError = xe, m.isFinite = function (t) {
        return "number" == typeof t && An(t)
      }, m.isFunction = _e, m.isMatch = function (t, e, n, r) {
        return n = "function" == typeof n ? Z(n, r, 3) : Lo, M(t, jt(e), n)
      }, m.isNaN = function (t) {
        return Te(t) && t != +t
      }, m.isNative = ke, m.isNull = function (t) {
        return null === t
      }, m.isNumber = Te, m.isObject = we, m.isPlainObject = Se, m.isRegExp = Ae, m.isString = Ne, m.isTypedArray = Ce, m.isUndefined = function (t) {
        return t === Lo
      }, m.kebabCase = eo, m.last = Zt, m.lastIndexOf = function (t, e, n) {
        var r = t ? t.length : 0;
        if (!r) return -1;
        var o = r;
        if ("number" == typeof n) o = (n < 0 ? Cn(r + n, 0) : $n(n || 0, r - 1)) + 1;
        else if (n) {
          var i = t[o = Y(t, e, !0) - 1];
          return (e == e ? e === i : i != i) ? o : -1
        }
        if (e != e) return No(t, o, !0);
        for (; o--;)
          if (t[o] === e) return o;
        return -1
      }, m.lt = $e, m.lte = function (t, e) {
        return t <= e
      }, m.max = fo, m.min = po, m.noConflict = function () {
        return Gi._ = ln, this
      }, m.noop = ze, m.now = Tr, m.pad = function (t, e, n) {
        e = +e;
        var r = (t = bo(t)).length;
        if (e <= r || !An(e)) return t;
        var o = (e - r) / 2,
          i = Tn(o);
        return (n = St("", wn(o), n)).slice(0, i) + t + n
      }, m.padLeft = no, m.padRight = ro, m.parseInt = function (t, e, n) {
        return (n ? It(t, e, n) : null == e) ? e = 0 : e && (e = +e), t = Fe(t), En(t, e || (Fi.test(t) ? 16 : 10))
      }, m.random = function (t, e, n) {
        n && It(t, e, n) && (e = n = Lo);
        var r = null == t,
          o = null == e;
        if (null == n && (o && "boolean" == typeof t ? (n = t, t = 1) : "boolean" == typeof e && (n = e, o = !0)), r && o && (o = !(e = 1)), t = +t || 0, o ? (e = t, t = 0) : e = +e || 0, n || t % 1 || e % 1) {
          var i = jn();
          return $n(t + i * (e - t + hn("1e-" + ((i + "").length - 1))), e)
        }
        return B(t, e)
      }, m.reduce = _r, m.reduceRight = wr, m.repeat = Ie, m.result = function (t, e, n) {
        var r = null == t ? Lo : t[e];
        return r === Lo && (null == t || Ft(e, t) || (r = null == (t = 1 == (e = Xt(e)).length ? t : P(t, W(e, 0, -1))) ? Lo : t[Zt(e)]), r = r === Lo ? n : r), _e(r) ? r.call(t) : r
      }, m.round = ho, m.runInContext = t, m.size = function (t) {
        var e = t ? Yn(t) : 0;
        return Rt(e) ? e : Gr(t).length
      }, m.snakeCase = oo, m.some = pe, m.sortedIndex = or, m.sortedLastIndex = ir, m.startCase = io, m.startsWith = function (t, e, n) {
        return t = bo(t), n = null == n ? 0 : $n(n < 0 ? 0 : +n || 0, t.length), t.lastIndexOf(e, n) == n
      }, m.sum = function (t, e, n) {
        return n && It(t, e, n) && (e = Lo), 1 == (e = $t(e, n, 3)).length ? function (t, e) {
          for (var n = t.length, r = 0; n--;) r += +e(t[n]) || 0;
          return r
        }(Fr(t) ? t : Jt(t), e) : (r = e, o = 0, Jn(t, function (t, e, n) {
          o += +r(t, e, n) || 0
        }), o);
        var r, o
      }, m.template = function (a, t, e) {
        var n = m.templateSettings;
        e && It(a, t, e) && (t = e = Lo), a = bo(a);
        var u, s, r = w(k({}, (t = w(k({}, e || t), n, _)).imports), n.imports, _),
          o = Gr(r),
          i = V(r, o),
          c = 0,
          l = t.interpolate || Bi,
          f = "__p += '",
          p = Ze((t.escape || Bi).source + "|" + l.source + "|" + (l === Ci ? Mi : Bi).source + "|" + (t.evaluate || Bi).source + "|$", "g"),
          d = "//# sourceURL=" + ("sourceURL" in t ? t.sourceURL : "lodash.templateSources[" + ++Ui + "]") + "\n";
        a.replace(p, function (t, e, n, r, o, i) {
          return n || (n = r), f += a.slice(c, i).replace(Wi, Ao), e && (u = !0, f += "' +\n__e(" + e + ") +\n'"), o && (s = !0, f += "';\n" + o + ";\n__p += '"), n && (f += "' +\n((__t = (" + n + ")) == null ? '' : __t) +\n'"), c = i + t.length, t
        }), f += "';\n";
        var h = t.variable;
        h || (f = "with (obj) {\n" + f + "\n}\n"), f = (s ? f.replace(bi, "") : f).replace(xi, "$1").replace(_i, "$1;"), f = "function(" + (h || "obj") + ") {\n" + (h ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u ? ", __e = _.escape" : "") + (s ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + f + "return __p\n}";
        var g = ao(function () {
          return Ge(o, d + "return " + f).apply(Lo, i)
        });
        if (g.source = f, xe(g)) throw g;
        return g
      }, m.trim = Fe, m.trimLeft = function (t, e, n) {
        var r = t;
        return (t = bo(t)) ? t.slice((n ? It(r, e, n) : null == e) ? Do(t) : xo(t, e + "")) : t
      }, m.trimRight = function (t, e, n) {
        var r = t;
        return (t = bo(t)) ? (n ? It(r, e, n) : null == e) ? t.slice(0, Eo(t) + 1) : t.slice(0, _o(t, e + "") + 1) : t
      }, m.trunc = function (t, e, n) {
        n && It(t, e, n) && (e = Lo);
        var r = zo,
          o = Jo;
        if (null != e)
          if (we(e)) {
            var i = "separator" in e ? e.separator : i;
            r = "length" in e ? +e.length || 0 : r, o = "omission" in e ? bo(e.omission) : o
          } else r = +e || 0;
        if (r >= (t = bo(t)).length) return t;
        var a = r - o.length;
        if (a < 1) return o;
        var u = t.slice(0, a);
        if (null == i) return u + o;
        if (Ae(i)) {
          if (t.slice(a).search(i)) {
            var s, c, l = t.slice(0, a);
            for (i.global || (i = Ze(i.source, (Ii.exec(i) || "") + "g")), i.lastIndex = 0; s = i.exec(l);) c = s.index;
            u = u.slice(0, null == c ? a : c)
          }
        } else if (t.indexOf(i, a) != a) {
          var f = u.lastIndexOf(i); - 1 < f && (u = u.slice(0, f))
        }
        return u + o
      }, m.unescape = function (t) {
        return (t = bo(t)) && Ti.test(t) ? t.replace(wi, jo) : t
      }, m.uniqueId = function (t) {
        var e = ++sn;
        return bo(t) + e
      }, m.words = He, m.all = ue, m.any = pe, m.contains = ce, m.eq = be, m.detect = dr, m.foldl = _r, m.foldr = wr, m.head = Yt, m.include = ce, m.inject = _r, We(m, (Wn = {}, E(m, function (t, e) {
        m.prototype[e] || (Wn[e] = t)
      }), Wn), !1), m.sample = fe, m.prototype.sample = function (e) {
        return this.__chain__ || null != e ? this.thru(function (t) {
          return fe(t, e)
        }) : fe(this.value())
      }, m.VERSION = Po, y(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (t) {
        m[t].placeholder = m
      }), y(["drop", "take"], function (r, o) {
        v.prototype[r] = function (t) {
          var e = this.__filtered__;
          if (e && !o) return new v(this);
          t = null == t ? 1 : Cn(Tn(t) || 0, 0);
          var n = this.clone();
          return e ? n.__takeCount__ = $n(n.__takeCount__, t) : n.__views__.push({
            size: t,
            type: r + (n.__dir__ < 0 ? "Right" : "")
          }), n
        }, v.prototype[r + "Right"] = function (t) {
          return this.reverse()[r](t).reverse()
        }
      }), y(["filter", "map", "takeWhile"], function (t, e) {
        var r = e + 1,
          o = r != Ko;
        v.prototype[t] = function (t, e) {
          var n = this.clone();
          return n.__iteratees__.push({
            iteratee: $t(t, e, 1),
            type: r
          }), n.__filtered__ = n.__filtered__ || o, n
        }
      }), y(["first", "last"], function (t, e) {
        var n = "take" + (e ? "Right" : "");
        v.prototype[t] = function () {
          return this[n](1).value()[0]
        }
      }), y(["initial", "rest"], function (t, e) {
        var n = "drop" + (e ? "" : "Right");
        v.prototype[t] = function () {
          return this.__filtered__ ? new v(this) : this[n](1)
        }
      }), y(["pluck", "where"], function (t, e) {
        var n = e ? "filter" : "map",
          r = e ? F : Je;
        v.prototype[t] = function (t) {
          return this[n](r(t))
        }
      }), v.prototype.compact = function () {
        return this.filter(qe)
      }, v.prototype.reject = function (e, t) {
        return e = $t(e, t, 1), this.filter(function (t) {
          return !e(t)
        })
      }, v.prototype.slice = function (t, e) {
        t = null == t ? 0 : +t || 0;
        var n = this;
        return n.__filtered__ && (0 < t || e < 0) ? new v(n) : (t < 0 ? n = n.takeRight(-t) : t && (n = n.drop(t)), e !== Lo && (n = (e = +e || 0) < 0 ? n.dropRight(-e) : n.take(e - t)), n)
      }, v.prototype.takeRightWhile = function (t, e) {
        return this.reverse().takeWhile(t, e).reverse()
      }, v.prototype.toArray = function () {
        return this.take(Pn)
      }, E(v.prototype, function (f, t) {
        var p = /^(?:filter|map|reject)|While$/.test(t),
          d = /^(?:first|last)$/.test(t),
          h = m[d ? "take" + ("last" == t ? "Right" : "") : t];
        h && (m.prototype[t] = function () {
          var e = d ? [1] : arguments,
            n = this.__chain__,
            t = this.__wrapped__,
            r = !!this.__actions__.length,
            o = t instanceof v,
            i = e[0],
            a = o || Fr(t);
          a && p && "function" == typeof i && 1 != i.length && (o = a = !1);
          var u = function (t) {
              return d && n ? h(t, 1)[0] : h.apply(Lo, b([t], e))
            },
            s = {
              func: ae,
              args: [u],
              thisArg: Lo
            },
            c = o && !r;
          if (d && !n) return c ? ((t = t.clone()).__actions__.push(s), f.call(t)) : h.call(Lo, this.value())[0];
          if (!d && a) {
            t = c ? t : new v(this);
            var l = f.apply(t, e);
            return l.__actions__.push(s), new g(l, n)
          }
          return this.thru(u)
        })
      }), y(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function (t) {
        var n = (/^(?:replace|split)$/.test(t) ? on : nn)[t],
          r = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
          o = /^(?:join|pop|replace|shift)$/.test(t);
        m.prototype[t] = function () {
          var e = arguments;
          return o && !this.__chain__ ? n.apply(this.value(), e) : this[r](function (t) {
            return n.apply(t, e)
          })
        }
      }), E(v.prototype, function (t, e) {
        var n = m[e];
        if (n) {
          var r = n.name + "";
          (Rn[r] || (Rn[r] = [])).push({
            name: e,
            func: n
          })
        }
      }), Rn[Tt(Lo, Mo).name] = [{
        name: "wrapper",
        func: Lo
      }], v.prototype.clone = function () {
        var t = new v(this.__wrapped__);
        return t.__actions__ = $(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = $(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = $(this.__views__), t
      }, v.prototype.reverse = function () {
        if (this.__filtered__) {
          var t = new v(this);
          t.__dir__ = -1, t.__filtered__ = !0
        } else(t = this.clone()).__dir__ *= -1;
        return t
      }, v.prototype.value = function () {
        var t = this.__wrapped__.value(),
          e = this.__dir__,
          n = Fr(t),
          r = e < 0,
          o = n ? t.length : 0,
          i = function (t, e, n) {
            for (var r = -1, o = n.length; ++r < o;) {
              var i = n[r],
                a = i.size;
              switch (i.type) {
                case "drop":
                  t += a;
                  break;
                case "dropRight":
                  e -= a;
                  break;
                case "take":
                  e = $n(e, t + a);
                  break;
                case "takeRight":
                  t = Cn(t, e - a)
              }
            }
            return {
              start: t,
              end: e
            }
          }(0, o, this.__views__),
          a = i.start,
          u = i.end,
          s = u - a,
          c = r ? u : a - 1,
          l = this.__iteratees__,
          f = l.length,
          p = 0,
          d = $n(s, this.__takeCount__);
        if (!n || o < Vo || o == s && d == s) return K(t, this.__actions__);
        var h = [];
        t: for (; s-- && p < d;) {
          for (var g = -1, m = t[c += e]; ++g < f;) {
            var v = l[g],
              y = v.iteratee,
              b = v.type,
              x = y(m);
            if (b == Ko) m = x;
            else if (!x) {
              if (b == Go) continue t;
              break t
            }
          }
          h[p++] = m
        }
        return h
      }, m.prototype.chain = function () {
        return ie(this)
      }, m.prototype.commit = function () {
        return new g(this.value(), this.__chain__)
      }, m.prototype.concat = lr, m.prototype.plant = function (t) {
        for (var e, n = this; n instanceof i;) {
          var r = Vt(n);
          e ? o.__wrapped__ = r : e = r;
          var o = r;
          n = n.__wrapped__
        }
        return o.__wrapped__ = t, e
      }, m.prototype.reverse = function () {
        var t = this.__wrapped__,
          e = function (t) {
            return t.reverse()
          };
        if (t instanceof v) {
          var n = t;
          return this.__actions__.length && (n = new v(this)), (n = n.reverse()).__actions__.push({
            func: ae,
            args: [e],
            thisArg: Lo
          }), new g(n, this.__chain__)
        }
        return this.thru(e)
      }, m.prototype.toString = function () {
        return this.value() + ""
      }, m.prototype.run = m.prototype.toJSON = m.prototype.valueOf = m.prototype.value = function () {
        return K(this.__wrapped__, this.__actions__)
      }, m.prototype.collect = m.prototype.map, m.prototype.head = m.prototype.first, m.prototype.select = m.prototype.filter, m.prototype.tail = m.prototype.rest, m
    }();
  "function" == typeof define && "object" == typeof define.amd && define.amd ? (Gi._ = Ki, define(function () {
    return Ki
  })) : p && d ? v ? (d.exports = Ki)._ = Ki : p._ = Ki : Gi._ = Ki
}.call(this), retrieveWindowVariables();
var products = [],
  host = 'http://asachina.vn',
  // host = 'http://localhost:8000'
  product1688 = [],
  STORAGE = "tbex_products",
  REQUEST_DATA = "REQUEST_DATA",
  CLEAR_DATA = "CLEAR_DATA",
  TBVN = "http://asachina.vn",
  config = {
    rate: 3500,
    rateUSD: 7e3,
		urlGetRate: host + "/api/exchangeRate/CNY/VND",
		urlGetRateUSD: host + "/api/exchangeRate/USD/VND",
		currentVer: "1.0.1",
    version: "1.0.1",
    urlCurrentVersion: host + "/api/extesionVersion",
    urlCart: "/manager/orders/extmade",
    allowedDomains: ["TMALL", "TAOBAO", "1688", "Aliexpress"]
  };

window.addEventListener("message", function (e) {
  if (e.origin == TBVN) {
    var t = {};
    switch (e.data.type) {
      case REQUEST_DATA:
        getData(STORAGE, function (t) {
          t ? e.source.postMessage({
            error: 0,
            message: "",
            data: t
          }, e.origin) : e.source.postMessage({
            error: 1,
            message: msg
          }, e.origin)
        });
        break;
      case CLEAR_DATA:
        t[STORAGE] = [], setData(t, function () {
          console.info("All data was cleared!")
        }), e.source.postMessage({
          error: 0,
          message: "All data was cleared!"
        }, e.origin)
    }
  }
}, !1), $.post(config.urlGetRate, function (t) {
  0 < (t = parseInt(t)) && (config.rate = t)
}), $.post(config.urlGetRateUSD, function (t) {
  0 < (t = parseInt(t)) && (config.rateUSD = t)
}), $.post(config.urlCurrentVersion, function (t) {
  t.length && (config.currentVer = t)
}), setInterval(function () {
  var t = "[class^=addon]";
  0 < $(t).length && $(t).remove()
}, 1e3);
var currentDomain = "TAOBAO",
  hostName = window.location.hostname;
config.allowedDomains.forEach(function (t) {
  -1 < hostName.indexOf(t.toLowerCase()) && (currentDomain = t)
});
var asachinaAlert = function (t, e) {
  0 < $("#asachina-alert-wrapper").length && removeBox();
  var n = $("<div>");
  n.attr({
    id: "asachina-alert-backdrop"
  }).on("click", function (t) {
    t.stopPropagation(), removeBox()
  });
  var r = $("<div>");
  r.attr({
    id: "asachina-alert-wrapper"
  }).css({
    left: (window.innerWidth - 400) / 2 + "px"
  });
  var o = $("<div>");
  o.attr({
    id: "asachina-alert-header"
  });
  var i = $("<h4>");
  i.text(t);
  var a = $("<span>");
  a.text("X").on("click", function (t) {
    t.stopPropagation(), removeBox()
  }), o.append(i, a);
  var u = $("<div>");
  u.attr({
    id: "asachina-alert-body"
  }).html(e), r.append(o, u);
  r.find('.btn-show-cart').on('click', function() {
    redirectToAsachina();
  });
  $("body").append(r, n);
  var s = setTimeout(function () {}, 1500);
  $("#asachina-alert-wrapper").mouseout(function () {
    s = setTimeout(function () {}, 1500)
  }), $("#asachina-alert-wrapper").mouseover(function () {
    clearTimeout(s)
  }), $(".asachinaremovebox").on("click", function (t) {
    t.stopPropagation(), removeBox()
  })
};

$(function () {
  "use strict";
  //if (checkLinkWarning()) return !1;
  //if (-1 === window.location.pathname.indexOf("item") && -1 === window.location.pathname.indexOf("store") && "detail.1688.com" != window.location.host) return !1;
  $("body").on("click", ".asachinaRemoveBox", function () {
    removeBox()
  }), $(".tb-rmb, .tm-yen, .fd-cny").remove();
  var t = localStorage.getItem("hungthinh_config");
  null !== t && (config.localConfig = JSON.parse(t)), $(rules[currentDomain].translate.originPrice).text("Giá"), $(rules[currentDomain].translate.promoPrice).text("Giá bán"), $(rules[currentDomain].translate.size).text("Kích thước"), $(rules[currentDomain].translate.color).text("Màu sắc"), $(rules[currentDomain].translate.amount).text("Số lượng"), $(rules[currentDomain].translate.unit).text("sản phẩm");
  var e = getPrice(),
    n = 0,
    r = "",
    o = "";
  if ("1688" == currentDomain && "detail.1688.com" === window.location.host)
    if (0 < (o = $(".mod-detail-purchasing").attr("data-mod-config")).length && (o = JSON.parse(o)), "object" == typeof o && (o = parseInt(o.max)), "number" == typeof o && (r += '<dl><dd style="width:100%"><span class="tag-warning badge badge-dark">Shop hiện còn <b>' + o + "</b> sản phẩm</span></dd></dl>"), "number" == typeof e) n = Math.round(e * config.rate).format();
    else {
      if (0 < e.length) {
        1 < parseInt(e[0].begin) && (r += '<dl><dd style="width:100%"><span class="tag-warning badge badge-dark">Shop yêu cầu mua tối thiểu ' + e[0].begin + " sản phẩm</span></dd></dl>");
        for (var i = 0; i <= e.length - 1; i++) r += 0 < e[i].end.length ? "<dl><dd class='price_arr_left'><span class='tag-ext badge badge-dark'>Mua: </span><span class='tag-value badge badge-danger'>" + e[i].begin + " - " + e[i].end + ' sản phẩm</span></dd><dd class="price_arr_right"><span class="tag-ext badge badge-dark">Giá : </span><span class="asachina-color-price"><span class="asachina-color-price tag-value badge badge-danger">¥' + e[i].price + "</span></span></dd></dl>" : "<dl><dd class='price_arr_left'><span class='tag-ext badge badge-dark'>Mua: &gt;</span><span class='tag-value badge badge-danger'>" + e[i].begin + ' sản phẩm</span></dd><dd class="price_arr_right"><span class="tag-ext badge badge-dark">Giá : </span><span class="asachina-color-price"><span class="tag-value badge badge-danger">¥' + e[i].price + "</span></span></dd></dl>"
      }
      n = Math.round(e[0].price * config.rate).format()
    }
  else 0 < (o = $("#J_EmStock, #J_SpanStock").text()).length && (o = retnum(o), o = parseInt(o)), "number" == typeof o && (r += "TMALL" == currentDomain ? '<dl><dd style="width:100%"><span class="tag-warning badge badge-dark">Shop hiện còn <b>' + o + "</b> sản phẩm</span></dd></dl>" : '<dl><dd style="width:100%"><span class="tag-warning badge badge-dark">Shop giới hạn mua tối đa <b class="asachina-color-price">' + o + "</b> sản phẩm</span></dd></dl>"), n = "Aliexpress" == currentDomain ? Math.round(e.orgPrice * config.rateUSD * config.rate).format() : Math.round(e.orgPrice * config.rate).format(), 0 < e.orgPrice && e.orgPrice > e.proPrice || (0 == e.orgPrice || isNaN(e.orgPrice)) && 0 < e.proPrice ? n = "Aliexpress" == currentDomain ? Math.round(e.proPrice * config.rateUSD * config.rate).format() : Math.round(e.proPrice * config.rate).format() : (0 < e.lowPrice && 0 < e.highPrice && (n = "Aliexpress" == currentDomain ? Math.round(e.lowPrice * config.rateUSD * config.rate).format() + " - " + Math.round(e.highPrice * config.rateUSD * config.rate).format() : Math.round(e.lowPrice * config.rate).format() + " - " + Math.round(e.highPrice * config.rate).format()), 0 < e.lowPromo && 0 < e.highPromo && (n = "Aliexpress" == currentDomain ? Math.round(e.lowPromo * config.rateUSD * config.rate).format() + " - " + Math.round(e.highPromo * config.rateUSD * config.rate).format() : Math.round(e.lowPromo * config.rate).format() + " - " + Math.round(e.highPromo * config.rate).format()));
  var a = 0;
  $("#J_PromoPrice, #J_priceStd, #J_PromoWrap, #j-sku-discount-price").on("DOMNodeInserted", function (t) {
    $(".tb-rmb, .tm-yen, .fd-cny").remove();
    var e, n = $(t.currentTarget).find(".tb-rmb-num, .tm-price").text() || $(rules[currentDomain].crawle.promoPrice).text();
    0 < (n = parseFloat(n)) && (a = n, $("#asachina-warning-bar:hidden") && ($("#asachina-warning-bar").show(), "Aliexpress" == currentDomain ? $("#asachina-info b.asachina-rate").text(Math.round(a * config.rateUSD * config.rate).format()) : $("#asachina-info b.asachina-rate").text(Math.round(a * config.rate).format()), e = setTimeout(function () {
      $("#asachina-warning-bar").hide()
    }, 3e3), "Aliexpress" == currentDomain ? $(".asachina-cny").text("(" + Math.round(a * config.rateUSD).format() + " CNY)") : $(".asachina-cny").text(""), $("#asachina-warning-bar").mouseout(function () {
      e = setTimeout(function () {
        $("#asachina-warning-bar").hide()
      }, 3e3)
    }), $("#asachina-warning-bar").mouseover(function () {
      clearTimeout(e)
    })))
  }), $(".amount-down").on("click", function (t) {
    t.preventDefault();
    var e = $(t.currentTarget).next().val();
    void 0 !== e && e || (e = $(t.currentTarget).next().val()), capnhatSoLuong(t.currentTarget, e)
  }), $(".amount-up").on("click", function (t) {
    t.preventDefault();
    var e = $(t.currentTarget).next().val();
    void 0 !== e && e || (e = $(t.currentTarget).prev().val()), capnhatSoLuong(t.currentTarget, e)
  }), $("input.amount-input").on("change", function (t) {
    t.preventDefault();
    var e = $(t.currentTarget).next().val();
    void 0 !== e && e || (e = $(t.currentTarget).val()), capnhatSoLuong(t.currentTarget, e)
  });
  var u = $(".mod-detail-purchasing-single .unit-detail-amount-control input.amount-input"),
    s = u.val();
  void 0 !== s && null != s && 1 <= s && capnhatSoLuong(u, s), 0 < r.length && (r = "<li>" + r + "</li>");
  //var c = ['<div id="asachina-info"><h5 class="tool_title">Hùng Thịnh Logistics Order Tool</h5><div class="asachina-info-inner">', '<img src="' + chrome.extension.getURL('/images/logo.png') + '" alt="Hùng Thịnh Logistics" />', "<ul>", '<li>Giá bán: <b class="asachina-rate asachina-color-price">' + n + '</b> VNĐ <span class="asachina-cny" style="font-weight: bold;color: #357ae8;font-size: 16px;"></span></li>', '<li>Tỷ giá: <span class="asachina-color-price">' + config.rate.format() + "</span> VNĐ/tệ</li>", r, "</ul>", '<div class="asachina-info-warning">(!!) Vui lòng chọn đầy đủ thông tin sản phẩm ở bên dưới để xem giá chuẩn.</div>', '</div><div class="asachina_note"><textarea id="pro_note" rows="2" placeholder="Ghi chú sản phẩm"></textarea><p class="google_translate">Lưu ý : <strong> không dùng Google Translate</strong> khi thêm sản phẩm!</p></div><div class="asachina_action"><button id="asachina-btn-product" type="button" class="btn btn-sm">Thêm Sản phẩm yêu thích</button><button id="asachina-btn-shop" type="button" class="btn btn-sm">Thêm Shop yêu thích</button></div></div>'].join("");
  var c = ['<div id="asachina-info"><h5 class="tool_title">Asachina Google Chorme Extension</h5><div class="asachina-info-inner">', "<ul>", '<li><span class="tag-ext badge badge-dark">Giá bán</span><span class="asachina-rate asachina-color-price tag-value badge badge-danger">' + n + ' VNĐ</span><span class="asachina-cny"></span></li>', '<li><span class="tag-ext badge badge-dark">Tỷ giá</span> <span class="asachina-color-price tag-value badge badge-danger">' + config.rate.format() + " VNĐ/tệ</span></li>", r, "</ul>", '<div class="asachina-info-warning">(!!) Vui lòng chọn đầy đủ thông tin sản phẩm ở bên dưới để xem giá chuẩn.</div>', '</div><div class="asachina_note"><textarea id="pro_note" rows="2" placeholder="Ghi chú sản phẩm"></textarea><p class="google_translate">Lưu ý : <strong> không dùng Google Translate</strong> khi thêm sản phẩm!</p></div></div>'].join("");
  $("#J_Title, .tb-detail-hd, #mod-detail-price, .offerdetail_daixiao_price").append(c), $("h1.product-name").after(c), $("#asachina-btn-submit-action").on("click", order), $("#asachina-btn-view").on("click", function (t) {
    t.preventDefault();
    // window.open("http://taobaovietnam.vn/gio-hang", "_blank")
    if (storageData.length) {
      storageData.forEach(function(item) {
        item.pro_note = $("#pro_note").val() ? $("#pro_note").val() : 'No comment';
      });
      redirect(host + '/manager/dashboard/orders/extmade', storageData);
    } else {
      asachinaAlert("Thông báo", "Bạn chưa thêm sản phẩm nào vào giỏ hàng!");
    }
  })
  /*, "1688" != currentDomain && $(".asachina_action").append('<button id="asachina-btn-search-1688" type="button" class="btn btn-sm">Tìm sản phẩm trên 1688</button>'), $("#asachina-btn-search-1688").on("click", function(t) {
    t.preventDefault();
    var e = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
    e = e.replace("_.webp", ""), window.open("https://s.1688.com/youyuan/index.htm?spm=2013.1.0.0.2e538ffevNiPGk&tab=imageSearch&imageType=https://gd1.alicdn.com&imageAddress=" + e, "_blank")
   })*/
  ;
  var l = $('<div class="bg-warning">');
  l.attr("id", "asachina-menubar").html('<a title="Hùng Thịnh Logistics" target="_blank" href="' + TBVN + '"><img id="asachina-logo" src="' + chrome.extension.getURL('/images/hotline.png') + '"/></a><p class="hotline">HOTLINE : <span>084 888.389.666</span></p>');
  var f = makeButton({
      id: "asachina-btn-show-cart",
      class: "btn btn-sm",
      type: "button"
    }, "Xem giỏ hàng", function (t) {
      t && t.preventDefault();
      // window.open("http://taobaovietnam.vn/gio-hang", "_blank").focus()
      redirectToAsachina();
    }),
    p = makeButton({
      id: "asachina-btn-submit",
      class: "btn btn-sm",
      type: "button"
    }, "Thêm sản phẩm", order),
    d = makeButton({
      id: "asachina-btn-guide",
      class: "btn btn-sm btn-invert",
      type: "button"
    }, "Hướng dẫn đặt hàng", guideToOrder),
    h = $("<span>");
  h.attr({
    id: "asachina-warning-bar",
    class: "alert alert-danger",
    role: "alert"
  }).html('<span class="text-white"><strong>Chú ý:</strong> Sản phẩm vừa được cập nhật giá theo thuộc tính đã chọn, vui lòng kiểm tra lại thông tin!</span>').hide().on("click", function () {
    $(this).hide()
  });
  l.append('<button id="asachina-btn-hide-show" class="btn bg-warning arrow-hide"><img src="' + chrome.extension.getURL('/images/arrow.png') + '"></button>', d, f, p, h, '<div name="asachina_search" class="form_ex element-hide" accept-charset="UTF-8"><select name="search_type" id="search_type" class="cbSelect search_option"><option value="product" selected="selected">Tìm sản phẩm</option><option value="shop">Tìm xưởng</option></select>   <select id="location" name="location" class="cbSelect search_option"><option value="0">Địa điểm</option><option value="广州">Quảng Châu</option><option value="广东">Quảng Đông</option><option value="湖南">Hồ Nam</option><option value="贵州">Quý Châu</option><option value="广西">Quảng Tây</option><option value="江浙沪">Giang Tô , Chiết Giang</option><option value="北京">Bắc Kinh</option><option value="上海">Thượng Hải</option><option value="天津">Thiên Tân</option><option value="重庆">Trùng Khánh</option><option value="浙江">Chiết Giang</option><option value="江苏">Tỉnh Giang Tô</option><option value="山东">Sơn Đông</option><option value="河北">Hà Bắc</option><option value="河南">Hà Nam</option><option value="福建">Tỉnh Phúc Kiến</option><option value="辽宁">Tỉnh Liêu Ninh</option><option value="安徽">An Huy</option><option value="山西">Sơn Tây</option><option value="海南">Hải Nam</option><option value="内蒙古">nội Mông</option><option value="吉林">Cát Lâm</option><option value="黑龙江">Hắc Long Giang</option><option value="湖北">Hồ Bắc</option><option value="江西">Tỉnh Giang Tây</option><option value="宁夏">Ninh Hạ</option><option value="新疆">Tân Cương</option><option value="青海">Thanh Hải</option><option value="陕西">Tỉnh Sơn Tây</option><option value="甘肃">Tỉnh Cam Túc</option><option value="四川">Tỉnh Tứ Xuyên</option><option value="云南">Vân Nam</option><option value="西藏">Tây Tạng</option><option value="香港">Hồng Kông</option><option value="澳门">Macao</option><option value="台湾">Đài Loan</option></select>    <select name="langfrom" id="langfrom" class="cbSelect"><option value="vi" selected="selected">Tiếng Việt</option><option value="en">Tiếng Anh</option></select><input type="text" class="text" id="search-keyword" placeholder="Từ khóa" name="key" autocomplete="off"><a class="button" id="bt-search">Tìm Kiếm</a></div>'), $("body").prepend(l), $("#asachina-btn-favorite").on("click", function (t) {
    t.preventDefault(), $("#asachina-box-favorite").show()
  }), $(".tbe_remove").on("click", function (t) {
    t.preventDefault(), $("#asachina-box-favorite").hide()
  }), $("#asachina-btn-hide-show").on("click", function (t) {
    $(this).hasClass("arrow-hide") ? ($("#asachina-menubar").animate({
      left: "100%"
    }, "slow"), $(this).removeClass("arrow-hide"), $(this).addClass("arrow-show")) : ($("#asachina-menubar").animate({
      left: "0px"
    }, "slow"), $(this).removeClass("arrow-show"), $(this).addClass("arrow-hide"))
  }), $(".tbe_remove1").on("click", function (t) {
    t.preventDefault(), $("#if_favorite").hide()
  }), $(".tbe_link_product").on("click", function (t) {
    t.preventDefault();
    var e = $(this).data("href");
    $("#if_favorite").append(tbe_iframe_favorite(e)), $("#if_favorite").show()
  })
}), Number.prototype.format = function () {
  var t, e = (this + "").split(","),
    n = e[0];
  t = 1 < e.length ? "," + e[1] : "";
  for (var r = /(\d+)(\d{3})/; r.test(n);) n = n.replace(r, "$1,$2");
  return n + t
};
var rules = {
  TAOBAO: {
    translate: {
      originPrice: "#J_PriceName",
      promoPrice: "#J_PriceName",
      size: 'dt:contains("尺碼"), dt:contains("尺寸"), dt:contains("尺码"), dt:contains("参考身高"), dt:contains("鞋码")',
      color: 'dt:contains("顏色"), dt:contains("颜色分类"), dt:contains("颜色")',
      amount: 'dt:contains("數量"), dt:contains("数量")',
      unit: ".tb-amount-widget .mui-amount-unit"
    },
    crawle: {
      originPrice: "#J_priceStd .tb-rmb-num, #J_StrPrice",
      promoPrice: "#J_PromoPrice .tb-rmb-num, #J_PromoPriceNum",
      image: "#J_ThumbView, #J_ImgBooth",
      shop_nick: ".tb-shop-name a",
      shop_link: ".tb-shop-name a",
      amount: "#J_IptAmount",
      size: 'dt:contains("Kích thước"), dt:contains("kích thước"), dt:contains("Size"), dt:contains("size")',
      color: 'dt:contains("Màu sắc"), dt:contains("màu sắc"), dt:contains("màu số"), dt:contains("Color"), dt:contains("color")',
      lowPrice: 'span[itemprop="lowPrice"]',
      highPrice: 'span[itemprop="highPrice"]'
    }
  },
  TMALL: {
    translate: {
      originPrice: 'dt:contains("價格"), dt:contains("专柜价")',
      promoPrice: 'dt:contains("促銷價")',
      size: 'dt:contains("尺碼"), dt:contains("尺寸"), dt:contains("尺码"), dt:contains("套餐類型"), dt:contains("参考身高"), dt:contains("鞋码")',
      color: 'dt:contains("顏色"), dt:contains("颜色")',
      amount: 'dt:contains("數量"), dt:contains("数量")',
      unit: ".tb-amount-widget .mui-amount-unit"
    },
    crawle: {
      originPrice: "#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tm-fcs-panel > dl.tm-tagPrice-panel > dd > span, #J_StrPriceModBox > dd > span",
      promoPrice: "#J_PromoPrice > dd > div > span, #J_PromoBox > div > span",
      image: "#J_ThumbView, #J_ImgBooth",
      shop_nick: ".shopLink",
      shop_link: ".shopLink",
      amount: "#J_Amount input",
      size: 'dt:contains("Kích thước"), dt:contains("kích thước"), dt:contains("Size"), dt:contains("size")',
      color: 'dt:contains("Màu sắc"), dt:contains("màu sắc"), dt:contains("màu số"), dt:contains("Color"), dt:contains("color")',
      lowPrice: "#J_PromoPrice .tm-price",
      highPrice: "#J_PromoPrice .tm-price"
    }
  },
  1688: {
    translate: {
      originPrice: "tr.price > td.price-title",
      promoPrice: "tr.price > td.price-title",
      size: ".d-content .obj-sku .obj-title",
      color: ".d-content .obj-leading .obj-title",
      amount: "",
      unit: ""
    },
    crawle: {
      originPrice: ".tm-price-panel .tm-price",
      promoPrice: ".tm-promo-panel .tm-price",
      image: ".mod-detail-gallery img, .mod-detail-version2018-gallery img",
      shop_nick: "#usermidid",
      shop_link: ".currentdomain, .enname",
      amount: "#J_Amount input",
      size: "",
      color: 'span.obj-title:contains("Màu sắc"), span.obj-title:contains("màu sắc"), dt:contains("Color"), dt:contains("color")',
      lowPrice: "#J_PromoPrice .tm-price",
      highPrice: "#J_PromoPrice .tm-price"
    }
  },
  Aliexpress: {
    translate: {
      originPrice: "tr.price > td.price-title",
      promoPrice: "tr.price > td.price-title",
      size: 'dt:contains("Size"), dt:contains("size")',
      color: 'dt:contains("Color"), dt:contains("Color:")',
      amount: 'dt:contains("Quantity:")',
      unit: ""
    },
    crawle: {
      originPrice: "#j-sku-price",
      promoPrice: "#j-sku-discount-price",
      image: ".ui-image-viewer .ui-image-viewer-thumb-wrap .ui-image-viewer-thumb-frame img",
      shop_nick: "#j-store-info-wrap .store-intro .store-lnk",
      shop_link: "#j-store-info-wrap .store-intro .store-lnk",
      amount: "#j-p-quantity-input",
      size: 'dt:contains("Kích thước"), dt:contains("kích thước"), dt:contains("Size"), dt:contains("size")',
      color: 'dt:contains("Màu sắc"), dt:contains("màu sắc"), dt:contains("Color"), dt:contains("color")',
      lowPrice: "#J_PromoPrice .tm-price",
      highPrice: "#J_PromoPrice .tm-price"
    }
  }
};
var LocalStorageSearch = {
  set: function (value, fn) {
    try {
      chrome.storage.local.set({
        "dataSearch": JSON.stringify(value)
      }, function () {
        //fn();
      });
    } catch (err) {
      console.log(err);
    }
  },
  get: function (fn) {
    try {
      chrome.storage.local.get("dataSearch", function (obj) {
        try {
          var dataSearch = JSON.parse(obj.dataSearch);
          fn(dataSearch);
        } catch (erx) {}
      });

    } catch (err) {
      console.log(err);
    }
  }
};

function getDataSearch() {
  try {

    LocalStorageSearch.get(function (data) {
      $("#langfrom").val(data.langfrom);
      $("#search_type").val(data.search_type);
      $("#location").val(data.location);
      $("#search-keyword").val(data.keywords);
    });

  } catch (err) {}
}

function setDataSearch() {
  var objData = {};
  objData.langfrom = $("#langfrom").val();
  objData.search_type = $("#search_type").val();
  objData.location = $("#location").val();
  objData.keywords = $("#search-keyword").val();
  LocalStorageSearch.set(objData);
}

function getRateTypeTaoBao() {
  var ratetype = "";
  if ($("#J_ShopInfo .tb-shop-rank.tb-rank-red, .shop-rank a.tb-rank-red").length > 0) {
    ratetype = "heart";
  } else if ($("#J_ShopInfo .tb-shop-rank.tb-rank-blue, .shop-rank a.tb-rank-blue").length > 0) {
    ratetype = "diamond";
  } else if ($("#J_ShopInfo .tb-shop-rank.tb-rank-cap, .shop-rank a.tb-rank-cap").length > 0) {
    ratetype = "blue_crown";
  } else if ($("#J_ShopInfo .tb-shop-rank.tb-rank-crown, .shop-rank a.tb-rank-crown").length > 0) {
    ratetype = "gold_crown";
  }
  return ratetype;
}

function getRateType1688() {
  var ratetype = "";
  var urlimgrate = $("#site_content .detail .supply-grade .disc a.image img:first, .import-grade span.grade a.grade-image img:first").attr("src");
  if (urlimgrate) {
    var filename = urlimgrate.substring(urlimgrate.lastIndexOf('/') + 1).replace("_1490276829.png", "");
    if (filename == "2421892") {
      ratetype = "badge";
    } else if (filename == "2422944") {
      ratetype = "diamond";
    } else if (filename == "2423877") {
      ratetype = "crown";
    }
  }
  return ratetype;
}
$("body").append('<div style="z-index: 9999;display: none;position:fixed;height:100%;width:100%;left:0px;top:0px;background: rgba(0, 0, 0, 0.28);" id="cart-mask"><div style="width:220px;margin:268px auto 0px auto;background:#FFF;padding:10px;border:1px solid #999;" class="container"><img style="height:25px;vertical-align:middle;" src="' + chrome.extension.getURL('/images/process.gif') + '" alt="Đang tải dữ liệu..." title="Đang tải dữ liệu..."/><span>Đang xử lý...</span></div></div>'), $(window).load(function () {
  $(".add-daixiao").remove(), $("#pro_note").each(function () {
    var t = $(this);
    setInterval(function () {
      "rgb(204, 204, 204)" == t.css("border-color") ? t.css("border-color", "#f00") : t.css("border-color", "rgb(204, 204, 204)")
    }, 500)
  });
  var t = window.location.href;
  if (0 < t.indexOf("login.taobao.com/member/login.jhtml?from=taobaoindex")) {
    var e = t.split("&");
    console.log(e);
    var n = e[4];
    n = (n = (n = (n = decodeURIComponent(n)).replace("redirect_url=", "")).replace("world.", "item.")).replace(".htm", ".html");
    window.location.href = n, console.log(n)
  }
  getDataSearch();
  $("#bt-search").click(function () {

    setDataSearch();

    var loc = $("#location").val();

    $.get('https://taobaotrungquoc.vn/dich-tu-khoa-tim-kiem.html?langfrom=' + $("#langfrom").val() + '&langto=zh-CHS&key=' + encodeURIComponent($("#search-keyword").val()), function (data) {
      if (data.error_code == 1) {
        alert(data.message);
      } else {
        if ($("#search_type").val() == "product") {
          if (currentDomain == "TAOBAO") {
            if (loc != "0") {
              window.location = "https://s.taobao.com/search?sort=sale-desc&q=" + data.data + "&loc=" + loc;
            } else {
              window.location = "https://s.taobao.com/search?sort=sale-desc&q=" + data.data;
            }
          }
          if (currentDomain == "TMALL") {
            window.location = "https://list.tmall.com/search_product.htm?q=" + data.data;
          } else if (currentDomain == "1688") {
            if (loc != "0") {
              window.location = "https://s.1688.com/selloffer/offer_search.htm?descendOrder=true&keywords=" + data.data + "&province=" + loc;
            } else {
              window.location = "https://s.1688.com/selloffer/offer_search.htm?descendOrder=true&keywords=" + data.data;
            }


          }
        } else if ($("#search_type").val() == "shop") {
          if (currentDomain == "TAOBAO") {
            if (loc != "0") {
              window.location = "https://shopsearch.taobao.com/search?sort=sale-desc&app=shopsearch&q=" + data.data + "&loc=" + loc;
            } else {
              window.location = "https://shopsearch.taobao.com/search?sort=sale-desc&app=shopsearch&q=" + data.data;
            }
          }
          if (currentDomain == "TMALL") {
            window.location = "https://list.tmall.com/search_product.htm?q=" + data.data;
          } else if (currentDomain == "1688") {
            if (loc != "0") {
              window.location = "https://s.1688.com/company/company_search.htm?descendOrder=true&keywords=" + data.data + "&province=" + loc;
            } else {
              window.location = "https://s.1688.com/company/company_search.htm?descendOrder=true&keywords=" + data.data;
            }
          }
        }
      }
    })
    return;
  });
  $("#asachina-btn-shop").click(function () {
    try {
      $("#cart-mask").show();
      var sdata = JSON.parse(getlocalData("hungthinh_config"));
      shop = {};
      if (currentDomain == "TAOBAO") {
        shop.ShopNick = (sdata.shopName) ? sdata.shopName : taobaoShopNick();
        shop.ShopLink = taobaoShopLink();
        shop.Domain = currentDomain;
        shop.Rate = $("#J_ShopInfo .tb-shop-rank dl dd a i, .shop-rank a i").length;
        shop.RateType = getRateTypeTaoBao();
        var shopAge = parseInt(sdata.idata.seller.shopAge);
        shop.ShopAge = (shopAge) ? shopAge : 0;
        shop.ImageLink = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
      } else if (currentDomain == "TMALL") {
        shop.ShopNick = tmallShopNick();
        shop.ShopLink = tmallShopLink();
        shop.Domain = currentDomain;
        shop.Rate = $("#J_ShopInfo .tb-shop-rank dl dd a i, .shop-rank a i").length;
        shop.RateType = "none";
        var shopAge = parseInt(sdata.tmShopAges);
        shop.ShopAge = (shopAge) ? shopAge : 0;
        shop.ImageLink = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
      } else if (currentDomain == "1688") {
        shop.ShopNick = com1688ShopNick();
        shop.ShopLink = com1688ShopLink();
        shop.Domain = currentDomain;
        shop.Rate = $("#site_content .detail .supply-grade .disc a.image img, .import-grade span.grade a.grade-image img").length;
        shop.RateType = getRateType1688();
        var shopAge = parseInt($(".certify-info .tp-info .tp-year, .certify-info .tp-info .year-number").text());
        shop.ShopAge = shopAge;
        shop.Medal = $(".trade-medal .disc a.image img, .import-medal a.medal-image img, .sellerinfo-medal a.image img").length;
        shop.ImageLink = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
      }
      console.log(shop);
      if (typeof shop !== 'undefined' && typeof shop !== null) {

        $.post('https://taobaovietnam.vn/Api/AddShop?input={ImageLink: "' + shop.ImageLink + '", ShopNick: "' + encodeURIComponent(shop.ShopNick) + '",ShopLink: "' + shop.ShopLink + '",Rate: ' + shop.Rate + ',RateType: "' + shop.RateType + '",ShopAge: ' + shop.ShopAge + ',Domain: "' + shop.Domain + '"}', function (dt) {
          console.log(dt);
          if (dt.data == 0) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo", "Đã thêm shop <b>" + shop.ShopNick + "</b> vào danh sách yêu thích.");
          } else if (dt.data == 1) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo lỗi", "Không thêm được shop vào danh sách yêu thích.");
          } else if (dt.data == 2) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo", "Shop <b>" + shop.ShopNick + "</b> đã tồn tại trong danh sách yêu thích của bạn.");
          } else if (dt.data == 4) {
            ($("#cart-mask").hide(), asachinaAlert("Thông báo", '<p><b>Bạn vui lòng đăng nhập hệ thống để thêm sản phẩm vào giỏ hàng. </b><br> <span style="color: red;">(Khi bạn đăng nhập thì khi chuyển máy tính khác giỏ hàng của bạn vẫn được giữ nguyên)</span></p><p style="margin-top: 20px; text-align: center"><a target="_blank" href="https://taobaovietnam.vn/dang-nhap" class="btn btn-success btn-sm asachinaremovebox">Đăng nhập</a> <a target="_blank" href="https://taobaovietnam.vn/dang-ky" class="btn btn-default btn-sm">Đăng ký</a></p>'))
          }
        });
      }
    } catch (err) {
      console.log(err)
    }
  });



  $("#asachina-btn-product").click(function () {
    try {
      $("#cart-mask").show();
      var sdata = JSON.parse(getlocalData("hungthinh_config"));
      product = {};
      if (currentDomain == "TAOBAO") {
        product.tenshop = (sdata.shopName) ? sdata.shopName : taobaoShopNick();
        product.linkshop = taobaoShopLink();
        product.tensp = $("#J_Title .tb-main-title").data("title");
        product.linksp = changeLink(window.location.href);
        product.linkanh = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
        product.nguon = currentDomain;
        product.giaban = parseFloat($(rules[currentDomain].crawle.originPrice).text()), parseFloat($(rules[currentDomain].crawle.promoPrice).text());
        product.sldaban = parseInt($("#J_SellCounter").text());
        product.comment = parseInt($("#J_RateCounter").text());
        product.ghichu = $("#pro_note").val();
      } else if (currentDomain == "TMALL") {
        product.tenshop = tmallShopNick();
        product.linkshop = tmallShopLink();
        product.tensp = $("#J_ThumbView, #J_ImgBooth").attr("alt");
        product.linksp = changeLink(window.location.href);
        product.linkanh = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
        product.nguon = currentDomain;
        product.giaban = parseFloat($(rules[currentDomain].crawle.originPrice).text()), parseFloat($(rules[currentDomain].crawle.promoPrice).text());
        product.sldaban = ($(".tm-ind-sellCount .tm-count ").text()) ? parseInt($(".tm-ind-sellCount .tm-count ").text()) : 0;
        product.comment = ($("#J_ItemRates .tm-count").text()) ? parseInt($("#J_ItemRates .tm-count").text()) : 0;
        product.ghichu = $("#pro_note").val();
      } else if (currentDomain == "1688") {
        product.tenshop = com1688ShopNick();
        product.linkshop = com1688ShopLink();
        product.tensp = $(".mod-detail-gallery img").attr("alt");
        product.linksp = changeLink(window.location.href);
        product.linkanh = changeLink(correctLink($(rules[currentDomain].crawle.image).attr("src")));
        product.nguon = currentDomain;
        product.giaban = parseFloat($("meta[property='og:product:price']").attr("content"));
        product.sldaban = ($(".d-content.static-content .bargain-number a .value").text()) ? parseInt($(".d-content.static-content .bargain-number a .value").text()) : 0;
        product.comment = ($(".d-content.static-content .satisfaction-number a .value").text()) ? parseInt($(".d-content.static-content .satisfaction-number a .value").text()) : 0;
        product.ghichu = $("#pro_note").val();
      }
      console.log(product);
      if (typeof product !== 'undefined' && typeof product !== null) {

        $.post('https://taobaovietnam.vn/Api/AddProduct?input={tenshop: "' + encodeURIComponent(product.tenshop) + '", linkshop: "' + encodeURIComponent(product.linkshop) + '",tensp: "' + encodeURIComponent(product.tensp) + '",linksp: "' + encodeURIComponent(product.linksp) + '", linkanh: "' + encodeURIComponent(product.linkanh) + '", nguon: "' + product.nguon + '", giaban: ' + product.giaban + ', sldaban : ' + product.sldaban + ', comment : ' + product.comment + ', ghichu : "' + product.ghichu + '"}', function (dt) {
          console.log(dt);
          if (dt.data == 0) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo", "Đã thêm sản phẩm vào danh sách yêu thích.");
          } else if (dt.data == 1) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo lỗi", "Không thêm được sản phẩm vào danh sách yêu thích.");
          } else if (dt.data == 2) {
            $("#cart-mask").hide(), asachinaAlert("Thông báo", "Sản phẩm đã tồn tại trong danh sách yêu thích của bạn.");
          } else if (dt.data == 4) {
            ($("#cart-mask").hide(), asachinaAlert("Thông báo", '<p><b>Bạn vui lòng đăng nhập hệ thống để thêm sản phẩm vào giỏ hàng. </b><br> <span style="color: red;">(Khi bạn đăng nhập thì khi chuyển máy tính khác giỏ hàng của bạn vẫn được giữ nguyên)</span></p><p style="margin-top: 20px; text-align: center"><a target="_blank" href="https://taobaovietnam.vn/dang-nhap" class="btn btn-success btn-sm asachinaremovebox">Đăng nhập</a> <a target="_blank" href="https://taobaovietnam.vn/dang-ky" class="btn btn-default btn-sm">Đăng ký</a></p>'))
          }
        });
      }
    } catch (err) {
      console.log(err)
    }
  });
});