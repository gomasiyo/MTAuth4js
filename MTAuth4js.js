/**
 *  MTAuth4js  DataAPI Helper For JavaScript
 *  @param  {object} baseUrl, mtversion, clientId
 *  @author Goma::NanoHa
 */
var MTAuth4js = function(options) {

    /**
     *  MTAuth Version
     */
    var version = 1.1;

    /**
     *  環境変数
     */
    this.initialVar = {
        baseUrl: null,
        siteId: 1,
        async: true,
        clientId: 'MTAuth for JS Version: ' + version
    }

    /**
     *  橋渡し用オブジェクト
     */
    this.params = new Object();

    /**
     *  Construct
     */
    if(typeof options === 'object' || typeof options != 'undefined' ) {
        this.setUp(options);
    }

}

MTAuth.prototype = {

    /**
     *  初期設定用メゾット
     *  @param  {object} baseUrl, mtversion, clientId
     *  @error  {String} Unkown Option
     *  @return {void}
     */
    setUp: function(options) {
        if(typeof options != 'object' || typeof options === 'undefined' ) {
            throw new Error('Unkown Option');
        }
        $.extend(true, this.initialVar, options);
    },

    /**
     *  baseUrl 確認
     *  @error  {String} Not baseURL
     *  @return {void}
     */
    checkbaseUrl: function() {
        if(this.initialVar.baseUrl === null) {
            throw new Error('Not baseURL');
        }
    },

    /**
     *  記事リスト取得
     *  @param  {object} siteId, param
     *  @param  {function} callback
     *  @return {void}
     */
    listEntries: function(options, callback) {
        if(typeof options === 'function') {
            callback = options;
            var siteId = this.initialVar.siteId;
        } else {
            var siteId = options.siteId === undefined ? this.initialVar.siteId : options.siteId;
        }
        options.url = '/v1/sites/'+ siteId +'/entries';
        this.userRequest(options).done(function(data) {
            callback(data);
        }).fail(function(data) {
            callback(data.responseJSON);
        });
    },

    /**
     *  記事取得
     *  @param  {object} siteId, entryId(*), param
     *  @error  {String} Not  Options
     */
    getEntry: function(options, callback) {
        if(typeof options === 'function') {
            throw new Error('Not Options');
        }
        var siteId = options.siteId == undefined ? this.initialVar.siteId : options.siteId;
        options.url = '/v1/sites/'+ siteId +'/entries/' + options.entryId;
        this.userRequest(options).done(function(data) {
            callback(data);
        }).fail(function(data) {
            callback(data.responseJSON);
        });
    },

    /**
     *  リクエスト送信メゾット
     *  @param  {object} url, method, peram
     *  @error  {String} NotURL
     *  @return {object} Deferred
     */
    userRequest: function(options) {

        this.checkbaseUrl();
        options = options === undefined ? new Object() : options ;
        this.params = $.extend(true, new Object(), this.defaultOption(), options);

        if(this.params.url === null) {
            throw new Error('Not URL');
        }
        this.params.url = this.initialVar.baseUrl + this.params.url;

        this.params.method = this.params.method.toUpperCase();

        var ajax = $.ajax({
            url: this.params.url,
            method: this.params.method,
            data: this.params.param,
            async: this.params.async,
            dataType: 'json',
            cache: false,
        });

        return ajax.promise();

    },

    /**
     *  userRequest のデフォルトオプション
     *  @return {object}
     */
    defaultOption: function() {
        return {
            url: null,
            method: 'GET',
            param: new Object()
        }
    }

}
