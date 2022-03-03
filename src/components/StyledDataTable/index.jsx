import React, { useRef } from 'react'
import styled from 'styled-components'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table'
import Spinner from 'react-svg-spinner'

import { ArrowUpwardOutline } from '@styled-icons/evaicons-outline/ArrowUpwardOutline'
import { ArrowDownwardOutline } from '@styled-icons/evaicons-outline/ArrowDownwardOutline'
import useWallet from 'hooks/useWallet'

import GlobalFilter from 'components/StyledDataTable/components/GlobalFilter'
import Pagination from 'components/StyledDataTable/components/Pagination'
import Label from 'components/Label'
import Spacer from 'components/Spacer'
import StyledIconButton from 'components/StyledIconButton'
import WalletListModal from 'components/WalletListModal'
import useModal from 'hooks/useModal'
import { EXPLORER_FILTER } from 'monox/constants'

const defaultPropGetter = () => ({})

const StyledDataTable = ({
  columns,
  data,
  justify,
  searchTxt,
  setSearchTxt,
  pagination = false,
  sort = true,
  isFiltering = false,
  loading = false,
  sortOptions = {},
  striped = true,
  hoverable = false,
  withOutPagePagination = false,
  padding = 10,
  name,
  isAnalytics,
  tab,
}) => {
  const ref = useRef(null)

  const { chainId } = useWallet()
  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    getColumnProps = defaultPropGetter,
    getHeaderProps = defaultPropGetter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, ...sortOptions },
      disableSortBy: !sort,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const [handleConnectClick] = useModal(<WalletListModal />)
  return (
    <>
      {isFiltering && (
        <GlobalFilter globalFilter={searchTxt} setGlobalFilter={setSearchTxt} />
      )}
      <Container>
        <TableContainer
          ref={ref}
          justify={justify}
          striped={striped}
          hover={hoverable}
          padding={padding}
          chainId={chainId}
          loading={loading ? 1 : 0}
        >
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => {
                const {
                  key,
                  ...restHeaderGroups
                } = headerGroup.getHeaderGroupProps()
                return (
                  <tr {...restHeaderGroups} key={key}>
                    <th />
                    {headerGroup.headers.map((column) => {
                      const className = column.isSorted
                        ? 'cell-sort-active'
                        : ''
                      const { key, ...restHeaderProps } = column.getHeaderProps(
                        column.getSortByToggleProps([
                          {
                            className: className,
                            style: column.style,
                          },
                          getColumnProps(column),
                          getHeaderProps(column),
                        ])
                      )
                      return (
                        <th {...restHeaderProps} key={key}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDownIcon />
                              ) : (
                                <ArrowUpIcon />
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </th>
                      )
                    })}
                    <th />
                  </tr>
                )
              })}
            </thead>
            {chainId && !loading ? (
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row)
                  const { key, ...restRowProps } = row.getRowProps()
                  return (
                    <tr {...restRowProps} key={key}>
                      <td />
                      {row.cells.map((cell) => {
                        const { key, ...restCellProps } = cell.getCellProps()
                        return (
                          <td {...restCellProps} key={key}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                      <td />
                    </tr>
                  )
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="table-cell-loading"
                  >
                    {loading && chainId ? (
                      <Spinner size="60px" thickness={2} color="#2dc48f" />
                    ) : (
                      <>
                        <Label
                          size={16}
                          text={`Please connect your wallet to view ${
                            name
                              ? EXPLORER_FILTER[name]?.name
                              : isAnalytics
                              ? ' the transactions'
                              : 'farms'
                          }`}
                          opacity={0.2}
                          weight={800}
                          style={{ width: 'fit-content', margin: 'auto' }}
                        />
                        <Spacer />
                        <Center>
                          <StyledIconButton
                            onClick={handleConnectClick}
                            icon="arrow"
                            variant="primary"
                            block
                            style={{ height: '42px' }}
                          >
                            Connect Wallet
                          </StyledIconButton>
                        </Center>
                        <Spacer />
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </TableContainer>
        {(pagination || withOutPagePagination) && chainId && !loading && (
          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            pageCount={pageCount}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            setPageSize={setPageSize}
            pageIndex={state.pageIndex}
            pageSize={state.pageSize}
            withOutPagePagination={withOutPagePagination}
            page={page}
            totalRecords={data.length}
          />
        )}
      </Container>
    </>
  )
}
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.main};
  border-radius: 21px;
  border: solid 1px #dce2eb;
  padding: 25px 0;
`
const Center = styled.div`
  width: 300px;
  margin: auto;
`

const TableContainer = styled.div`
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  table {
    border-spacing: 0;
    width: 100%;
    tr:hover {
      td {
        background-color: ${(props) =>
          props.hover &&
          props.chainId &&
          !props.loading &&
          'rgba(65, 222, 162, 0.05)'};
        :first-child {
          border-left: ${(props) =>
            props.hover &&
            props.chainId &&
            !props.loading &&
            `3px solid ${props.theme.color.font.green}`};
        }
      }
    }
    tr {
      .table-cell-loading {
        text-align: center;
      }
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      :nth-child(even) {
        background-color: ${(props) =>
          props.striped && 'rgba(45, 196, 143, 0.05)'};
        td {
          border-bottom: solid 1px rgba(33, 45, 99, 0.15);
          border-top: ${(props) => !props.striped && 'solid 1px #ffffff'};
        }
      }
      :nth-child(odd) {
        td {
          border-top: solid 1px #ffffff;
          border-bottom: ${(props) =>
            !props.striped && 'solid 1px rgba(33, 45, 99, 0.15)'};
        }
      }

      td {
        :first-child {
          border-top-left-radius: ${(props) => !props.hover && '20px'};
          border-bottom-left-radius: ${(props) => !props.hover && '20px'};
          border: 0;
        }
        :last-child {
          border-top-right-radius: ${(props) => !props.hover && '20px'};
          border-bottom-right-radius: ${(props) => !props.hover && '20px'};
          border: 0;
        }
      }
    }

    th {
      opacity: 0.5;
      font-size: 13px;
      transition: all 0.25s ease-out;
      :hover {
        opacity: 1;
      }
      font-weight: 800;
      color: ${({ theme }) => theme.color.secondary.main};
      text-align: left;
      padding: 18px 5px;
      border-bottom: solid 1px rgba(33, 45, 99, 0.15);
      :first-child,
      :last-child {
        width: 2%;
        border: 0;
      }
    }

    td {
      margin: 0;
      padding: 18px 5px;
      text-align: left;
      vertical-align: ${(props) => props.justify ?? 'top'};

      :last-child {
        border-right: 0;
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  table {
    th,td {
      padding: 18px 10px;
    }
  }
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
  table {
    th,td {
      padding: 18px 15px;
    }
  }
  `}
   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  table {
    tr{
      .table-cell-loading{
        text-align:left;
        padding-left:5rem
      }
    }
  }
  `}
`
const ArrowDownIcon = styled(ArrowDownwardOutline)`
  width: 18px;
  height: 18px;
  margin-top: -5px;
  margin-left: 5px;
`
const ArrowUpIcon = styled(ArrowUpwardOutline)`
  width: 18px;
  height: 18px;
  margin-top: -5px;
  margin-left: 5px;
`

export default StyledDataTable
