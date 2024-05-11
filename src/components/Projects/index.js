import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStausContainer = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initail: 'INITAIL',
}

class Projects extends Component {
  state = {
    apiStatus: apiStausContainer.success,
    activeOption: categoriesList[0].id,
    projectList: [],
  }

  componentDidMount() {
    this.getProjcetDeails()
  }

  getProjcetDeails = async () => {
    this.setState({apiStatus: apiStausContainer.inProgress})
    const {activeOption} = this.state
    const apiUrl = ` https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const option = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, option)
    const data = await response.json()
    if (response.ok === true) {
      const fetchIngData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectList: fetchIngData,
        apiStatus: apiStausContainer.success,
      })
    } else {
      this.setState({apiStatus: apiStausContainer.failure})
    }
  }

  renderProjcetSuccess = () => {
    const {projectList} = this.state
    return (
      <ul className="success-container">
        {projectList.map(eachProject => (
          <li className="project-lists" key={eachProject.id}>
            <div className="project-details">
              <img
                src={eachProject.imageUrl}
                alt={eachProject.name}
                className="project-image"
              />
              <p className="project-para">{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  onRetryButton = () => {
    this.getProjcetDeails()
  }

  renderProjectFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <div className="failure-text">
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="retry-button"
          type="button"
          onClick={this.onRetryButton}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderProjectLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderProjectsDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStausContainer.success:
        return this.renderProjcetSuccess()
      case apiStausContainer.failure:
        return this.renderProjectFailure()
      case apiStausContainer.inProgress:
        return this.renderProjectLoader()
      default:
        return null
    }
  }

  onChangeSelect = event => {
    this.setState({activeOption: event.target.value}, this.getProjcetDeails)
  }

  render() {
    const {activeOption} = this.state
    return (
      <div className="project-container">
        <Header />
        <div className="project-details">
          <select
            value={activeOption}
            onChange={this.onChangeSelect}
            className="project-list"
          >
            {categoriesList.map(eachItem => (
              <option
                key={eachItem.id}
                value={eachItem.id}
                className="list-item"
              >
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjectsDetails()}
      </div>
    )
  }
}

export default Projects
