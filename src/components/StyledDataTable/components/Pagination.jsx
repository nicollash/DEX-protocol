import React from 'react'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'

import { ArrowIosBackOutline } from '@styled-icons/evaicons-outline/ArrowIosBackOutline'
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline/ArrowIosForwardOutline'

import { Row } from 'components/Row'
import Label from 'components/Label'

const Pagination = ({
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  pageIndex,
  pageSize,
  withOutPagePagination,
  page,
  totalRecords,
}) => {
  const handleGotoPage = ({ selected }) => {
    gotoPage(selected)
  }

  return (
    <>
      {withOutPagePagination ? (
        <Row style={{ justifyContent: 'flex-end', padding: '25px 25px 0 0' }}>
          <Label
            text={`${pageIndex * pageSize + 1}-${
              page.length + pageSize * pageIndex
            } of ${totalRecords}`}
            size="13"
            weight="800"
          />
          <PreviousIcon
            pageCount={pageCount}
            pageIndex={pageIndex}
            onClick={previousPage}
            style={{ margin: '0 40px' }}
          />
          <NextIcon
            pageCount={pageCount}
            pageIndex={pageIndex}
            onClick={nextPage}
          />
        </Row>
      ) : (
        <ReactPaginate
          previousLabel={
            <PreviousIcon pageCount={pageCount} pageIndex={pageIndex} />
          }
          nextLabel={<NextIcon pageCount={pageCount} pageIndex={pageIndex} />}
          pageCount={pageCount}
          onPageChange={handleGotoPage}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          forcePage={pageIndex}
        />
      )}
    </>
  )
}

const PreviousIcon = styled(ArrowIosBackOutline)`
  color: ${(props) => props.theme.color.primary.main};
  opacity: ${(props) => props.pageIndex < 1 && '0.3'};
  height: 24px;
  width: 24px;
  cursor: pointer;
`

const NextIcon = styled(ArrowIosForwardOutline)`
  color: ${(props) => props.theme.color.primary.main};
  opacity: ${(props) => props.pageIndex === props.pageCount - 1 && '0.3'};
  height: 24px;
  width: 24px;
  cursor: pointer;
`
export default Pagination
