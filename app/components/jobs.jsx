import react from "react";
import Button from "./button";

export default class Jobs extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            showJob: false
        }
    }

    // flipBool = () => {
    //     this.setState({ showJob: true });
    // }

    render() {

        return (
            <>
                <h2>{this.props.cityName}</h2>
                <h2>{this.props.jobs.total.value}</h2>
                <Button id={"job-button"} onClick={() => this.setState({ showJob: !this.state.showJob })} text={(this.state.showJob) ? "Dölj lediga jobb" : "Visa lediga jobb"}></Button>
                {(this.state.showJob)
                    ?
                    this.props.jobs.hits.map((hit) => (

                        <div className="job-hit-div">

                            <h2>{hit.headline}</h2>
                            <h3>Typ av tjänst: {hit.occupation_group.label}</h3>
                            <h3>Anställare: {hit.employer.name}</h3>
                            <p>Beskrivning: {hit.brief}</p>
                            <p>Sök här: <a href={hit.source_links[0].url}>{hit.source_links[0].url}</a> </p>
                        </div>
                    ))
                    :
                    null}
            </>
        )
    }
}