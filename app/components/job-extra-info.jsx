import react from "react";
import Button from "./button";

export default class JobExtraInfo extends react.Component {
    constructor(props) {
        super(props)
        this.state = {
            extra: false
        }
    }

    render() {
        const hit = this.props.hit;
        return (


            <div className="job-hit-div">

                <h2>{hit.headline} <Button id={"job-extra"} onClick={() => this.setState({ extra: !this.state.extra })} text={(this.state.extra) ? "Dölj" : "Visa"}></Button></h2>

                {(this.state.extra) ?
                    <>
                        <h3>Typ av tjänst: {hit.occupation_group.label}</h3>
                        <h3>Anställare: {hit.employer.name}</h3>
                        <h4>{hit.brief}</h4>
                        <p><a href={hit.source_links[0].url} target="_blank"><Button id={"job-button"} text={"Sök här"} /></a> </p>

                    </>
                    :
                    null
                }
            </div>

        )
    }
}