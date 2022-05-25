import react from "react";
import CityContext from "../context/city-context.js";
import Button from "./button";
import JobExtraInfo from "./job-extra-info.jsx";
import occupations from "../occupations.json"
import { jobsByField } from "../services/api-caller.js";


export default class Jobs extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            showJob: false,
            selectValue: "",
            city: {},
            updating: false
        }
    }

    handleChange = async (e) => {
        this.setState({ selectValue: e.target.value })
        if (!this.state.city.length > 0) {
            this.setState({ showJob: false })
            this.setState({ updating: true })
            const jobs = await jobsByField([e.target.value], [this.context[this.props.city].id]);
            console.log(jobs)
            let city = {}
            city.name = this.context[this.props.city].name
            city.jobs = jobs;

            this.setState({ city }, () => console.log(this.state.city))
            this.setState({ updating: false })
        }
    }

    static contextType = CityContext
    render() {
        let city;
        if (!this.state.selectValue.length > 0) {
            city = this.context[this.props.city]
        }
        else {
            city = this.state.city;
        }
        return (
            <>{(!this.state.updating) ?


                <>{("total" in city.jobs) ?
                    <>
                        <h2>{city.name}</h2>
                        <select value={this.state.selectValue} onChange={this.handleChange}>
                            <option value={""}>Utan filter</option>
                            {occupations.map((occupation) =>
                                <option key={occupation["taxonomy/id"]} value={occupation["taxonomy/id"]}>{occupation["taxonomy/preferred-label"]}</option>
                            )}
                        </select>
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


                    </> :
                    <p>Det gick inte att hämta jobbdata</p>

                }
                </>
                :
                <p>uppdaterar</p>
            }
            </>
        )
    }
}