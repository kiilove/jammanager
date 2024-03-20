import React from "react";
import { Typography } from "antd";
const { Title, Text } = Typography;
const AssetUserAgreementPolicy = () => {
  return (
    <div className="flex w-full h-full p-1 flex-col">
      <Title level={5}>자산 사용 목적</Title>
      <Text>1. 업무 효율성 증진:</Text>
      <Text className="ml-5">
        해당 자산은 업무 수행의 효율성과 생산성을 증진하기 위해 제공됩니다.
        <br />
        사용자는 자산을 업무 관련 목적으로만 사용해야 합니다.
      </Text>

      <Title level={5}>사용 조건</Title>
      <Text>1. 정해진 사용자만 사용: </Text>
      <Text className="ml-5">
        자산은 지정된 사용자 또는 부서에 의해서만 사용되어야 합니다. 무단으로
        타인에게 양도하거나 공유할 수 없습니다.
      </Text>
      <Text>2. 정해진 위치에서 사용:</Text>
      <Text className="ml-5">
        특정 자산은 지정된 위치에서만 사용해야 합니다. 이동이 필요한 경우
        관리부서의 승인을 받아야 합니다.
      </Text>
      <Text>3. 유지보수 및 점검: </Text>
      <Text className="ml-5">
        사용자는 제공된 자산을 적절히 유지하고, 정기적으로 점검해야 합니다.
        고장이나 손상이 발생했을 경우 즉시 보고해야 합니다.
      </Text>
      <Text>4. 보안 유지: </Text>
      <Text className="ml-5">
        자산에 저장된 정보의 보안을 유지해야 하며, 무단으로 외부에 정보를
        유출해서는 안 됩니다. 필요한 보안 소프트웨어의 설치 및 업데이트를
        유지해야 합니다.
      </Text>
      <Text>5. 규정 및 법규 준수: </Text>
      <Text className="ml-5">
        모든 자산 사용은 회사의 내부 규정 및 관련 법규를 준수하면서 이루어져야
        합니다.
      </Text>
    </div>
  );
};

export default AssetUserAgreementPolicy;
