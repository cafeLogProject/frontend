import MainLayout from "@/app/layout/mainLayout/MainLayout";
import { useFollowApi } from "@/shared/api/follow/followApi";
import { useUserApi } from "@/shared/api/user/userApi";
import { Tabs } from "@/shared/ui/tabs/Tabs";
import { Tab } from "@/shared/ui/tabs/types";
import { FollowList } from "@/widgets/followList";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FollowListPage = () => {
	const { tabType, id } = useParams(); 
	const { useUserInfo } = useUserApi();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo(Number(id));
	if (tabType !== "follower" && tabType !== "following") {
		console.log(tabType);
		throw new Error("잘못된 tabType값 입니다");
	}
	if (!id) throw new Error("id값이 없습니다");
	const navigate = useNavigate(); 
	const [activeTab, setActiveTab] = useState<string>(tabType);
	const tabs: Tab[] = [
		{ id: "follower", label: "팔로워" },
		{ id: "following", label: "팔로잉" },
	];  

	//------------------useInfiniteQuery를 이용한 버전 ----------------------------
	const {useFollowerList, useFollowingList} = useFollowApi();
	const {data: followerList, fetchNextPage: fetchFollowerNextPage, hasNextPage: hasFollowerNexPage, refetch: refetchFollowerList, isLoading: isFollowerLoading} = useFollowerList(Number(id), { limit : 20 });
	const {data: followingList, fetchNextPage: fetchFollowingNextPage, hasNextPage: hasFollowingNexPage,refetch: refetchFollowingList, isLoading: isFollowingLoading} = useFollowingList(Number(id), { limit : 20 });

	useEffect(() => {
		switch (activeTab) {
			case "follower":
				refetchFollowerList();					// 무한 스크롤 리셋
				break;
			case "following":
				refetchFollowingList();					// 무한 스크롤 리셋
				break;
		}
	}, [activeTab]);

	//-----------------------------------------------

	const handleUserSelect = (userId : number) => {
		navigate(`/userpage/${userId}`);
	}

	const renderContent = () => {
    switch (activeTab) {
      case "follower":
        return (
        	<FollowList 
						userList={followerList?.pages.flat() ?? undefined} 
						onUserSelect={handleUserSelect} 
						onLoadMore={()=> fetchFollowerNextPage()}
						hasNextPage={hasFollowerNexPage}
						isLoading={isFollowerLoading}
					/>
        );
      case "following":
        return (
					<FollowList 
						userList={followingList?.pages.flat()} 
						onUserSelect={handleUserSelect} 
						onLoadMore={()=>fetchFollowingNextPage()}
						hasNextPage={hasFollowingNexPage}
						isLoading={isFollowingLoading}
					/>
        );
      default:
        return null;
    }
  };

	const handleTabChange = (tabId : string) => {
		setActiveTab(tabId);
	}


	return (
		<div>
			<MainLayout
				showHeader={true}
				showFooter={false}
				showBackButton={true}
				showWriteButton={false}
				headerTitle={`${userInfo?.nickname}`}
			>
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			{renderContent()}
			</MainLayout>
		</div>
	);
}

export default FollowListPage;