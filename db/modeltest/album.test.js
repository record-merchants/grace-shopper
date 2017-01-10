'use strict'

const db = require('APP/db')
const Album = require('../models/album')
const {expect} = require('chai')


describe('The `Album` model', () => {

  /**
   * First we clear the database and recreate the tables before beginning a run
   */

  before('wait for the db', () => db.didSync)

  /**
   * Next, we create an (un-saved!) article instance before every spec
   */
  var modelBody = {
    title: 'No Strings Attached',
    // artist: 'NSYNC',
    genre: 'Pop',
    release_year: 2000,
    description: 'No Strings Attached is the second studio album by American boy band NSYNC, released on March 21, 2000 by Jive Records. Looking to distinguish their music from that of their labelmates, its music incorporates pop and R&B styles. Prior to the release of the album, NSYNC separated from their management Trans Continental and their label RCA Records; its title is a play on the idea of independence from corporate control.',
    cost: 15,
    quantity_available: 3
  }

  var album
  beforeEach(function(){
    album = Album.build(modelBody)
  })

  /**
   * Also, we empty the tables after each spec
   */
  afterEach(function () {
    return Promise.all([
      Album.truncate({ cascade: true })
    ])
  })

  describe('attributes definition', function(){

    /**
     * Your model should have two fields (both required): `title` and `content`.
     *
     * http://docs.sequelizejs.com/en/v3/docs/models-definition/#validations
     */
    it('includes `title`, `cost` and `genre` fields', function () {

      return album.save()
      .then(function (savedAlbum) {
        expect(savedAlbum.title).to.equal('No Strings Attached')
        expect(savedAlbum.cost).to.equal(15)
        expect(savedAlbum.genre).to.equal('Pop')
      })

    })

    it('requires `title`', function () {

      album.title = null

      return album.validate()
      .then(function(result) {
        expect(result).to.be.an.instanceOf(Error)
        expect(result.message).to.contain('title cannot be null')
      })

    })


    it('provides a default data value for artist if none is specified', function() {
      return album.save()
      .then(function(savedAlbum) {
        expect(savedAlbum.artist).to.equal('Not Available')
      })
    })

   it('can handle long `description`', function() {

      var albumDescription = 'WALL-E (stylized with an interpunct as WALL·E) is a 2008 American computer-animated science-fiction comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. Directed by Andrew Stanton, the story follows a robot named WALL-E, who is designed to clean up an abandoned, waste-covered Earth far in the future. He falls in love with another robot named EVE, who also has a programmed task, and follows her into outer space on an adventure that changes the destiny of both his kind and humanity. Both robots exhibit an appearance of free will and emotions similar to humans, which develop further as the film progresses.';

      return Album.create({
        title: 'Bad',
        artist: 'Michael Jackson',
        description: albumDescription,
        cost: 100
      })
      .then(function(result) {
        expect(result).to.be.an('object');
        expect(result.artist).to.equal('Michael Jackson');
        expect(result.description).to.equal(albumDescription);
      });
    })
  })
})
