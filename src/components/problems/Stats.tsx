import '../../styles/Problems.css'
import { ProblemInterface } from './Problem';
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';


interface Props{
    filteredProblems: ProblemInterface[];
    problems: ProblemInterface[];
    search: string;
    categories: object[];
}

const Stats = ({filteredProblems, problems, search, categories}: Props) => {
    const [fP, setFP] = useState(problems);
    const [allVsSolved, setAllVsSolved] = useState<object[]>();

    useEffect(() => {
        if(search.length > 0)
          setFP(problems.filter((problem) => categoryFilterFunction(problem) && (problem.title.toLowerCase().includes(search.toLowerCase()) || problem.description.toLowerCase().includes(search.toLowerCase()))));
        else
          setFP(problems.filter((problem) => categoryFilterFunction(problem)));
    }, [search, categories]);

    useEffect(() => {
        const tempList = fP.toSorted((a, b) => b.epoch - a.epoch).map((problem, index) => { return {time: problem.epoch, allSum: index, solved: problem.solved}; });
        setAllVsSolved(tempList.map((problem) => { return {solvedSum: tempList.filter((p) => p.allSum <= problem.allSum && p.solved ).length, ...problem}; }));
    }, [fP]);

    const getFilteredSum = () => {
        return filteredProblems.toSorted((a, b) => b.epoch - a.epoch).map((problem, index) => { return {time: problem.epoch, sum: index}; })
    }

    const categoryFilterFunction = (problem: ProblemInterface) => {
        if(categories.length == 0)
          return true;
        
        if(problem.category == null){
          if(categories.some((option: any) => option.name == 'Other'))
            return true;
          return false;
        }
    
        return categories.some((option: any) => option.name == problem.category);
    }

    return (
        <div>
        <ResponsiveContainer width={'60%'} height={350} minWidth={800}>
            <LineChart
            
            height={500}
            data={getFilteredSum()}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" scale={'time'} tick={false} />
            <YAxis />
            <Legend />
            <Line type="monotone" dataKey="sum" stroke="#8884d8" dot={false} strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>
        

        <ResponsiveContainer width={'60%'} height={350} minWidth={800}>
            <LineChart
            data={allVsSolved}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" scale={'time'} tick={false} />
            <YAxis />
            <Legend />
            <Line type="monotone" dataKey="allSum" stroke="#8884d8" dot={false} strokeWidth={2}/>
            <Line type="monotone" dataKey="solvedSum" stroke="#82ca9d" dot={false} strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>        
        </div>
    );
};

export default Stats;