import {useState, useEffect} from 'react'
import {supabase} from '../client'

export function ClimbEntry() {
  const [climbs, setClimbs] = useState([])
  const [climb, setClimb] = useState({ name: "", grade: "", rating: "", location_name: ""})
  const {name, grade, rating, location_name} = climb
  const [crags, setCrags] = useState([])
  const [gradeMod, setGradeMod] = useState({grade: "", mod: ""})

  //use effect stuff
  useEffect(() => {
    fetchClimbs()
    fetchCrags()
  }, [])

  //fetching climbs normal things
  async function fetchClimbs() {
    const { data } = await supabase 
      .from('climbs')
      .select()
    setClimbs(data)
    //console.log("data: ", data) //saving incase i need this
  }

  async function createClimb() {
    await supabase
      .from('climbs')
      .insert([
        {name, grade, rating, location_name}
      ])
      .single()
      Reset()
      setClimb({ name: "", grade: "", rating: "", location_name: ""})
      setGradeMod({grade: ""})
      fetchClimbs()
  }

  async function fetchCrags() {
    const { data } = await supabase 
      .from('crags')
      .select()
    setCrags(data)
    //console.log("data: ", data) //just in case
  }

  function Reset() {
    document.getElementById("reset1").selectedIndex = ""
    document.getElementById("reset2").selectedIndex = ""
    document.getElementById("reset3").selectedIndex = ""
  }

  return (
    <div className="ClimbEntry container is-max-desktop">
      <h1 className='title'>Climb Entry</h1>
      <div className='field'>
        <label className="label">Climb Name</label>
        <input
          className="input"
          placeholder="Climb Name"
          value={name}
          onChange={e => setClimb({ ...climb, name: e.target.value})}
        />
      </div>
      
      {/* get grade guy guy */}
      <div className='field'>

        {/* first part of grade */}
        <label className="label">Grade</label>
        <div className="select">
          <select 
              onChange={e => {
                //had to do this big ass if statement because gradeMod shows undefined when unchanging modifier
                setGradeMod({ ...gradeMod ,grade: e.target.value}); 
                if (gradeMod.mod == null) {
                  setClimb({ ...climb ,grade: "V"+e.target.value});
                } else {
                  setClimb({ ...climb ,grade: "V"+e.target.value+gradeMod.mod});
                }
              }}
              id="reset1"
          >
            <option value="">Select Grade</option>
            {
              [...Array(18).keys()].map( arr => (
                <option key={arr} value={arr}>V{arr}</option>
              ))
              //fancy way of making an array from 0-17
            }
          </select>
        </div>

        {/* awesome grade modifier selecter  */}
        <div className="select">
          <select 
            onChange={e => {setGradeMod({ ...gradeMod ,mod: e.target.value}); setClimb({ ...climb ,grade: "V"+gradeMod.grade+e.target.value})}}
            disabled={gradeMod.grade===""}
            id="reset2"
            defaultValue=""
          >
            <option value=""></option>
            <option value="-">-</option>
            <option value="+">+</option>
            <option value={"/"+(parseInt(gradeMod.grade)+1)}>{"/"+(parseInt(gradeMod.grade)+1)}</option>
          </select>
        </div>
      </div>
      
      {/* rating system guy */}
      <div className='field'>
      <label className="label">Rating</label>
        <input
          className="input"
          placeholder="Rating"
          value={rating}
          onChange={e => setClimb({ ...climb, rating: e.target.value})}
        />
      </div>
      
      {/* location name stuff */}
      <div className='field'>
        <label className="label">Location Name</label>
        <div className="select">
          <select 
            onChange={e => setClimb({ ...climb, location_name: e.target.value})}
            id="reset3"
          >
            <option value="">Select Location</option>
            {
              crags.map(crag => (
                <option key={crag.id} value={crag.name}>{crag.name}</option>
              ))
            }
          </select>
        </div>
      </div>
      
      <button onClick={createClimb} className="button is-primary" disabled={climb.location_name===""&&climb.grade===""}>Create Climb</button>
      {
        climbs.map(climb => (
          <div key={climb.id}>
            <h3>{climb.name} {climb.grade} {"★".repeat(climb.rating)}</h3>
          </div>
        ))
      }

    </div>
  );
}