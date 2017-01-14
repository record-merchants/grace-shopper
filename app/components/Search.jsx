import React from 'react'
import {Component} from 'react'

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      inputValue: ""
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({
      inputValue: event.target.value
    }, () => {
      const findFilteredAlbums = this.props.findFilteredAlbums;
      const allAlbums = this.props.allAlbums;
      const filteredAlbumsfromState = this.props.filteredAlbums
      const inputValue = this.state.inputValue

      let filtered = allAlbums.filter(album => album.title.match(inputValue))
      console.log('INPUTVALUE', inputValue)
      console.log('FILTERED', filtered)
      // console.log(filtered)
      if (filtered) {
        console.log('FILTERING!!!')
        // console.log(filtered)
        findFilteredAlbums(filtered)
      }
    })
  }

  render(){
    return (
        <form onSubmit={evt => {
          evt.preventDefault()
          search(evt.target.search.value)
        } }>
          <input name="search" onChange={this.handleChange} value={this.state.inputValue}/>
          <input type="submit" value="Search" />
        </form>
    )
  }
}



import {connect} from 'react-redux'
import {filterAlbums} from '../reducers/AllAlbumsReducer'
// const findAlbums = (allAlbums) => {
//   return {
//     type: 'GET_ALBUMS',
//     allAlbums
//   }
// }

const mapDispatchToProps = (dispatch) => {
  return {
    findFilteredAlbums: filtered => {
      const action = filterAlbums(filtered)
      dispatch(action)
    }
  }
}

export default connect (state => ({
  allAlbums: state.albums.allAlbums,
  filteredAlbums: state.albums.filteredAlbums
}), mapDispatchToProps) (Search)