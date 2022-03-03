import React from 'react'
import styled from 'styled-components'
import Label from 'components/Label'
import useCoinsInfo from 'hooks/useCoinsInfo'
import TweetIcon from 'assets/img/twitterIcon.svg'
import TokenImage from 'components/TokenImage'
import Divider from 'components/Divider'
import Spacer from 'components/Spacer'

const TweetCard = ({ token }) => {
  const { tweets } = useCoinsInfo(token)
  if (!tweets.length) {
    return null
  }

  const getTweetUsername = (tweet) => {
    const { link } = tweet
    return link.split('/')[3]
  }

  return (
    <Card>
      <ScrollView>
        {tweets.map((tweet, index) => (
          <React.Fragment key={index}>
            <Tweet>
              <TweetHeader>
                <HeaderInfo>
                  {tweet.thumbnail ? (
                    <Avatar src={tweet.thumbnail} />
                  ) : (
                    <TokenImage
                      width="42"
                      height="42"
                      src={null}
                      style={{ marginRight: 18 }}
                      letter={tweet.username[0]}
                    />
                  )}
                  <Column>
                    <Label size="15" weight="800" text={tweet.name} />
                    {!!tweet.link && (
                      <Link href={tweet.link} target="_blank">
                        @{getTweetUsername(tweet)}
                      </Link>
                    )}
                  </Column>
                </HeaderInfo>
                <Link href={tweet.link} target="_blank">
                  <TweetBtn>
                    <img src={TweetIcon} alt="Tweet Icon" />
                  </TweetBtn>
                </Link>
              </TweetHeader>
              <TweetContent>{tweet.tweet}</TweetContent>
            </Tweet>
            <Spacer size="sm" />
            <Divider />
            <Spacer size="sm" />
          </React.Fragment>
        ))}
      </ScrollView>
    </Card>
  )
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  padding-right: 20px;
  padding-bottom: 40px;
  max-height: 490px;
  box-sizing: border-box;
  object-fit: contain;
  border-radius: 39px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  background-color: ${({ theme }) => theme.color.background.main};
`

const ScrollView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(33, 45, 99, 0.12);
    border-radius: 10px;
  }
`

const Tweet = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const TweetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const TweetBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  box-shadow: 8px 8px 20px 0 #d0d8e6, -8px -8px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 18px;
`
const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`
const TweetContent = styled.div`
  font-weight: bold;
  font-size: 13px;
  opacity: 0.5;
  color: #212d63;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Link = styled.a`
  font-weight: 800;
  font-size: 12px;
  opacity: 0.5;
  color: #212d63;
  text-decoration: none;
`

export default TweetCard
