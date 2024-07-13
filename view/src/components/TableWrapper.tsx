import { Pagination, Table } from "@mantine/core"

// @ts-ignore
export const TableWrapper = ({ thead }) => {

  return <Table striped highlightOnHover withBorder withColumnBorders>
    <thead>
      <tr>
        {
          thead.map((head: string) => <td key={head}>{head}</td>)
        }
      </tr>
    </thead>
    <tbody>
      {
        // @ts-ignore 
        tbody.map((head: string) => <td key={head}>{head}</td>)
      }
    </tbody>
    {/* {...rows} */}
  </Table>
}

export const PaginateTableWrapper = () => {

  return (
    <>
      <div className="bg-sky-500 w-full ">
        <Pagination
          total={10}
          position="center"
          styles={(theme) => ({
            control: {
              '&[data-active]': {
                backgroundImage: theme.fn.gradient({ from: 'red', to: 'yellow' }),
                border: 0,
              },
            },
          })}
        />
      </div>


    </>
  )
} 
