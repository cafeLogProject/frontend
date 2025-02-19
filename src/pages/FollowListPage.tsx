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
	const {useFollowerList, useFollowingList} = useFollowApi();
	const [lastFollowId, setLastFollowId] = useState<number|undefined>(undefined);
	const [lastFollowingId, setLastFollowingId] = useState<number|undefined>(undefined);
	const {data: followerList, refetch: refetchFollowerList} = useFollowerList(Number(id), { 
		limit : 10,
		cursor : lastFollowId? lastFollowId : null,
	})
	const {data: followingList, refetch: refetchFollowingList} = useFollowingList(Number(id), { 
		limit : 10,
		cursor : lastFollowingId? lastFollowingId : null,
	})

	useEffect(() => {
		switch (activeTab) {
			case "follower":
				setLastFollowId(undefined);			// 스크롤 리셋
				refetchFollowerList();
				break;
			case "following":
				setLastFollowingId(undefined);			// 스크롤 리셋
				refetchFollowingList();
				break;
		}
	}, [activeTab]);

	const handleUserSelect = (userId : number) => {
		navigate(`/userpage/${userId}`);
	}

	const renderContent = () => {
    switch (activeTab) {
      case "follower":
        return (
            <FollowList userList={followerList} onUserSelect={handleUserSelect} />
        );
      case "following":
        return (
			<FollowList userList={followingList} onUserSelect={handleUserSelect} />
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