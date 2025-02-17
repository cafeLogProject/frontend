import { useFollowApi } from "@/shared/api/follow/followApi";
import { Tabs } from "@/shared/ui/tabs/Tabs";
import { Tab } from "@/shared/ui/tabs/types";
import { FollowList } from "@/widgets/followList";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FollowListPage = () => {
	const { id } = useParams(); 
	const navigate = useNavigate(); 
	const [activeTab, setActiveTab] = useState<string>("follower");
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
          // <div className={styles.cafeListContainer}>
              <FollowList userList={followerList} onUserSelect={handleUserSelect} />
          // </div>
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
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			{renderContent()}
		</div>
	);
}

export default FollowListPage;