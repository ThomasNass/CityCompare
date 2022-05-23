import react from "react";
import CityContext from "../context/city-context.js";
import Button from "./button";
import JobExtraInfo from "./job-extra-info.jsx";

export default class Jobs extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            showJob: false,
        }
    }

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (
            <>
                <h2>{city.name}</h2>
                <h2>{city.jobs.total.value}</h2>
                <Button id={"job-button"} onClick={() => this.setState({ showJob: !this.state.showJob })} text={(this.state.showJob) ? "Dölj lediga jobb" : "Visa lediga jobb"}></Button>
                {(this.state.showJob)
                    ?
                    city.jobs.hits.map((hit) =>
                        <JobExtraInfo key={hit.id} hit={hit} />
                    )
                    :
                    null
                }

            </>
        )
    }
}