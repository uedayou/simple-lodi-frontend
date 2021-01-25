import React from 'react';

import {getLink} from '../../lib/utils';

type Props = {
  bnode: any
}

function Bnode({ bnode }:Props) {
  return (
    <table className='table table-bordered'>
    { bnode && Object.keys(bnode).map((k:string, i:number)=>(
      <tr key={i}>
        <th className="bnode">
          { getLink(bnode[k]) }
        </th>
        <td>
          { bnode[k].map((vo:any, i2:number)=>(
            <div key={i+"-"+i2}>
              { getLink(vo) }
            </div>
          ))}
        </td>
      </tr>
    ))}
    </table>
  );
}

export default Bnode;
