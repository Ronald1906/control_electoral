import React from 'react'
import {Bar, BarChart, Cell,CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

const BarListas = ({ data }) => {

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#3ba000','#006ba0','#d4c716','#9516d4', '#16bed4','#d48216','#a1d416','#1649d4'];  


  return (
    <div>
      <ResponsiveContainer width={"100%"}  aspect={2.5}>
        <BarChart 
          data={data} 
          isAnimationActive={false}
          layout='horizontal'
          barCategoryGap={1}
          height={300}
          margin={{
            top:50,
            right:10,
            left:10,
            bottom:5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis padding={{ left: 100 }} dataKey="num_lista" axisLine={false} tickLine={false}  />
          <YAxis type="number" />
          <Tooltip />              
          <Bar dataKey='total'  fill='#00009d' label={{ position: 'top' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarListas
