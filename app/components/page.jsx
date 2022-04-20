import cities from '../mock-cities.json'
import { Table } from './table.jsx';
import SearchForm from './search-form.jsx';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: cities

        }
    }
    render() {
        const town1 = this.state.cities[0].City;
        const town2 = this.state.cities[1].City;
        const buisnesses1 = town1[1].buisness;
        const buisnesses2 = town2[1].buisness;
        console.log(buisnesses1);
        return <div>
            <SearchForm town1={town1} town2={town2} />
            <Table city1={buisnesses1} city2={buisnesses2} />
        </div>


    }
}