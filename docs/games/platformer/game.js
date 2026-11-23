var ea=Object.defineProperty;var d=(e,r)=>ea(e,"name",{value:r,configurable:!0});var lr=(e,r)=>{for(var t in r)ea(e,t,{get:r[t],enumerable:!0})};var U=1e-6,re=typeof Float32Array<"u"?Float32Array:Array,Xe=Math.random,ta="zyx";function Ve(e){return e>=0?Math.round(e):e%.5===0?Math.floor(e):Math.round(e)}d(Ve,"round");var yf=Math.PI/180,_f=180/Math.PI;var ur={};lr(ur,{add:()=>tu,adjoint:()=>Gc,clone:()=>Dc,copy:()=>kc,create:()=>qn,determinant:()=>zc,equals:()=>ou,exactEquals:()=>nu,frob:()=>eu,fromMat2d:()=>$c,fromMat4:()=>Bc,fromQuat:()=>jc,fromRotation:()=>qc,fromScaling:()=>Yc,fromTranslation:()=>Jc,fromValues:()=>Ic,identity:()=>Nc,invert:()=>Oc,mul:()=>su,multiply:()=>ra,multiplyScalar:()=>ru,multiplyScalarAndAdd:()=>iu,normalFromMat4:()=>Kc,projection:()=>Qc,rotate:()=>Wc,scale:()=>Hc,set:()=>Fc,str:()=>Zc,sub:()=>au,subtract:()=>ia,translate:()=>Vc,transpose:()=>Uc});function qn(){var e=new re(9);return re!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}d(qn,"create");function Bc(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[4],e[4]=r[5],e[5]=r[6],e[6]=r[8],e[7]=r[9],e[8]=r[10],e}d(Bc,"fromMat4");function Dc(e){var r=new re(9);return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r[4]=e[4],r[5]=e[5],r[6]=e[6],r[7]=e[7],r[8]=e[8],r}d(Dc,"clone");function kc(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e[4]=r[4],e[5]=r[5],e[6]=r[6],e[7]=r[7],e[8]=r[8],e}d(kc,"copy");function Ic(e,r,t,i,n,o,s,a,l){var u=new re(9);return u[0]=e,u[1]=r,u[2]=t,u[3]=i,u[4]=n,u[5]=o,u[6]=s,u[7]=a,u[8]=l,u}d(Ic,"fromValues");function Fc(e,r,t,i,n,o,s,a,l,u){return e[0]=r,e[1]=t,e[2]=i,e[3]=n,e[4]=o,e[5]=s,e[6]=a,e[7]=l,e[8]=u,e}d(Fc,"set");function Nc(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}d(Nc,"identity");function Uc(e,r){if(e===r){var t=r[1],i=r[2],n=r[5];e[1]=r[3],e[2]=r[6],e[3]=t,e[5]=r[7],e[6]=i,e[7]=n}else e[0]=r[0],e[1]=r[3],e[2]=r[6],e[3]=r[1],e[4]=r[4],e[5]=r[7],e[6]=r[2],e[7]=r[5],e[8]=r[8];return e}d(Uc,"transpose");function Oc(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],u=r[7],c=r[8],h=c*s-a*u,m=-c*o+a*l,p=u*o-s*l,v=t*h+i*m+n*p;return v?(v=1/v,e[0]=h*v,e[1]=(-c*i+n*u)*v,e[2]=(a*i-n*s)*v,e[3]=m*v,e[4]=(c*t-n*l)*v,e[5]=(-a*t+n*o)*v,e[6]=p*v,e[7]=(-u*t+i*l)*v,e[8]=(s*t-i*o)*v,e):null}d(Oc,"invert");function Gc(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],u=r[7],c=r[8];return e[0]=s*c-a*u,e[1]=n*u-i*c,e[2]=i*a-n*s,e[3]=a*l-o*c,e[4]=t*c-n*l,e[5]=n*o-t*a,e[6]=o*u-s*l,e[7]=i*l-t*u,e[8]=t*s-i*o,e}d(Gc,"adjoint");function zc(e){var r=e[0],t=e[1],i=e[2],n=e[3],o=e[4],s=e[5],a=e[6],l=e[7],u=e[8];return r*(u*o-s*l)+t*(-u*n+s*a)+i*(l*n-o*a)}d(zc,"determinant");function ra(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],u=r[6],c=r[7],h=r[8],m=t[0],p=t[1],v=t[2],f=t[3],g=t[4],b=t[5],M=t[6],_=t[7],w=t[8];return e[0]=m*i+p*s+v*u,e[1]=m*n+p*a+v*c,e[2]=m*o+p*l+v*h,e[3]=f*i+g*s+b*u,e[4]=f*n+g*a+b*c,e[5]=f*o+g*l+b*h,e[6]=M*i+_*s+w*u,e[7]=M*n+_*a+w*c,e[8]=M*o+_*l+w*h,e}d(ra,"multiply");function Vc(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],u=r[6],c=r[7],h=r[8],m=t[0],p=t[1];return e[0]=i,e[1]=n,e[2]=o,e[3]=s,e[4]=a,e[5]=l,e[6]=m*i+p*s+u,e[7]=m*n+p*a+c,e[8]=m*o+p*l+h,e}d(Vc,"translate");function Wc(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],u=r[6],c=r[7],h=r[8],m=Math.sin(t),p=Math.cos(t);return e[0]=p*i+m*s,e[1]=p*n+m*a,e[2]=p*o+m*l,e[3]=p*s-m*i,e[4]=p*a-m*n,e[5]=p*l-m*o,e[6]=u,e[7]=c,e[8]=h,e}d(Wc,"rotate");function Hc(e,r,t){var i=t[0],n=t[1];return e[0]=i*r[0],e[1]=i*r[1],e[2]=i*r[2],e[3]=n*r[3],e[4]=n*r[4],e[5]=n*r[5],e[6]=r[6],e[7]=r[7],e[8]=r[8],e}d(Hc,"scale");function Jc(e,r){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=r[0],e[7]=r[1],e[8]=1,e}d(Jc,"fromTranslation");function qc(e,r){var t=Math.sin(r),i=Math.cos(r);return e[0]=i,e[1]=t,e[2]=0,e[3]=-t,e[4]=i,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}d(qc,"fromRotation");function Yc(e,r){return e[0]=r[0],e[1]=0,e[2]=0,e[3]=0,e[4]=r[1],e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}d(Yc,"fromScaling");function $c(e,r){return e[0]=r[0],e[1]=r[1],e[2]=0,e[3]=r[2],e[4]=r[3],e[5]=0,e[6]=r[4],e[7]=r[5],e[8]=1,e}d($c,"fromMat2d");function jc(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=t+t,a=i+i,l=n+n,u=t*s,c=i*s,h=i*a,m=n*s,p=n*a,v=n*l,f=o*s,g=o*a,b=o*l;return e[0]=1-h-v,e[3]=c-b,e[6]=m+g,e[1]=c+b,e[4]=1-u-v,e[7]=p-f,e[2]=m-g,e[5]=p+f,e[8]=1-u-h,e}d(jc,"fromQuat");function Kc(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],u=r[7],c=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],M=t*a-i*s,_=t*l-n*s,w=t*u-o*s,S=i*l-n*a,T=i*u-o*a,C=n*u-o*l,I=c*f-h*v,k=c*g-m*v,D=c*b-p*v,V=h*g-m*f,$=h*b-p*f,J=m*b-p*g,N=M*J-_*$+w*V+S*D-T*k+C*I;return N?(N=1/N,e[0]=(a*J-l*$+u*V)*N,e[1]=(l*D-s*J-u*k)*N,e[2]=(s*$-a*D+u*I)*N,e[3]=(n*$-i*J-o*V)*N,e[4]=(t*J-n*D+o*k)*N,e[5]=(i*D-t*$-o*I)*N,e[6]=(f*C-g*T+b*S)*N,e[7]=(g*w-v*C-b*_)*N,e[8]=(v*T-f*w+b*M)*N,e):null}d(Kc,"normalFromMat4");function Qc(e,r,t){return e[0]=2/r,e[1]=0,e[2]=0,e[3]=0,e[4]=-2/t,e[5]=0,e[6]=-1,e[7]=1,e[8]=1,e}d(Qc,"projection");function Zc(e){return"mat3("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+")"}d(Zc,"str");function eu(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8])}d(eu,"frob");function tu(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e[3]=r[3]+t[3],e[4]=r[4]+t[4],e[5]=r[5]+t[5],e[6]=r[6]+t[6],e[7]=r[7]+t[7],e[8]=r[8]+t[8],e}d(tu,"add");function ia(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e[2]=r[2]-t[2],e[3]=r[3]-t[3],e[4]=r[4]-t[4],e[5]=r[5]-t[5],e[6]=r[6]-t[6],e[7]=r[7]-t[7],e[8]=r[8]-t[8],e}d(ia,"subtract");function ru(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e[2]=r[2]*t,e[3]=r[3]*t,e[4]=r[4]*t,e[5]=r[5]*t,e[6]=r[6]*t,e[7]=r[7]*t,e[8]=r[8]*t,e}d(ru,"multiplyScalar");function iu(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e[2]=r[2]+t[2]*i,e[3]=r[3]+t[3]*i,e[4]=r[4]+t[4]*i,e[5]=r[5]+t[5]*i,e[6]=r[6]+t[6]*i,e[7]=r[7]+t[7]*i,e[8]=r[8]+t[8]*i,e}d(iu,"multiplyScalarAndAdd");function nu(e,r){return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]&&e[3]===r[3]&&e[4]===r[4]&&e[5]===r[5]&&e[6]===r[6]&&e[7]===r[7]&&e[8]===r[8]}d(nu,"exactEquals");function ou(e,r){var t=e[0],i=e[1],n=e[2],o=e[3],s=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=r[0],m=r[1],p=r[2],v=r[3],f=r[4],g=r[5],b=r[6],M=r[7],_=r[8];return Math.abs(t-h)<=U*Math.max(1,Math.abs(t),Math.abs(h))&&Math.abs(i-m)<=U*Math.max(1,Math.abs(i),Math.abs(m))&&Math.abs(n-p)<=U*Math.max(1,Math.abs(n),Math.abs(p))&&Math.abs(o-v)<=U*Math.max(1,Math.abs(o),Math.abs(v))&&Math.abs(s-f)<=U*Math.max(1,Math.abs(s),Math.abs(f))&&Math.abs(a-g)<=U*Math.max(1,Math.abs(a),Math.abs(g))&&Math.abs(l-b)<=U*Math.max(1,Math.abs(l),Math.abs(b))&&Math.abs(u-M)<=U*Math.max(1,Math.abs(u),Math.abs(M))&&Math.abs(c-_)<=U*Math.max(1,Math.abs(c),Math.abs(_))}d(ou,"equals");var su=ra,au=ia;var E={};lr(E,{add:()=>Ju,adjoint:()=>fu,clone:()=>cu,copy:()=>uu,create:()=>lu,decompose:()=>Pu,determinant:()=>vu,equals:()=>ju,exactEquals:()=>$u,frob:()=>Hu,fromQuat:()=>ku,fromQuat2:()=>Cu,fromRotation:()=>Su,fromRotationTranslation:()=>sa,fromRotationTranslationScale:()=>Bu,fromRotationTranslationScaleOrigin:()=>Du,fromScaling:()=>Tu,fromTranslation:()=>Mu,fromValues:()=>du,fromXRotation:()=>Eu,fromYRotation:()=>Au,fromZRotation:()=>Ru,frustum:()=>Iu,getRotation:()=>Xu,getScaling:()=>aa,getTranslation:()=>Lu,identity:()=>na,invert:()=>pu,lookAt:()=>zu,mul:()=>Ku,multiply:()=>oa,multiplyScalar:()=>qu,multiplyScalarAndAdd:()=>Yu,ortho:()=>Ou,orthoNO:()=>ca,orthoZO:()=>Gu,perspective:()=>Fu,perspectiveFromFieldOfView:()=>Uu,perspectiveNO:()=>la,perspectiveZO:()=>Nu,rotate:()=>xu,rotateX:()=>yu,rotateY:()=>_u,rotateZ:()=>wu,scale:()=>bu,set:()=>hu,str:()=>Wu,sub:()=>Qu,subtract:()=>ua,targetTo:()=>Vu,translate:()=>gu,transpose:()=>mu});function lu(){var e=new re(16);return re!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}d(lu,"create");function cu(e){var r=new re(16);return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r[4]=e[4],r[5]=e[5],r[6]=e[6],r[7]=e[7],r[8]=e[8],r[9]=e[9],r[10]=e[10],r[11]=e[11],r[12]=e[12],r[13]=e[13],r[14]=e[14],r[15]=e[15],r}d(cu,"clone");function uu(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e[4]=r[4],e[5]=r[5],e[6]=r[6],e[7]=r[7],e[8]=r[8],e[9]=r[9],e[10]=r[10],e[11]=r[11],e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15],e}d(uu,"copy");function du(e,r,t,i,n,o,s,a,l,u,c,h,m,p,v,f){var g=new re(16);return g[0]=e,g[1]=r,g[2]=t,g[3]=i,g[4]=n,g[5]=o,g[6]=s,g[7]=a,g[8]=l,g[9]=u,g[10]=c,g[11]=h,g[12]=m,g[13]=p,g[14]=v,g[15]=f,g}d(du,"fromValues");function hu(e,r,t,i,n,o,s,a,l,u,c,h,m,p,v,f,g){return e[0]=r,e[1]=t,e[2]=i,e[3]=n,e[4]=o,e[5]=s,e[6]=a,e[7]=l,e[8]=u,e[9]=c,e[10]=h,e[11]=m,e[12]=p,e[13]=v,e[14]=f,e[15]=g,e}d(hu,"set");function na(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(na,"identity");function mu(e,r){if(e===r){var t=r[1],i=r[2],n=r[3],o=r[6],s=r[7],a=r[11];e[1]=r[4],e[2]=r[8],e[3]=r[12],e[4]=t,e[6]=r[9],e[7]=r[13],e[8]=i,e[9]=o,e[11]=r[14],e[12]=n,e[13]=s,e[14]=a}else e[0]=r[0],e[1]=r[4],e[2]=r[8],e[3]=r[12],e[4]=r[1],e[5]=r[5],e[6]=r[9],e[7]=r[13],e[8]=r[2],e[9]=r[6],e[10]=r[10],e[11]=r[14],e[12]=r[3],e[13]=r[7],e[14]=r[11],e[15]=r[15];return e}d(mu,"transpose");function pu(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],u=r[7],c=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],M=t*a-i*s,_=t*l-n*s,w=t*u-o*s,S=i*l-n*a,T=i*u-o*a,C=n*u-o*l,I=c*f-h*v,k=c*g-m*v,D=c*b-p*v,V=h*g-m*f,$=h*b-p*f,J=m*b-p*g,N=M*J-_*$+w*V+S*D-T*k+C*I;return N?(N=1/N,e[0]=(a*J-l*$+u*V)*N,e[1]=(n*$-i*J-o*V)*N,e[2]=(f*C-g*T+b*S)*N,e[3]=(m*T-h*C-p*S)*N,e[4]=(l*D-s*J-u*k)*N,e[5]=(t*J-n*D+o*k)*N,e[6]=(g*w-v*C-b*_)*N,e[7]=(c*C-m*w+p*_)*N,e[8]=(s*$-a*D+u*I)*N,e[9]=(i*D-t*$-o*I)*N,e[10]=(v*T-f*w+b*M)*N,e[11]=(h*w-c*T-p*M)*N,e[12]=(a*k-s*V-l*I)*N,e[13]=(t*V-i*k+n*I)*N,e[14]=(f*_-v*S-g*M)*N,e[15]=(c*S-h*_+m*M)*N,e):null}d(pu,"invert");function fu(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=r[4],a=r[5],l=r[6],u=r[7],c=r[8],h=r[9],m=r[10],p=r[11],v=r[12],f=r[13],g=r[14],b=r[15],M=t*a-i*s,_=t*l-n*s,w=t*u-o*s,S=i*l-n*a,T=i*u-o*a,C=n*u-o*l,I=c*f-h*v,k=c*g-m*v,D=c*b-p*v,V=h*g-m*f,$=h*b-p*f,J=m*b-p*g;return e[0]=a*J-l*$+u*V,e[1]=n*$-i*J-o*V,e[2]=f*C-g*T+b*S,e[3]=m*T-h*C-p*S,e[4]=l*D-s*J-u*k,e[5]=t*J-n*D+o*k,e[6]=g*w-v*C-b*_,e[7]=c*C-m*w+p*_,e[8]=s*$-a*D+u*I,e[9]=i*D-t*$-o*I,e[10]=v*T-f*w+b*M,e[11]=h*w-c*T-p*M,e[12]=a*k-s*V-l*I,e[13]=t*V-i*k+n*I,e[14]=f*_-v*S-g*M,e[15]=c*S-h*_+m*M,e}d(fu,"adjoint");function vu(e){var r=e[0],t=e[1],i=e[2],n=e[3],o=e[4],s=e[5],a=e[6],l=e[7],u=e[8],c=e[9],h=e[10],m=e[11],p=e[12],v=e[13],f=e[14],g=e[15],b=r*s-t*o,M=r*a-i*o,_=t*a-i*s,w=u*v-c*p,S=u*f-h*p,T=c*f-h*v,C=r*T-t*S+i*w,I=o*T-s*S+a*w,k=u*_-c*M+h*b,D=p*_-v*M+f*b;return l*C-n*I+g*k-m*D}d(vu,"determinant");function oa(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=r[4],l=r[5],u=r[6],c=r[7],h=r[8],m=r[9],p=r[10],v=r[11],f=r[12],g=r[13],b=r[14],M=r[15],_=t[0],w=t[1],S=t[2],T=t[3];return e[0]=_*i+w*a+S*h+T*f,e[1]=_*n+w*l+S*m+T*g,e[2]=_*o+w*u+S*p+T*b,e[3]=_*s+w*c+S*v+T*M,_=t[4],w=t[5],S=t[6],T=t[7],e[4]=_*i+w*a+S*h+T*f,e[5]=_*n+w*l+S*m+T*g,e[6]=_*o+w*u+S*p+T*b,e[7]=_*s+w*c+S*v+T*M,_=t[8],w=t[9],S=t[10],T=t[11],e[8]=_*i+w*a+S*h+T*f,e[9]=_*n+w*l+S*m+T*g,e[10]=_*o+w*u+S*p+T*b,e[11]=_*s+w*c+S*v+T*M,_=t[12],w=t[13],S=t[14],T=t[15],e[12]=_*i+w*a+S*h+T*f,e[13]=_*n+w*l+S*m+T*g,e[14]=_*o+w*u+S*p+T*b,e[15]=_*s+w*c+S*v+T*M,e}d(oa,"multiply");function gu(e,r,t){var i=t[0],n=t[1],o=t[2],s,a,l,u,c,h,m,p,v,f,g,b;return r===e?(e[12]=r[0]*i+r[4]*n+r[8]*o+r[12],e[13]=r[1]*i+r[5]*n+r[9]*o+r[13],e[14]=r[2]*i+r[6]*n+r[10]*o+r[14],e[15]=r[3]*i+r[7]*n+r[11]*o+r[15]):(s=r[0],a=r[1],l=r[2],u=r[3],c=r[4],h=r[5],m=r[6],p=r[7],v=r[8],f=r[9],g=r[10],b=r[11],e[0]=s,e[1]=a,e[2]=l,e[3]=u,e[4]=c,e[5]=h,e[6]=m,e[7]=p,e[8]=v,e[9]=f,e[10]=g,e[11]=b,e[12]=s*i+c*n+v*o+r[12],e[13]=a*i+h*n+f*o+r[13],e[14]=l*i+m*n+g*o+r[14],e[15]=u*i+p*n+b*o+r[15]),e}d(gu,"translate");function bu(e,r,t){var i=t[0],n=t[1],o=t[2];return e[0]=r[0]*i,e[1]=r[1]*i,e[2]=r[2]*i,e[3]=r[3]*i,e[4]=r[4]*n,e[5]=r[5]*n,e[6]=r[6]*n,e[7]=r[7]*n,e[8]=r[8]*o,e[9]=r[9]*o,e[10]=r[10]*o,e[11]=r[11]*o,e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15],e}d(bu,"scale");function xu(e,r,t,i){var n=i[0],o=i[1],s=i[2],a=Math.sqrt(n*n+o*o+s*s),l,u,c,h,m,p,v,f,g,b,M,_,w,S,T,C,I,k,D,V,$,J,N,xe;return a<U?null:(a=1/a,n*=a,o*=a,s*=a,l=Math.sin(t),u=Math.cos(t),c=1-u,h=r[0],m=r[1],p=r[2],v=r[3],f=r[4],g=r[5],b=r[6],M=r[7],_=r[8],w=r[9],S=r[10],T=r[11],C=n*n*c+u,I=o*n*c+s*l,k=s*n*c-o*l,D=n*o*c-s*l,V=o*o*c+u,$=s*o*c+n*l,J=n*s*c+o*l,N=o*s*c-n*l,xe=s*s*c+u,e[0]=h*C+f*I+_*k,e[1]=m*C+g*I+w*k,e[2]=p*C+b*I+S*k,e[3]=v*C+M*I+T*k,e[4]=h*D+f*V+_*$,e[5]=m*D+g*V+w*$,e[6]=p*D+b*V+S*$,e[7]=v*D+M*V+T*$,e[8]=h*J+f*N+_*xe,e[9]=m*J+g*N+w*xe,e[10]=p*J+b*N+S*xe,e[11]=v*J+M*N+T*xe,r!==e&&(e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e)}d(xu,"rotate");function yu(e,r,t){var i=Math.sin(t),n=Math.cos(t),o=r[4],s=r[5],a=r[6],l=r[7],u=r[8],c=r[9],h=r[10],m=r[11];return r!==e&&(e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e[4]=o*n+u*i,e[5]=s*n+c*i,e[6]=a*n+h*i,e[7]=l*n+m*i,e[8]=u*n-o*i,e[9]=c*n-s*i,e[10]=h*n-a*i,e[11]=m*n-l*i,e}d(yu,"rotateX");function _u(e,r,t){var i=Math.sin(t),n=Math.cos(t),o=r[0],s=r[1],a=r[2],l=r[3],u=r[8],c=r[9],h=r[10],m=r[11];return r!==e&&(e[4]=r[4],e[5]=r[5],e[6]=r[6],e[7]=r[7],e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e[0]=o*n-u*i,e[1]=s*n-c*i,e[2]=a*n-h*i,e[3]=l*n-m*i,e[8]=o*i+u*n,e[9]=s*i+c*n,e[10]=a*i+h*n,e[11]=l*i+m*n,e}d(_u,"rotateY");function wu(e,r,t){var i=Math.sin(t),n=Math.cos(t),o=r[0],s=r[1],a=r[2],l=r[3],u=r[4],c=r[5],h=r[6],m=r[7];return r!==e&&(e[8]=r[8],e[9]=r[9],e[10]=r[10],e[11]=r[11],e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e[0]=o*n+u*i,e[1]=s*n+c*i,e[2]=a*n+h*i,e[3]=l*n+m*i,e[4]=u*n-o*i,e[5]=c*n-s*i,e[6]=h*n-a*i,e[7]=m*n-l*i,e}d(wu,"rotateZ");function Mu(e,r){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}d(Mu,"fromTranslation");function Tu(e,r){return e[0]=r[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=r[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=r[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(Tu,"fromScaling");function Su(e,r,t){var i=t[0],n=t[1],o=t[2],s=Math.sqrt(i*i+n*n+o*o),a,l,u;return s<U?null:(s=1/s,i*=s,n*=s,o*=s,a=Math.sin(r),l=Math.cos(r),u=1-l,e[0]=i*i*u+l,e[1]=n*i*u+o*a,e[2]=o*i*u-n*a,e[3]=0,e[4]=i*n*u-o*a,e[5]=n*n*u+l,e[6]=o*n*u+i*a,e[7]=0,e[8]=i*o*u+n*a,e[9]=n*o*u-i*a,e[10]=o*o*u+l,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e)}d(Su,"fromRotation");function Eu(e,r){var t=Math.sin(r),i=Math.cos(r);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=t,e[7]=0,e[8]=0,e[9]=-t,e[10]=i,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(Eu,"fromXRotation");function Au(e,r){var t=Math.sin(r),i=Math.cos(r);return e[0]=i,e[1]=0,e[2]=-t,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=t,e[9]=0,e[10]=i,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(Au,"fromYRotation");function Ru(e,r){var t=Math.sin(r),i=Math.cos(r);return e[0]=i,e[1]=t,e[2]=0,e[3]=0,e[4]=-t,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(Ru,"fromZRotation");function sa(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=i+i,l=n+n,u=o+o,c=i*a,h=i*l,m=i*u,p=n*l,v=n*u,f=o*u,g=s*a,b=s*l,M=s*u;return e[0]=1-(p+f),e[1]=h+M,e[2]=m-b,e[3]=0,e[4]=h-M,e[5]=1-(c+f),e[6]=v+g,e[7]=0,e[8]=m+b,e[9]=v-g,e[10]=1-(c+p),e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}d(sa,"fromRotationTranslation");function Cu(e,r){var t=new re(3),i=-r[0],n=-r[1],o=-r[2],s=r[3],a=r[4],l=r[5],u=r[6],c=r[7],h=i*i+n*n+o*o+s*s;return h>0?(t[0]=(a*s+c*i+l*o-u*n)*2/h,t[1]=(l*s+c*n+u*i-a*o)*2/h,t[2]=(u*s+c*o+a*n-l*i)*2/h):(t[0]=(a*s+c*i+l*o-u*n)*2,t[1]=(l*s+c*n+u*i-a*o)*2,t[2]=(u*s+c*o+a*n-l*i)*2),sa(e,r,t),e}d(Cu,"fromQuat2");function Lu(e,r){return e[0]=r[12],e[1]=r[13],e[2]=r[14],e}d(Lu,"getTranslation");function aa(e,r){var t=r[0],i=r[1],n=r[2],o=r[4],s=r[5],a=r[6],l=r[8],u=r[9],c=r[10];return e[0]=Math.sqrt(t*t+i*i+n*n),e[1]=Math.sqrt(o*o+s*s+a*a),e[2]=Math.sqrt(l*l+u*u+c*c),e}d(aa,"getScaling");function Xu(e,r){var t=new re(3);aa(t,r);var i=1/t[0],n=1/t[1],o=1/t[2],s=r[0]*i,a=r[1]*n,l=r[2]*o,u=r[4]*i,c=r[5]*n,h=r[6]*o,m=r[8]*i,p=r[9]*n,v=r[10]*o,f=s+c+v,g=0;return f>0?(g=Math.sqrt(f+1)*2,e[3]=.25*g,e[0]=(h-p)/g,e[1]=(m-l)/g,e[2]=(a-u)/g):s>c&&s>v?(g=Math.sqrt(1+s-c-v)*2,e[3]=(h-p)/g,e[0]=.25*g,e[1]=(a+u)/g,e[2]=(m+l)/g):c>v?(g=Math.sqrt(1+c-s-v)*2,e[3]=(m-l)/g,e[0]=(a+u)/g,e[1]=.25*g,e[2]=(h+p)/g):(g=Math.sqrt(1+v-s-c)*2,e[3]=(a-u)/g,e[0]=(m+l)/g,e[1]=(h+p)/g,e[2]=.25*g),e}d(Xu,"getRotation");function Pu(e,r,t,i){r[0]=i[12],r[1]=i[13],r[2]=i[14];var n=i[0],o=i[1],s=i[2],a=i[4],l=i[5],u=i[6],c=i[8],h=i[9],m=i[10];t[0]=Math.sqrt(n*n+o*o+s*s),t[1]=Math.sqrt(a*a+l*l+u*u),t[2]=Math.sqrt(c*c+h*h+m*m);var p=1/t[0],v=1/t[1],f=1/t[2],g=n*p,b=o*v,M=s*f,_=a*p,w=l*v,S=u*f,T=c*p,C=h*v,I=m*f,k=g+w+I,D=0;return k>0?(D=Math.sqrt(k+1)*2,e[3]=.25*D,e[0]=(S-C)/D,e[1]=(T-M)/D,e[2]=(b-_)/D):g>w&&g>I?(D=Math.sqrt(1+g-w-I)*2,e[3]=(S-C)/D,e[0]=.25*D,e[1]=(b+_)/D,e[2]=(T+M)/D):w>I?(D=Math.sqrt(1+w-g-I)*2,e[3]=(T-M)/D,e[0]=(b+_)/D,e[1]=.25*D,e[2]=(S+C)/D):(D=Math.sqrt(1+I-g-w)*2,e[3]=(b-_)/D,e[0]=(T+M)/D,e[1]=(S+C)/D,e[2]=.25*D),e}d(Pu,"decompose");function Bu(e,r,t,i){var n=r[0],o=r[1],s=r[2],a=r[3],l=n+n,u=o+o,c=s+s,h=n*l,m=n*u,p=n*c,v=o*u,f=o*c,g=s*c,b=a*l,M=a*u,_=a*c,w=i[0],S=i[1],T=i[2];return e[0]=(1-(v+g))*w,e[1]=(m+_)*w,e[2]=(p-M)*w,e[3]=0,e[4]=(m-_)*S,e[5]=(1-(h+g))*S,e[6]=(f+b)*S,e[7]=0,e[8]=(p+M)*T,e[9]=(f-b)*T,e[10]=(1-(h+v))*T,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}d(Bu,"fromRotationTranslationScale");function Du(e,r,t,i,n){var o=r[0],s=r[1],a=r[2],l=r[3],u=o+o,c=s+s,h=a+a,m=o*u,p=o*c,v=o*h,f=s*c,g=s*h,b=a*h,M=l*u,_=l*c,w=l*h,S=i[0],T=i[1],C=i[2],I=n[0],k=n[1],D=n[2],V=(1-(f+b))*S,$=(p+w)*S,J=(v-_)*S,N=(p-w)*T,xe=(1-(m+b))*T,Ge=(g+M)*T,It=(v+_)*C,pi=(g-M)*C,Ft=(1-(m+f))*C;return e[0]=V,e[1]=$,e[2]=J,e[3]=0,e[4]=N,e[5]=xe,e[6]=Ge,e[7]=0,e[8]=It,e[9]=pi,e[10]=Ft,e[11]=0,e[12]=t[0]+I-(V*I+N*k+It*D),e[13]=t[1]+k-($*I+xe*k+pi*D),e[14]=t[2]+D-(J*I+Ge*k+Ft*D),e[15]=1,e}d(Du,"fromRotationTranslationScaleOrigin");function ku(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=t+t,a=i+i,l=n+n,u=t*s,c=i*s,h=i*a,m=n*s,p=n*a,v=n*l,f=o*s,g=o*a,b=o*l;return e[0]=1-h-v,e[1]=c+b,e[2]=m-g,e[3]=0,e[4]=c-b,e[5]=1-u-v,e[6]=p+f,e[7]=0,e[8]=m+g,e[9]=p-f,e[10]=1-u-h,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}d(ku,"fromQuat");function Iu(e,r,t,i,n,o,s){var a=1/(t-r),l=1/(n-i),u=1/(o-s);return e[0]=o*2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o*2*l,e[6]=0,e[7]=0,e[8]=(t+r)*a,e[9]=(n+i)*l,e[10]=(s+o)*u,e[11]=-1,e[12]=0,e[13]=0,e[14]=s*o*2*u,e[15]=0,e}d(Iu,"frustum");function la(e,r,t,i,n){var o=1/Math.tan(r/2);if(e[0]=o/t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0){var s=1/(i-n);e[10]=(n+i)*s,e[14]=2*n*i*s}else e[10]=-1,e[14]=-2*i;return e}d(la,"perspectiveNO");var Fu=la;function Nu(e,r,t,i,n){var o=1/Math.tan(r/2);if(e[0]=o/t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0){var s=1/(i-n);e[10]=n*s,e[14]=n*i*s}else e[10]=-1,e[14]=-i;return e}d(Nu,"perspectiveZO");function Uu(e,r,t,i){var n=Math.tan(r.upDegrees*Math.PI/180),o=Math.tan(r.downDegrees*Math.PI/180),s=Math.tan(r.leftDegrees*Math.PI/180),a=Math.tan(r.rightDegrees*Math.PI/180),l=2/(s+a),u=2/(n+o);return e[0]=l,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=u,e[6]=0,e[7]=0,e[8]=-((s-a)*l*.5),e[9]=(n-o)*u*.5,e[10]=i/(t-i),e[11]=-1,e[12]=0,e[13]=0,e[14]=i*t/(t-i),e[15]=0,e}d(Uu,"perspectiveFromFieldOfView");function ca(e,r,t,i,n,o,s){var a=1/(r-t),l=1/(i-n),u=1/(o-s);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*u,e[11]=0,e[12]=(r+t)*a,e[13]=(n+i)*l,e[14]=(s+o)*u,e[15]=1,e}d(ca,"orthoNO");var Ou=ca;function Gu(e,r,t,i,n,o,s){var a=1/(r-t),l=1/(i-n),u=1/(o-s);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=u,e[11]=0,e[12]=(r+t)*a,e[13]=(n+i)*l,e[14]=o*u,e[15]=1,e}d(Gu,"orthoZO");function zu(e,r,t,i){var n,o,s,a,l,u,c,h,m,p,v=r[0],f=r[1],g=r[2],b=i[0],M=i[1],_=i[2],w=t[0],S=t[1],T=t[2];return Math.abs(v-w)<U&&Math.abs(f-S)<U&&Math.abs(g-T)<U?na(e):(c=v-w,h=f-S,m=g-T,p=1/Math.sqrt(c*c+h*h+m*m),c*=p,h*=p,m*=p,n=M*m-_*h,o=_*c-b*m,s=b*h-M*c,p=Math.sqrt(n*n+o*o+s*s),p?(p=1/p,n*=p,o*=p,s*=p):(n=0,o=0,s=0),a=h*s-m*o,l=m*n-c*s,u=c*o-h*n,p=Math.sqrt(a*a+l*l+u*u),p?(p=1/p,a*=p,l*=p,u*=p):(a=0,l=0,u=0),e[0]=n,e[1]=a,e[2]=c,e[3]=0,e[4]=o,e[5]=l,e[6]=h,e[7]=0,e[8]=s,e[9]=u,e[10]=m,e[11]=0,e[12]=-(n*v+o*f+s*g),e[13]=-(a*v+l*f+u*g),e[14]=-(c*v+h*f+m*g),e[15]=1,e)}d(zu,"lookAt");function Vu(e,r,t,i){var n=r[0],o=r[1],s=r[2],a=i[0],l=i[1],u=i[2],c=n-t[0],h=o-t[1],m=s-t[2],p=c*c+h*h+m*m;p>0&&(p=1/Math.sqrt(p),c*=p,h*=p,m*=p);var v=l*m-u*h,f=u*c-a*m,g=a*h-l*c;return p=v*v+f*f+g*g,p>0&&(p=1/Math.sqrt(p),v*=p,f*=p,g*=p),e[0]=v,e[1]=f,e[2]=g,e[3]=0,e[4]=h*g-m*f,e[5]=m*v-c*g,e[6]=c*f-h*v,e[7]=0,e[8]=c,e[9]=h,e[10]=m,e[11]=0,e[12]=n,e[13]=o,e[14]=s,e[15]=1,e}d(Vu,"targetTo");function Wu(e){return"mat4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+")"}d(Wu,"str");function Hu(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8]+e[9]*e[9]+e[10]*e[10]+e[11]*e[11]+e[12]*e[12]+e[13]*e[13]+e[14]*e[14]+e[15]*e[15])}d(Hu,"frob");function Ju(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e[3]=r[3]+t[3],e[4]=r[4]+t[4],e[5]=r[5]+t[5],e[6]=r[6]+t[6],e[7]=r[7]+t[7],e[8]=r[8]+t[8],e[9]=r[9]+t[9],e[10]=r[10]+t[10],e[11]=r[11]+t[11],e[12]=r[12]+t[12],e[13]=r[13]+t[13],e[14]=r[14]+t[14],e[15]=r[15]+t[15],e}d(Ju,"add");function ua(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e[2]=r[2]-t[2],e[3]=r[3]-t[3],e[4]=r[4]-t[4],e[5]=r[5]-t[5],e[6]=r[6]-t[6],e[7]=r[7]-t[7],e[8]=r[8]-t[8],e[9]=r[9]-t[9],e[10]=r[10]-t[10],e[11]=r[11]-t[11],e[12]=r[12]-t[12],e[13]=r[13]-t[13],e[14]=r[14]-t[14],e[15]=r[15]-t[15],e}d(ua,"subtract");function qu(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e[2]=r[2]*t,e[3]=r[3]*t,e[4]=r[4]*t,e[5]=r[5]*t,e[6]=r[6]*t,e[7]=r[7]*t,e[8]=r[8]*t,e[9]=r[9]*t,e[10]=r[10]*t,e[11]=r[11]*t,e[12]=r[12]*t,e[13]=r[13]*t,e[14]=r[14]*t,e[15]=r[15]*t,e}d(qu,"multiplyScalar");function Yu(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e[2]=r[2]+t[2]*i,e[3]=r[3]+t[3]*i,e[4]=r[4]+t[4]*i,e[5]=r[5]+t[5]*i,e[6]=r[6]+t[6]*i,e[7]=r[7]+t[7]*i,e[8]=r[8]+t[8]*i,e[9]=r[9]+t[9]*i,e[10]=r[10]+t[10]*i,e[11]=r[11]+t[11]*i,e[12]=r[12]+t[12]*i,e[13]=r[13]+t[13]*i,e[14]=r[14]+t[14]*i,e[15]=r[15]+t[15]*i,e}d(Yu,"multiplyScalarAndAdd");function $u(e,r){return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]&&e[3]===r[3]&&e[4]===r[4]&&e[5]===r[5]&&e[6]===r[6]&&e[7]===r[7]&&e[8]===r[8]&&e[9]===r[9]&&e[10]===r[10]&&e[11]===r[11]&&e[12]===r[12]&&e[13]===r[13]&&e[14]===r[14]&&e[15]===r[15]}d($u,"exactEquals");function ju(e,r){var t=e[0],i=e[1],n=e[2],o=e[3],s=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=e[9],m=e[10],p=e[11],v=e[12],f=e[13],g=e[14],b=e[15],M=r[0],_=r[1],w=r[2],S=r[3],T=r[4],C=r[5],I=r[6],k=r[7],D=r[8],V=r[9],$=r[10],J=r[11],N=r[12],xe=r[13],Ge=r[14],It=r[15];return Math.abs(t-M)<=U*Math.max(1,Math.abs(t),Math.abs(M))&&Math.abs(i-_)<=U*Math.max(1,Math.abs(i),Math.abs(_))&&Math.abs(n-w)<=U*Math.max(1,Math.abs(n),Math.abs(w))&&Math.abs(o-S)<=U*Math.max(1,Math.abs(o),Math.abs(S))&&Math.abs(s-T)<=U*Math.max(1,Math.abs(s),Math.abs(T))&&Math.abs(a-C)<=U*Math.max(1,Math.abs(a),Math.abs(C))&&Math.abs(l-I)<=U*Math.max(1,Math.abs(l),Math.abs(I))&&Math.abs(u-k)<=U*Math.max(1,Math.abs(u),Math.abs(k))&&Math.abs(c-D)<=U*Math.max(1,Math.abs(c),Math.abs(D))&&Math.abs(h-V)<=U*Math.max(1,Math.abs(h),Math.abs(V))&&Math.abs(m-$)<=U*Math.max(1,Math.abs(m),Math.abs($))&&Math.abs(p-J)<=U*Math.max(1,Math.abs(p),Math.abs(J))&&Math.abs(v-N)<=U*Math.max(1,Math.abs(v),Math.abs(N))&&Math.abs(f-xe)<=U*Math.max(1,Math.abs(f),Math.abs(xe))&&Math.abs(g-Ge)<=U*Math.max(1,Math.abs(g),Math.abs(Ge))&&Math.abs(b-It)<=U*Math.max(1,Math.abs(b),Math.abs(It))}d(ju,"equals");var Ku=oa,Qu=ua;var B={};lr(B,{add:()=>_h,calculateW:()=>uh,clone:()=>gh,conjugate:()=>ph,copy:()=>xh,create:()=>oo,dot:()=>La,equals:()=>Ah,exactEquals:()=>Eh,exp:()=>Ea,fromEuler:()=>fh,fromMat3:()=>Ra,fromValues:()=>bh,getAngle:()=>sh,getAxisAngle:()=>oh,identity:()=>nh,invert:()=>mh,len:()=>Th,length:()=>Xa,lerp:()=>Mh,ln:()=>Aa,mul:()=>wh,multiply:()=>Sa,normalize:()=>so,pow:()=>dh,random:()=>hh,rotateX:()=>ah,rotateY:()=>lh,rotateZ:()=>ch,rotationTo:()=>Rh,scale:()=>Ca,set:()=>yh,setAxes:()=>Lh,setAxisAngle:()=>Ta,slerp:()=>_i,sqlerp:()=>Ch,sqrLen:()=>Sh,squaredLength:()=>Pa,str:()=>vh});var x={};lr(x,{add:()=>rd,angle:()=>Md,bezier:()=>fd,ceil:()=>id,clone:()=>Zu,copy:()=>ed,create:()=>vi,cross:()=>Fr,dist:()=>Xd,distance:()=>fa,div:()=>Ld,divide:()=>pa,dot:()=>Ir,equals:()=>Ad,exactEquals:()=>Ed,floor:()=>nd,forEach:()=>Dd,fromValues:()=>gi,hermite:()=>pd,inverse:()=>dd,len:()=>$n,length:()=>da,lerp:()=>hd,max:()=>sd,min:()=>od,mul:()=>Cd,multiply:()=>ma,negate:()=>ud,normalize:()=>Yn,random:()=>vd,rotateX:()=>yd,rotateY:()=>_d,rotateZ:()=>wd,round:()=>ad,scale:()=>ld,scaleAndAdd:()=>cd,set:()=>td,slerp:()=>md,sqrDist:()=>Pd,sqrLen:()=>Bd,squaredDistance:()=>va,squaredLength:()=>ga,str:()=>Sd,sub:()=>Rd,subtract:()=>ha,transformMat3:()=>bd,transformMat4:()=>gd,transformQuat:()=>xd,zero:()=>Td});function vi(){var e=new re(3);return re!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}d(vi,"create");function Zu(e){var r=new re(3);return r[0]=e[0],r[1]=e[1],r[2]=e[2],r}d(Zu,"clone");function da(e){var r=e[0],t=e[1],i=e[2];return Math.sqrt(r*r+t*t+i*i)}d(da,"length");function gi(e,r,t){var i=new re(3);return i[0]=e,i[1]=r,i[2]=t,i}d(gi,"fromValues");function ed(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e}d(ed,"copy");function td(e,r,t,i){return e[0]=r,e[1]=t,e[2]=i,e}d(td,"set");function rd(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e}d(rd,"add");function ha(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e[2]=r[2]-t[2],e}d(ha,"subtract");function ma(e,r,t){return e[0]=r[0]*t[0],e[1]=r[1]*t[1],e[2]=r[2]*t[2],e}d(ma,"multiply");function pa(e,r,t){return e[0]=r[0]/t[0],e[1]=r[1]/t[1],e[2]=r[2]/t[2],e}d(pa,"divide");function id(e,r){return e[0]=Math.ceil(r[0]),e[1]=Math.ceil(r[1]),e[2]=Math.ceil(r[2]),e}d(id,"ceil");function nd(e,r){return e[0]=Math.floor(r[0]),e[1]=Math.floor(r[1]),e[2]=Math.floor(r[2]),e}d(nd,"floor");function od(e,r,t){return e[0]=Math.min(r[0],t[0]),e[1]=Math.min(r[1],t[1]),e[2]=Math.min(r[2],t[2]),e}d(od,"min");function sd(e,r,t){return e[0]=Math.max(r[0],t[0]),e[1]=Math.max(r[1],t[1]),e[2]=Math.max(r[2],t[2]),e}d(sd,"max");function ad(e,r){return e[0]=Ve(r[0]),e[1]=Ve(r[1]),e[2]=Ve(r[2]),e}d(ad,"round");function ld(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e[2]=r[2]*t,e}d(ld,"scale");function cd(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e[2]=r[2]+t[2]*i,e}d(cd,"scaleAndAdd");function fa(e,r){var t=r[0]-e[0],i=r[1]-e[1],n=r[2]-e[2];return Math.sqrt(t*t+i*i+n*n)}d(fa,"distance");function va(e,r){var t=r[0]-e[0],i=r[1]-e[1],n=r[2]-e[2];return t*t+i*i+n*n}d(va,"squaredDistance");function ga(e){var r=e[0],t=e[1],i=e[2];return r*r+t*t+i*i}d(ga,"squaredLength");function ud(e,r){return e[0]=-r[0],e[1]=-r[1],e[2]=-r[2],e}d(ud,"negate");function dd(e,r){return e[0]=1/r[0],e[1]=1/r[1],e[2]=1/r[2],e}d(dd,"inverse");function Yn(e,r){var t=r[0],i=r[1],n=r[2],o=t*t+i*i+n*n;return o>0&&(o=1/Math.sqrt(o)),e[0]=r[0]*o,e[1]=r[1]*o,e[2]=r[2]*o,e}d(Yn,"normalize");function Ir(e,r){return e[0]*r[0]+e[1]*r[1]+e[2]*r[2]}d(Ir,"dot");function Fr(e,r,t){var i=r[0],n=r[1],o=r[2],s=t[0],a=t[1],l=t[2];return e[0]=n*l-o*a,e[1]=o*s-i*l,e[2]=i*a-n*s,e}d(Fr,"cross");function hd(e,r,t,i){var n=r[0],o=r[1],s=r[2];return e[0]=n+i*(t[0]-n),e[1]=o+i*(t[1]-o),e[2]=s+i*(t[2]-s),e}d(hd,"lerp");function md(e,r,t,i){var n=Math.acos(Math.min(Math.max(Ir(r,t),-1),1)),o=Math.sin(n),s=Math.sin((1-i)*n)/o,a=Math.sin(i*n)/o;return e[0]=s*r[0]+a*t[0],e[1]=s*r[1]+a*t[1],e[2]=s*r[2]+a*t[2],e}d(md,"slerp");function pd(e,r,t,i,n,o){var s=o*o,a=s*(2*o-3)+1,l=s*(o-2)+o,u=s*(o-1),c=s*(3-2*o);return e[0]=r[0]*a+t[0]*l+i[0]*u+n[0]*c,e[1]=r[1]*a+t[1]*l+i[1]*u+n[1]*c,e[2]=r[2]*a+t[2]*l+i[2]*u+n[2]*c,e}d(pd,"hermite");function fd(e,r,t,i,n,o){var s=1-o,a=s*s,l=o*o,u=a*s,c=3*o*a,h=3*l*s,m=l*o;return e[0]=r[0]*u+t[0]*c+i[0]*h+n[0]*m,e[1]=r[1]*u+t[1]*c+i[1]*h+n[1]*m,e[2]=r[2]*u+t[2]*c+i[2]*h+n[2]*m,e}d(fd,"bezier");function vd(e,r){r=r===void 0?1:r;var t=Xe()*2*Math.PI,i=Xe()*2-1,n=Math.sqrt(1-i*i)*r;return e[0]=Math.cos(t)*n,e[1]=Math.sin(t)*n,e[2]=i*r,e}d(vd,"random");function gd(e,r,t){var i=r[0],n=r[1],o=r[2],s=t[3]*i+t[7]*n+t[11]*o+t[15];return s=s||1,e[0]=(t[0]*i+t[4]*n+t[8]*o+t[12])/s,e[1]=(t[1]*i+t[5]*n+t[9]*o+t[13])/s,e[2]=(t[2]*i+t[6]*n+t[10]*o+t[14])/s,e}d(gd,"transformMat4");function bd(e,r,t){var i=r[0],n=r[1],o=r[2];return e[0]=i*t[0]+n*t[3]+o*t[6],e[1]=i*t[1]+n*t[4]+o*t[7],e[2]=i*t[2]+n*t[5]+o*t[8],e}d(bd,"transformMat3");function xd(e,r,t){var i=t[0],n=t[1],o=t[2],s=t[3],a=r[0],l=r[1],u=r[2],c=n*u-o*l,h=o*a-i*u,m=i*l-n*a;return c=c+c,h=h+h,m=m+m,e[0]=a+s*c+n*m-o*h,e[1]=l+s*h+o*c-i*m,e[2]=u+s*m+i*h-n*c,e}d(xd,"transformQuat");function yd(e,r,t,i){var n=[],o=[];return n[0]=r[0]-t[0],n[1]=r[1]-t[1],n[2]=r[2]-t[2],o[0]=n[0],o[1]=n[1]*Math.cos(i)-n[2]*Math.sin(i),o[2]=n[1]*Math.sin(i)+n[2]*Math.cos(i),e[0]=o[0]+t[0],e[1]=o[1]+t[1],e[2]=o[2]+t[2],e}d(yd,"rotateX");function _d(e,r,t,i){var n=[],o=[];return n[0]=r[0]-t[0],n[1]=r[1]-t[1],n[2]=r[2]-t[2],o[0]=n[2]*Math.sin(i)+n[0]*Math.cos(i),o[1]=n[1],o[2]=n[2]*Math.cos(i)-n[0]*Math.sin(i),e[0]=o[0]+t[0],e[1]=o[1]+t[1],e[2]=o[2]+t[2],e}d(_d,"rotateY");function wd(e,r,t,i){var n=[],o=[];return n[0]=r[0]-t[0],n[1]=r[1]-t[1],n[2]=r[2]-t[2],o[0]=n[0]*Math.cos(i)-n[1]*Math.sin(i),o[1]=n[0]*Math.sin(i)+n[1]*Math.cos(i),o[2]=n[2],e[0]=o[0]+t[0],e[1]=o[1]+t[1],e[2]=o[2]+t[2],e}d(wd,"rotateZ");function Md(e,r){var t=e[0],i=e[1],n=e[2],o=r[0],s=r[1],a=r[2],l=Math.sqrt((t*t+i*i+n*n)*(o*o+s*s+a*a)),u=l&&Ir(e,r)/l;return Math.acos(Math.min(Math.max(u,-1),1))}d(Md,"angle");function Td(e){return e[0]=0,e[1]=0,e[2]=0,e}d(Td,"zero");function Sd(e){return"vec3("+e[0]+", "+e[1]+", "+e[2]+")"}d(Sd,"str");function Ed(e,r){return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]}d(Ed,"exactEquals");function Ad(e,r){var t=e[0],i=e[1],n=e[2],o=r[0],s=r[1],a=r[2];return Math.abs(t-o)<=U*Math.max(1,Math.abs(t),Math.abs(o))&&Math.abs(i-s)<=U*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(n-a)<=U*Math.max(1,Math.abs(n),Math.abs(a))}d(Ad,"equals");var Rd=ha,Cd=ma,Ld=pa,Xd=fa,Pd=va,$n=da,Bd=ga,Dd=(function(){var e=vi();return function(r,t,i,n,o,s){var a,l;for(t||(t=3),i||(i=0),n?l=Math.min(n*t+i,r.length):l=r.length,a=i;a<l;a+=t)e[0]=r[a],e[1]=r[a+1],e[2]=r[a+2],o(e,e,s),r[a]=e[0],r[a+1]=e[1],r[a+2]=e[2];return r}})();var ve={};lr(ve,{add:()=>eo,ceil:()=>kd,clone:()=>jn,copy:()=>Qn,create:()=>ba,cross:()=>Vd,dist:()=>Zd,distance:()=>wa,div:()=>Qd,divide:()=>_a,dot:()=>yi,equals:()=>$d,exactEquals:()=>no,floor:()=>Id,forEach:()=>ih,fromValues:()=>Kn,inverse:()=>zd,len:()=>th,length:()=>bi,lerp:()=>io,max:()=>Nd,min:()=>Fd,mul:()=>Kd,multiply:()=>ya,negate:()=>Gd,normalize:()=>ro,random:()=>Wd,round:()=>Ud,scale:()=>to,scaleAndAdd:()=>Od,set:()=>Zn,sqrDist:()=>eh,sqrLen:()=>rh,squaredDistance:()=>Ma,squaredLength:()=>xi,str:()=>Yd,sub:()=>jd,subtract:()=>xa,transformMat4:()=>Hd,transformQuat:()=>Jd,zero:()=>qd});function ba(){var e=new re(4);return re!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}d(ba,"create");function jn(e){var r=new re(4);return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r}d(jn,"clone");function Kn(e,r,t,i){var n=new re(4);return n[0]=e,n[1]=r,n[2]=t,n[3]=i,n}d(Kn,"fromValues");function Qn(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e}d(Qn,"copy");function Zn(e,r,t,i,n){return e[0]=r,e[1]=t,e[2]=i,e[3]=n,e}d(Zn,"set");function eo(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e[3]=r[3]+t[3],e}d(eo,"add");function xa(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e[2]=r[2]-t[2],e[3]=r[3]-t[3],e}d(xa,"subtract");function ya(e,r,t){return e[0]=r[0]*t[0],e[1]=r[1]*t[1],e[2]=r[2]*t[2],e[3]=r[3]*t[3],e}d(ya,"multiply");function _a(e,r,t){return e[0]=r[0]/t[0],e[1]=r[1]/t[1],e[2]=r[2]/t[2],e[3]=r[3]/t[3],e}d(_a,"divide");function kd(e,r){return e[0]=Math.ceil(r[0]),e[1]=Math.ceil(r[1]),e[2]=Math.ceil(r[2]),e[3]=Math.ceil(r[3]),e}d(kd,"ceil");function Id(e,r){return e[0]=Math.floor(r[0]),e[1]=Math.floor(r[1]),e[2]=Math.floor(r[2]),e[3]=Math.floor(r[3]),e}d(Id,"floor");function Fd(e,r,t){return e[0]=Math.min(r[0],t[0]),e[1]=Math.min(r[1],t[1]),e[2]=Math.min(r[2],t[2]),e[3]=Math.min(r[3],t[3]),e}d(Fd,"min");function Nd(e,r,t){return e[0]=Math.max(r[0],t[0]),e[1]=Math.max(r[1],t[1]),e[2]=Math.max(r[2],t[2]),e[3]=Math.max(r[3],t[3]),e}d(Nd,"max");function Ud(e,r){return e[0]=Ve(r[0]),e[1]=Ve(r[1]),e[2]=Ve(r[2]),e[3]=Ve(r[3]),e}d(Ud,"round");function to(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e[2]=r[2]*t,e[3]=r[3]*t,e}d(to,"scale");function Od(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e[2]=r[2]+t[2]*i,e[3]=r[3]+t[3]*i,e}d(Od,"scaleAndAdd");function wa(e,r){var t=r[0]-e[0],i=r[1]-e[1],n=r[2]-e[2],o=r[3]-e[3];return Math.sqrt(t*t+i*i+n*n+o*o)}d(wa,"distance");function Ma(e,r){var t=r[0]-e[0],i=r[1]-e[1],n=r[2]-e[2],o=r[3]-e[3];return t*t+i*i+n*n+o*o}d(Ma,"squaredDistance");function bi(e){var r=e[0],t=e[1],i=e[2],n=e[3];return Math.sqrt(r*r+t*t+i*i+n*n)}d(bi,"length");function xi(e){var r=e[0],t=e[1],i=e[2],n=e[3];return r*r+t*t+i*i+n*n}d(xi,"squaredLength");function Gd(e,r){return e[0]=-r[0],e[1]=-r[1],e[2]=-r[2],e[3]=-r[3],e}d(Gd,"negate");function zd(e,r){return e[0]=1/r[0],e[1]=1/r[1],e[2]=1/r[2],e[3]=1/r[3],e}d(zd,"inverse");function ro(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=t*t+i*i+n*n+o*o;return s>0&&(s=1/Math.sqrt(s)),e[0]=t*s,e[1]=i*s,e[2]=n*s,e[3]=o*s,e}d(ro,"normalize");function yi(e,r){return e[0]*r[0]+e[1]*r[1]+e[2]*r[2]+e[3]*r[3]}d(yi,"dot");function Vd(e,r,t,i){var n=t[0]*i[1]-t[1]*i[0],o=t[0]*i[2]-t[2]*i[0],s=t[0]*i[3]-t[3]*i[0],a=t[1]*i[2]-t[2]*i[1],l=t[1]*i[3]-t[3]*i[1],u=t[2]*i[3]-t[3]*i[2],c=r[0],h=r[1],m=r[2],p=r[3];return e[0]=h*u-m*l+p*a,e[1]=-(c*u)+m*s-p*o,e[2]=c*l-h*s+p*n,e[3]=-(c*a)+h*o-m*n,e}d(Vd,"cross");function io(e,r,t,i){var n=r[0],o=r[1],s=r[2],a=r[3];return e[0]=n+i*(t[0]-n),e[1]=o+i*(t[1]-o),e[2]=s+i*(t[2]-s),e[3]=a+i*(t[3]-a),e}d(io,"lerp");function Wd(e,r){r=r===void 0?1:r;var t,i,n,o,s,a,l;l=Xe(),t=l*2-1,i=(4*Xe()-2)*Math.sqrt(l*-l+l),s=t*t+i*i,l=Xe(),n=l*2-1,o=(4*Xe()-2)*Math.sqrt(l*-l+l),a=n*n+o*o;var u=Math.sqrt((1-s)/a);return e[0]=r*t,e[1]=r*i,e[2]=r*n*u,e[3]=r*o*u,e}d(Wd,"random");function Hd(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3];return e[0]=t[0]*i+t[4]*n+t[8]*o+t[12]*s,e[1]=t[1]*i+t[5]*n+t[9]*o+t[13]*s,e[2]=t[2]*i+t[6]*n+t[10]*o+t[14]*s,e[3]=t[3]*i+t[7]*n+t[11]*o+t[15]*s,e}d(Hd,"transformMat4");function Jd(e,r,t){var i=t[0],n=t[1],o=t[2],s=t[3],a=r[0],l=r[1],u=r[2],c=n*u-o*l,h=o*a-i*u,m=i*l-n*a;return c=c+c,h=h+h,m=m+m,e[0]=a+s*c+n*m-o*h,e[1]=l+s*h+o*c-i*m,e[2]=u+s*m+i*h-n*c,e[3]=r[3],e}d(Jd,"transformQuat");function qd(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e}d(qd,"zero");function Yd(e){return"vec4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}d(Yd,"str");function no(e,r){return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]&&e[3]===r[3]}d(no,"exactEquals");function $d(e,r){var t=e[0],i=e[1],n=e[2],o=e[3],s=r[0],a=r[1],l=r[2],u=r[3];return Math.abs(t-s)<=U*Math.max(1,Math.abs(t),Math.abs(s))&&Math.abs(i-a)<=U*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(n-l)<=U*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(o-u)<=U*Math.max(1,Math.abs(o),Math.abs(u))}d($d,"equals");var jd=xa,Kd=ya,Qd=_a,Zd=wa,eh=Ma,th=bi,rh=xi,ih=(function(){var e=ba();return function(r,t,i,n,o,s){var a,l;for(t||(t=4),i||(i=0),n?l=Math.min(n*t+i,r.length):l=r.length,a=i;a<l;a+=t)e[0]=r[a],e[1]=r[a+1],e[2]=r[a+2],e[3]=r[a+3],o(e,e,s),r[a]=e[0],r[a+1]=e[1],r[a+2]=e[2],r[a+3]=e[3];return r}})();function oo(){var e=new re(4);return re!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}d(oo,"create");function nh(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}d(nh,"identity");function Ta(e,r,t){t=t*.5;var i=Math.sin(t);return e[0]=i*r[0],e[1]=i*r[1],e[2]=i*r[2],e[3]=Math.cos(t),e}d(Ta,"setAxisAngle");function oh(e,r){var t=Math.acos(r[3])*2,i=Math.sin(t/2);return i>U?(e[0]=r[0]/i,e[1]=r[1]/i,e[2]=r[2]/i):(e[0]=1,e[1]=0,e[2]=0),t}d(oh,"getAxisAngle");function sh(e,r){var t=La(e,r);return Math.acos(2*t*t-1)}d(sh,"getAngle");function Sa(e,r,t){var i=r[0],n=r[1],o=r[2],s=r[3],a=t[0],l=t[1],u=t[2],c=t[3];return e[0]=i*c+s*a+n*u-o*l,e[1]=n*c+s*l+o*a-i*u,e[2]=o*c+s*u+i*l-n*a,e[3]=s*c-i*a-n*l-o*u,e}d(Sa,"multiply");function ah(e,r,t){t*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(t),l=Math.cos(t);return e[0]=i*l+s*a,e[1]=n*l+o*a,e[2]=o*l-n*a,e[3]=s*l-i*a,e}d(ah,"rotateX");function lh(e,r,t){t*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(t),l=Math.cos(t);return e[0]=i*l-o*a,e[1]=n*l+s*a,e[2]=o*l+i*a,e[3]=s*l-n*a,e}d(lh,"rotateY");function ch(e,r,t){t*=.5;var i=r[0],n=r[1],o=r[2],s=r[3],a=Math.sin(t),l=Math.cos(t);return e[0]=i*l+n*a,e[1]=n*l-i*a,e[2]=o*l+s*a,e[3]=s*l-o*a,e}d(ch,"rotateZ");function uh(e,r){var t=r[0],i=r[1],n=r[2];return e[0]=t,e[1]=i,e[2]=n,e[3]=Math.sqrt(Math.abs(1-t*t-i*i-n*n)),e}d(uh,"calculateW");function Ea(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=Math.sqrt(t*t+i*i+n*n),a=Math.exp(o),l=s>0?a*Math.sin(s)/s:0;return e[0]=t*l,e[1]=i*l,e[2]=n*l,e[3]=a*Math.cos(s),e}d(Ea,"exp");function Aa(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=Math.sqrt(t*t+i*i+n*n),a=s>0?Math.atan2(s,o)/s:0;return e[0]=t*a,e[1]=i*a,e[2]=n*a,e[3]=.5*Math.log(t*t+i*i+n*n+o*o),e}d(Aa,"ln");function dh(e,r,t){return Aa(e,r),Ca(e,e,t),Ea(e,e),e}d(dh,"pow");function _i(e,r,t,i){var n=r[0],o=r[1],s=r[2],a=r[3],l=t[0],u=t[1],c=t[2],h=t[3],m,p,v,f,g;return p=n*l+o*u+s*c+a*h,p<0&&(p=-p,l=-l,u=-u,c=-c,h=-h),1-p>U?(m=Math.acos(p),v=Math.sin(m),f=Math.sin((1-i)*m)/v,g=Math.sin(i*m)/v):(f=1-i,g=i),e[0]=f*n+g*l,e[1]=f*o+g*u,e[2]=f*s+g*c,e[3]=f*a+g*h,e}d(_i,"slerp");function hh(e){var r=Xe(),t=Xe(),i=Xe(),n=Math.sqrt(1-r),o=Math.sqrt(r);return e[0]=n*Math.sin(2*Math.PI*t),e[1]=n*Math.cos(2*Math.PI*t),e[2]=o*Math.sin(2*Math.PI*i),e[3]=o*Math.cos(2*Math.PI*i),e}d(hh,"random");function mh(e,r){var t=r[0],i=r[1],n=r[2],o=r[3],s=t*t+i*i+n*n+o*o,a=s?1/s:0;return e[0]=-t*a,e[1]=-i*a,e[2]=-n*a,e[3]=o*a,e}d(mh,"invert");function ph(e,r){return e[0]=-r[0],e[1]=-r[1],e[2]=-r[2],e[3]=r[3],e}d(ph,"conjugate");function Ra(e,r){var t=r[0]+r[4]+r[8],i;if(t>0)i=Math.sqrt(t+1),e[3]=.5*i,i=.5/i,e[0]=(r[5]-r[7])*i,e[1]=(r[6]-r[2])*i,e[2]=(r[1]-r[3])*i;else{var n=0;r[4]>r[0]&&(n=1),r[8]>r[n*3+n]&&(n=2);var o=(n+1)%3,s=(n+2)%3;i=Math.sqrt(r[n*3+n]-r[o*3+o]-r[s*3+s]+1),e[n]=.5*i,i=.5/i,e[3]=(r[o*3+s]-r[s*3+o])*i,e[o]=(r[o*3+n]+r[n*3+o])*i,e[s]=(r[s*3+n]+r[n*3+s])*i}return e}d(Ra,"fromMat3");function fh(e,r,t,i){var n=arguments.length>4&&arguments[4]!==void 0?arguments[4]:ta,o=Math.PI/360;r*=o,i*=o,t*=o;var s=Math.sin(r),a=Math.cos(r),l=Math.sin(t),u=Math.cos(t),c=Math.sin(i),h=Math.cos(i);switch(n){case"xyz":e[0]=s*u*h+a*l*c,e[1]=a*l*h-s*u*c,e[2]=a*u*c+s*l*h,e[3]=a*u*h-s*l*c;break;case"xzy":e[0]=s*u*h-a*l*c,e[1]=a*l*h-s*u*c,e[2]=a*u*c+s*l*h,e[3]=a*u*h+s*l*c;break;case"yxz":e[0]=s*u*h+a*l*c,e[1]=a*l*h-s*u*c,e[2]=a*u*c-s*l*h,e[3]=a*u*h+s*l*c;break;case"yzx":e[0]=s*u*h+a*l*c,e[1]=a*l*h+s*u*c,e[2]=a*u*c-s*l*h,e[3]=a*u*h-s*l*c;break;case"zxy":e[0]=s*u*h-a*l*c,e[1]=a*l*h+s*u*c,e[2]=a*u*c+s*l*h,e[3]=a*u*h-s*l*c;break;case"zyx":e[0]=s*u*h-a*l*c,e[1]=a*l*h+s*u*c,e[2]=a*u*c-s*l*h,e[3]=a*u*h+s*l*c;break;default:throw new Error("Unknown angle order "+n)}return e}d(fh,"fromEuler");function vh(e){return"quat("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}d(vh,"str");var gh=jn,bh=Kn,xh=Qn,yh=Zn,_h=eo,wh=Sa,Ca=to,La=yi,Mh=io,Xa=bi,Th=Xa,Pa=xi,Sh=Pa,so=ro,Eh=no;function Ah(e,r){return Math.abs(yi(e,r))>=1-U}d(Ah,"equals");var Rh=(function(){var e=vi(),r=gi(1,0,0),t=gi(0,1,0);return function(i,n,o){var s=Ir(n,o);return s<-.999999?(Fr(e,r,n),$n(e)<1e-6&&Fr(e,t,n),Yn(e,e),Ta(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(Fr(e,n,o),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,so(i,i))}})(),Ch=(function(){var e=oo(),r=oo();return function(t,i,n,o,s,a){return _i(e,i,s,a),_i(r,n,o,a),_i(t,e,r,2*a*(1-a)),t}})(),Lh=(function(){var e=qn();return function(r,t,i,n){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=n[0],e[4]=n[1],e[7]=n[2],e[2]=-t[0],e[5]=-t[1],e[8]=-t[2],so(r,Ra(r,e))}})();var he={};lr(he,{add:()=>kh,angle:()=>tm,ceil:()=>Ih,clone:()=>Xh,copy:()=>Bh,create:()=>Ba,cross:()=>qh,dist:()=>dm,distance:()=>Fa,div:()=>um,divide:()=>Ia,dot:()=>Jh,equals:()=>sm,exactEquals:()=>om,floor:()=>Fh,forEach:()=>pm,fromValues:()=>Ph,inverse:()=>Wh,len:()=>am,length:()=>Ua,lerp:()=>Yh,max:()=>Uh,min:()=>Nh,mul:()=>cm,multiply:()=>ka,negate:()=>Vh,normalize:()=>Hh,random:()=>$h,rotate:()=>em,round:()=>Oh,scale:()=>Gh,scaleAndAdd:()=>zh,set:()=>Dh,signedAngle:()=>rm,sqrDist:()=>hm,sqrLen:()=>mm,squaredDistance:()=>Na,squaredLength:()=>Oa,str:()=>nm,sub:()=>lm,subtract:()=>Da,transformMat2:()=>jh,transformMat2d:()=>Kh,transformMat3:()=>Qh,transformMat4:()=>Zh,zero:()=>im});function Ba(){var e=new re(2);return re!=Float32Array&&(e[0]=0,e[1]=0),e}d(Ba,"create");function Xh(e){var r=new re(2);return r[0]=e[0],r[1]=e[1],r}d(Xh,"clone");function Ph(e,r){var t=new re(2);return t[0]=e,t[1]=r,t}d(Ph,"fromValues");function Bh(e,r){return e[0]=r[0],e[1]=r[1],e}d(Bh,"copy");function Dh(e,r,t){return e[0]=r,e[1]=t,e}d(Dh,"set");function kh(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e}d(kh,"add");function Da(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e}d(Da,"subtract");function ka(e,r,t){return e[0]=r[0]*t[0],e[1]=r[1]*t[1],e}d(ka,"multiply");function Ia(e,r,t){return e[0]=r[0]/t[0],e[1]=r[1]/t[1],e}d(Ia,"divide");function Ih(e,r){return e[0]=Math.ceil(r[0]),e[1]=Math.ceil(r[1]),e}d(Ih,"ceil");function Fh(e,r){return e[0]=Math.floor(r[0]),e[1]=Math.floor(r[1]),e}d(Fh,"floor");function Nh(e,r,t){return e[0]=Math.min(r[0],t[0]),e[1]=Math.min(r[1],t[1]),e}d(Nh,"min");function Uh(e,r,t){return e[0]=Math.max(r[0],t[0]),e[1]=Math.max(r[1],t[1]),e}d(Uh,"max");function Oh(e,r){return e[0]=Ve(r[0]),e[1]=Ve(r[1]),e}d(Oh,"round");function Gh(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e}d(Gh,"scale");function zh(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e}d(zh,"scaleAndAdd");function Fa(e,r){var t=r[0]-e[0],i=r[1]-e[1];return Math.sqrt(t*t+i*i)}d(Fa,"distance");function Na(e,r){var t=r[0]-e[0],i=r[1]-e[1];return t*t+i*i}d(Na,"squaredDistance");function Ua(e){var r=e[0],t=e[1];return Math.sqrt(r*r+t*t)}d(Ua,"length");function Oa(e){var r=e[0],t=e[1];return r*r+t*t}d(Oa,"squaredLength");function Vh(e,r){return e[0]=-r[0],e[1]=-r[1],e}d(Vh,"negate");function Wh(e,r){return e[0]=1/r[0],e[1]=1/r[1],e}d(Wh,"inverse");function Hh(e,r){var t=r[0],i=r[1],n=t*t+i*i;return n>0&&(n=1/Math.sqrt(n)),e[0]=r[0]*n,e[1]=r[1]*n,e}d(Hh,"normalize");function Jh(e,r){return e[0]*r[0]+e[1]*r[1]}d(Jh,"dot");function qh(e,r,t){var i=r[0]*t[1]-r[1]*t[0];return e[0]=e[1]=0,e[2]=i,e}d(qh,"cross");function Yh(e,r,t,i){var n=r[0],o=r[1];return e[0]=n+i*(t[0]-n),e[1]=o+i*(t[1]-o),e}d(Yh,"lerp");function $h(e,r){r=r===void 0?1:r;var t=Xe()*2*Math.PI;return e[0]=Math.cos(t)*r,e[1]=Math.sin(t)*r,e}d($h,"random");function jh(e,r,t){var i=r[0],n=r[1];return e[0]=t[0]*i+t[2]*n,e[1]=t[1]*i+t[3]*n,e}d(jh,"transformMat2");function Kh(e,r,t){var i=r[0],n=r[1];return e[0]=t[0]*i+t[2]*n+t[4],e[1]=t[1]*i+t[3]*n+t[5],e}d(Kh,"transformMat2d");function Qh(e,r,t){var i=r[0],n=r[1];return e[0]=t[0]*i+t[3]*n+t[6],e[1]=t[1]*i+t[4]*n+t[7],e}d(Qh,"transformMat3");function Zh(e,r,t){var i=r[0],n=r[1];return e[0]=t[0]*i+t[4]*n+t[12],e[1]=t[1]*i+t[5]*n+t[13],e}d(Zh,"transformMat4");function em(e,r,t,i){var n=r[0]-t[0],o=r[1]-t[1],s=Math.sin(i),a=Math.cos(i);return e[0]=n*a-o*s+t[0],e[1]=n*s+o*a+t[1],e}d(em,"rotate");function tm(e,r){var t=e[0],i=e[1],n=r[0],o=r[1];return Math.abs(Math.atan2(i*n-t*o,t*n+i*o))}d(tm,"angle");function rm(e,r){var t=e[0],i=e[1],n=r[0],o=r[1];return Math.atan2(t*o-i*n,t*n+i*o)}d(rm,"signedAngle");function im(e){return e[0]=0,e[1]=0,e}d(im,"zero");function nm(e){return"vec2("+e[0]+", "+e[1]+")"}d(nm,"str");function om(e,r){return e[0]===r[0]&&e[1]===r[1]}d(om,"exactEquals");function sm(e,r){var t=e[0],i=e[1],n=r[0],o=r[1];return Math.abs(t-n)<=U*Math.max(1,Math.abs(t),Math.abs(n))&&Math.abs(i-o)<=U*Math.max(1,Math.abs(i),Math.abs(o))}d(sm,"equals");var am=Ua,lm=Da,cm=ka,um=Ia,dm=Fa,hm=Na,mm=Oa,pm=(function(){var e=Ba();return function(r,t,i,n,o,s){var a,l;for(t||(t=2),i||(i=0),n?l=Math.min(n*t+i,r.length):l=r.length,a=i;a<l;a+=t)e[0]=r[a],e[1]=r[a+1],o(e,e,s),r[a]=e[0],r[a+1]=e[1];return r}})();var Nr=class Nr{};d(Nr,"CanvasViewport"),Nr.rendererWidth=0,Nr.rendererHeight=0;var Ke=Nr;var ye=[];for(let e=0;e<256;++e)ye.push((e+256).toString(16).slice(1));function Ga(e,r=0){return(ye[e[r+0]]+ye[e[r+1]]+ye[e[r+2]]+ye[e[r+3]]+"-"+ye[e[r+4]]+ye[e[r+5]]+"-"+ye[e[r+6]]+ye[e[r+7]]+"-"+ye[e[r+8]]+ye[e[r+9]]+"-"+ye[e[r+10]]+ye[e[r+11]]+ye[e[r+12]]+ye[e[r+13]]+ye[e[r+14]]+ye[e[r+15]]).toLowerCase()}d(Ga,"unsafeStringify");var ao,fm=new Uint8Array(16);function lo(){if(!ao){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");ao=crypto.getRandomValues.bind(crypto)}return ao(fm)}d(lo,"rng");var vm=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),co={randomUUID:vm};function gm(e,r,t){if(co.randomUUID&&!r&&!e)return co.randomUUID();e=e||{};let i=e.random??e.rng?.()??lo();if(i.length<16)throw new Error("Random bytes length must be >= 16");if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,r){if(t=t||0,t<0||t+16>r.length)throw new RangeError(`UUID byte range ${t}:${t+15} is out of buffer bounds`);for(let n=0;n<16;++n)r[t+n]=i[n];return r}return Ga(i)}d(gm,"v4");var ot=gm;var uo=class uo{constructor(r){this.name="";if(!r)throw new Error("className is required");this._className=r,this.name=this.name,this._uuid=ot(),this._serializationIgnoreKeys=["_serializationIgnoreKeys","scene","parent"]}get className(){return this._className}get uuid(){return this._uuid}loopAndSaveProperties(r){let t=typeof r;if(r===null||t==="string"||t==="number"||t==="boolean")return r;if(r&&typeof r.toJsonObject=="function")return r.toJsonObject();if(t==="object"&&!Array.isArray(r)&&r?.constructor===Object){let i={};for(let n in r)Object.prototype.hasOwnProperty.call(r,n)&&(i[n]=this.loopAndSaveProperties(r[n]));return i}}getBaseJsonInfo(){return{type:this.constructor.name,name:this.name,className:this.className,uuid:this.uuid}}serializeAutomatically(){let r={};for(let t of Object.keys(this)){if(this._serializationIgnoreKeys.includes(t))continue;let i=this[t],n=this.loopAndSaveProperties(i);n!==void 0&&(r[t]=n)}return{...r,type:this.constructor.name,name:this.name,className:this.className,uuid:this.uuid}}populateProperties(r,t){for(let i in t){if(!Object.prototype.hasOwnProperty.call(t,i)||!Object.prototype.hasOwnProperty.call(r,i))continue;let n=t[i],o=r[i];n===null||typeof n!="object"?r[i]=n:o&&typeof o.fromJson=="function"?o.fromJson(n):o&&typeof o=="object"&&!Array.isArray(o)&&o.constructor===Object?this.populateProperties(o,n):r[i]=n}}deserializeAutomatically(r){let t={...r},i=["type","name","className","uuid"];for(let n of[...i,...this._serializationIgnoreKeys])delete t[n];this.populateProperties(this,t)}toJsonObject(){return this.getBaseJsonInfo()}fromJson(r){this.name=r.name,r.uuid&&(this._uuid=r.uuid)}};d(uo,"JsonSerializable");var q=uo;var ho=class ho extends q{constructor(t,i,n,o,s,a){super("BoundingBox");this.min_x=t;this.max_x=i;this.min_y=n;this.max_y=o;this.min_z=s;this.max_z=a}get width(){return this.max_x-this.min_x}get height(){return this.max_y-this.min_y}get depth(){return this.max_z-this.min_z}};d(ho,"BoundingBox");var wi=ho,mo=class mo extends q{constructor(t,i,n,o){super("BoundingSphere");this.x=t;this.y=i;this.z=n;this.radius=o}};d(mo,"BoundingSphere");var Mi=mo;var Ti=class Ti extends q{constructor(t,i=[],n=[],o=[]){super("MeshData");this.providedNormals=!1;this.vertices=t,this.normals=i,this.uvs=n,this.indices=o}static instanciate(t,i=[],n=[],o=[]){return t||(t=[]),new Ti(t,i,n,o)}calculateNormals(){if(this.vertices.length===0){console.warn("Cannot calculate normals/indices: Mesh data has no vertices.");return}let t=this.vertices.length;this.normals=Array.from({length:t},()=>x.create());let i=Array.from({length:t},()=>x.create()),n=new Array(t).fill(0);for(let o=0;o<this.indices.length;o+=3){let s=this.indices[o],a=this.indices[o+1],l=this.indices[o+2];if(s>=t||a>=t||l>=t){console.warn(`Invalid index found in triangle ${Math.floor(o/3)}: [${s}, ${a}, ${l}]. Skipping triangle.`);continue}let u=this.vertices[s],c=this.vertices[a],h=this.vertices[l],m=x.sub(x.create(),c,u),p=x.sub(x.create(),h,u),v=x.create();x.cross(v,m,p),x.normalize(v,v),x.add(i[s],i[s],v),n[s]++,x.add(i[a],i[a],v),n[a]++,x.add(i[l],i[l],v),n[l]++}for(let o=0;o<t;o++){let s=i[o],a=n[o];a>0?(x.scale(this.normals[o],s,1/a),x.normalize(this.normals[o],this.normals[o])):x.set(this.normals[o],0,0,0)}}static getBoundingBox(t){if(t.length===0)return null;let i=t[0][0],n=t[0][0],o=t[0][1],s=t[0][1],a=t[0][2],l=t[0][2];for(let u of t){let c=u[0],h=u[1],m=u[2];i=Math.min(i,c),n=Math.max(n,c),o=Math.min(o,h),s=Math.max(s,h),a=Math.min(a,m),l=Math.max(l,m)}return new wi(i,n,o,s,a,l)}static getBoundingSphere(t){if(t.length===0)return null;let i=0,n=0,o=0;for(let m of t)i+=m[0],n+=m[1],o+=m[2];let s=t.length,a=i/s,l=n/s,u=o/s,c=0;for(let m of t){let p=m[0]-a,v=m[1]-l,f=m[2]-u,g=p*p+v*v+f*f;c=Math.max(c,g)}let h=Math.sqrt(c);return new Mi(a,l,u,h)}invertNormals(){if(this.normals.length===0){console.warn("No normals to invert: The normals array is empty.");return}for(let t=0;t<this.normals.length;t++)x.negate(this.normals[t],this.normals[t]);console.log("Normals inverted successfully.")}calculateTangentsAndBitangents(){if(!this.indices||this.indices.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no indices.");return}if(!this.uvs||this.uvs.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no UVs.");return}if(!this.normals||this.normals.length===0){console.warn("Cannot calculate tangents/bitangents: Mesh data has no normals.");return}let t=Array.from({length:this.vertices.length},()=>x.create()),i=Array.from({length:this.vertices.length},()=>x.create());for(let n=0;n<this.indices.length;n+=3){let o=this.indices[n],s=this.indices[n+1],a=this.indices[n+2],l=this.vertices[o],u=this.vertices[s],c=this.vertices[a],h=this.uvs[o],m=this.uvs[s],p=this.uvs[a],v=x.sub(x.create(),u,l),f=x.sub(x.create(),c,l),g=he.sub(he.create(),m,h),b=he.sub(he.create(),p,h),M=g[0]*b[1]-b[0]*g[1],w=Math.abs(M)<1e-6?0:1/M,S=x.create();S[0]=w*(b[1]*v[0]-g[1]*f[0]),S[1]=w*(b[1]*v[1]-g[1]*f[1]),S[2]=w*(b[1]*v[2]-g[1]*f[2]);let T=x.create();T[0]=w*(-b[0]*v[0]+g[0]*f[0]),T[1]=w*(-b[0]*v[1]+g[0]*f[1]),T[2]=w*(-b[0]*v[2]+g[0]*f[2]),x.add(t[o],t[o],S),x.add(t[s],t[s],S),x.add(t[a],t[a],S),x.add(i[o],i[o],T),x.add(i[s],i[s],T),x.add(i[a],i[a],T)}for(let n=0;n<this.vertices.length;++n){let o=this.normals[n],s=t[n];x.scaleAndAdd(s,s,o,-x.dot(o,s)),x.normalize(s,s);let a=i[n];x.cross(a,o,s),x.normalize(a,a)}this.tangents=t,this.bitangents=i}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,vertices:this.vertices,normals:this.normals,uvs:this.uvs,indices:this.indices||[],tangents:this.tangents||[],bitangents:this.bitangents||[]}}fromJson(t){super.fromJson(t),this.vertices=t.vertices,this.normals=t.normals,this.uvs=t.uvs,this.indices=t.indices,this.tangents=t.tangents,this.bitangents=t.bitangents}};d(Ti,"MeshData");var Z=Ti,po=class po extends q{constructor(){super("Mesh")}toJsonObject(){return{...super.toJsonObject(),meshData:this.meshData.toJsonObject()}}fromJson(r){super.fromJson(r),this.meshData=new Z([]),this.meshData.fromJson(r.meshData)}};d(po,"Mesh");var Ut=po;var st=class st{static addDependency(r,t,i){st.dependecies[r]=t,i&&(st.metadata[r]=i)}static getDependency(r){return st.dependecies[r]}static instanciateObjectFromJsonData(r,t){if(this.dependecies[r])return t&&t.length>0?this.dependecies[r](...t):this.dependecies[r]();console.warn("[warn] Class Object not found! Implement Class instancing for: ",r)}static getMetadata(r){let t=Object.values(st.metadata);if(!r)return t;let i=Array.isArray(r)?r:[r];return t.filter(n=>i.includes(n.type))}};d(st,"ObjectInstanciator"),st.dependecies={},st.metadata={};var G=st;var fo=class fo{constructor(r){this.BINDING_POINT=0;this.gl=r,this.ubo=r.createBuffer(),this.data=new Float32Array(32),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,this.ubo),this.gl.bufferData(this.gl.UNIFORM_BUFFER,this.data.byteLength,this.gl.DYNAMIC_DRAW),this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER,this.BINDING_POINT,this.ubo),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,null)}update(r,t){this.data.set(r,0),this.data.set(t,16),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,this.ubo),this.gl.bufferSubData(this.gl.UNIFORM_BUFFER,0,this.data),this.gl.bindBuffer(this.gl.UNIFORM_BUFFER,null)}};d(fo,"CameraUBO");var Ot=fo;var dr=class dr extends q{static get className(){return"Color"}static createFromJsonData(r){let t=new dr;return t.fromJson(r),t}get r(){return this.vector[0]}set r(r){this.vector[0]=r}get g(){return this.vector[1]}set g(r){this.vector[1]=r}get b(){return this.vector[2]}set b(r){this.vector[2]=r}get a(){return this.vector[3]}set a(r){this.vector[3]=r}constructor(r=1,t=1,i=1,n=1){super("Color"),this.vector=ve.fromValues(r,t,i,n)}toJsonObject(){return{...super.toJsonObject(),r:this.r,g:this.g,b:this.b,a:this.a}}fromJson(r){this.r=r.r,this.g=r.g,this.b=r.b,this.a=r.a}toVec3(){return x.fromValues(this.r,this.g,this.b)}toVec4(){return this.vector}clone(){return new dr(...this.vector)}set(r=1,t=1,i=1,n=1){this.vector[0]=r,this.vector[1]=t,this.vector[2]=i,this.vector[3]=n}static lerp(r,t,i){let n=new dr;return ve.lerp(n.vector,r.vector,t.vector,i),n}};d(dr,"Color");var y=dr;var vo=class vo{static get white(){return new y(1,1,1)}static get black(){return new y(0,0,0)}static get red(){return new y(1,0,0)}static get green(){return new y(0,1,0)}static get blue(){return new y(0,0,1)}static get yellow(){return new y(1,1,0)}static get cyan(){return new y(0,1,1)}static get magenta(){return new y(1,0,1)}static get gray(){return new y(.5,.5,.5)}static get grey(){return new y(.5,.5,.5)}static get clear(){return new y(0,0,0,0)}static get transparent(){return new y(0,0,0,0)}static get cornflowerBlue(){return new y(.392,.584,.929,1)}static get aliceBlue(){return new y(.941,.973,1)}static get antiqueWhite(){return new y(.98,.922,.843)}static get aqua(){return new y(0,1,1)}static get aquamarine(){return new y(.498,1,.831)}static get azure(){return new y(.941,1,1)}static get beige(){return new y(.961,.961,.863)}static get bisque(){return new y(1,.894,.769)}static get blanchedAlmond(){return new y(1,.922,.804)}static get blueViolet(){return new y(.541,.169,.886)}static get brown(){return new y(.647,.165,.165)}static get burlyWood(){return new y(.871,.722,.529)}static get cadetBlue(){return new y(.373,.62,.627)}static get chartreuse(){return new y(.498,1,0)}static get chocolate(){return new y(.824,.412,.118)}static get coral(){return new y(1,.498,.314)}static get crimson(){return new y(.863,.078,.235)}static get darkBlue(){return new y(0,0,.545)}static get darkCyan(){return new y(0,.545,.545)}static get darkGoldenrod(){return new y(.722,.525,.043)}static get darkGray(){return new y(.663,.663,.663)}static get darkGreen(){return new y(0,.392,0)}static get darkKhaki(){return new y(.741,.718,.42)}static get darkMagenta(){return new y(.545,0,.545)}static get darkOliveGreen(){return new y(.333,.42,.184)}static get darkOrange(){return new y(1,.549,0)}static get darkOrchid(){return new y(.6,.196,.8)}static get darkRed(){return new y(.545,0,0)}static get darkSalmon(){return new y(.914,.588,.478)}static get darkSeaGreen(){return new y(.557,.737,.557)}static get darkSlateBlue(){return new y(.282,.239,.545)}static get darkSlateGray(){return new y(.184,.31,.31)}static get darkTurquoise(){return new y(0,.808,.82)}static get darkViolet(){return new y(.58,0,.827)}static get deepPink(){return new y(1,.078,.576)}static get deepSkyBlue(){return new y(0,.749,1)}static get dimGray(){return new y(.412,.412,.412)}static get dodgerBlue(){return new y(.118,.565,1)}static get firebrick(){return new y(.698,.133,.133)}static get floralWhite(){return new y(1,.98,.941)}static get forestGreen(){return new y(.133,.545,.133)}static get fuchsia(){return new y(1,0,1)}static get gainsboro(){return new y(.863,.863,.863)}static get ghostWhite(){return new y(.973,.973,1)}static get gold(){return new y(1,.843,0)}static get goldenrod(){return new y(.855,.647,.125)}static get greenYellow(){return new y(.678,1,.184)}static get honeydew(){return new y(.941,1,.941)}static get hotPink(){return new y(1,.412,.706)}static get indianRed(){return new y(.804,.361,.361)}static get indigo(){return new y(.294,0,.51)}static get ivory(){return new y(1,1,.941)}static get khaki(){return new y(.941,.902,.549)}static get lavender(){return new y(.902,.902,.98)}static get lavenderBlush(){return new y(1,.941,.961)}static get lawnGreen(){return new y(.486,.988,0)}static get lemonChiffon(){return new y(1,.98,.804)}static get lightBlue(){return new y(.678,.847,.902)}static get lightCoral(){return new y(.941,.502,.502)}static get lightCyan(){return new y(.878,1,1)}static get lightGoldenrodYellow(){return new y(.98,.98,.824)}static get lightGray(){return new y(.827,.827,.827)}static get lightGreen(){return new y(.565,.933,.565)}static get lightPink(){return new y(1,.714,.757)}static get lightSalmon(){return new y(1,.627,.478)}static get lightSeaGreen(){return new y(.125,.698,.667)}static get lightSkyBlue(){return new y(.529,.808,.98)}static get lightSlateGray(){return new y(.467,.533,.6)}static get lightSteelBlue(){return new y(.69,.769,.871)}static get lightYellow(){return new y(1,1,.878)}static get lime(){return new y(0,1,0)}static get limeGreen(){return new y(.196,.804,.196)}static get linen(){return new y(.98,.941,.902)}static get maroon(){return new y(.5,0,0)}static get mediumAquamarine(){return new y(.4,.804,.667)}static get mediumBlue(){return new y(0,0,.804)}static get mediumOrchid(){return new y(.729,.333,.827)}static get mediumPurple(){return new y(.576,.439,.859)}static get mediumSeaGreen(){return new y(.235,.702,.443)}static get mediumSlateBlue(){return new y(.482,.408,.933)}static get mediumSpringGreen(){return new y(0,.98,.604)}static get mediumTurquoise(){return new y(.282,.82,.8)}static get mediumVioletRed(){return new y(.78,.082,.522)}static get midnightBlue(){return new y(.098,.098,.439)}static get mintCream(){return new y(.961,1,.98)}static get mistyRose(){return new y(1,.894,.882)}static get moccasin(){return new y(1,.894,.71)}static get navajoWhite(){return new y(1,.871,.678)}static get navy(){return new y(0,0,.5)}static get oldLace(){return new y(.992,.961,.902)}static get olive(){return new y(.5,.5,0)}static get oliveDrab(){return new y(.42,.557,.137)}static get orange(){return new y(1,.647,0)}static get orangeRed(){return new y(1,.271,0)}static get orchid(){return new y(.855,.439,.839)}static get paleGoldenrod(){return new y(.933,.91,.667)}static get paleGreen(){return new y(.596,.984,.596)}static get paleTurquoise(){return new y(.686,.933,.933)}static get paleVioletRed(){return new y(.859,.439,.576)}static get papayaWhip(){return new y(1,.937,.835)}static get peachPuff(){return new y(1,.855,.725)}static get peru(){return new y(.804,.522,.247)}static get pink(){return new y(1,.753,.796)}static get plum(){return new y(.867,.627,.867)}static get powderBlue(){return new y(.69,.878,.902)}static get purple(){return new y(.5,0,.5)}static get rosyBrown(){return new y(.737,.561,.561)}static get royalBlue(){return new y(.255,.412,.882)}static get saddleBrown(){return new y(.545,.271,.075)}static get salmon(){return new y(.98,.502,.447)}static get sandyBrown(){return new y(.957,.643,.376)}static get seaGreen(){return new y(.18,.545,.341)}static get seaShell(){return new y(1,.961,.933)}static get sienna(){return new y(.627,.322,.176)}static get silver(){return new y(.753,.753,.753)}static get skyBlue(){return new y(.529,.808,.922)}static get slateBlue(){return new y(.416,.353,.804)}static get slateGray(){return new y(.439,.5,.565)}static get snow(){return new y(1,.98,.98)}static get springGreen(){return new y(0,1,.498)}static get steelBlue(){return new y(.275,.51,.706)}static get tan(){return new y(.824,.706,.549)}static get teal(){return new y(0,.5,.5)}static get thistle(){return new y(.847,.749,.847)}static get tomato(){return new y(1,.388,.278)}static get turquoise(){return new y(.251,.878,.816)}static get violet(){return new y(.933,.51,.933)}static get wheat(){return new y(.961,.871,.702)}static get whiteSmoke(){return new y(.961,.961,.961)}static get yellowGreen(){return new y(.604,.804,.196)}};d(vo,"Colors");var hr=vo;var at=class at{static getMousePosition(){return{...this.mousePosition}}static getMouseMovement(){return{...this.mouseMovement}}static isMouseButtonDown(r){return this.mouseButtonDown[r]===!0}static getMouseWheelDelta(){return{x:this.wheelX,y:this.wheelY}}};d(at,"Mouse"),at.mouseButtonDown={},at.mouseClickPosition={x:0,y:0},at.mousePosition={x:0,y:0},at.mouseMovement={x:0,y:0},at.wheelX=0,at.wheelY=0;var ne=at,mr=class mr{static isKeyDown(r){return this.keyPress[r.toLowerCase()]===!0}static isKeyPressed(r){return this.keyDown[r.toLowerCase()]===!0}static isKeyReleased(r){return this.keyUp[r.toLowerCase()]===!0}};d(mr,"Keybord"),mr.keyDown={},mr.keyUp={},mr.keyPress={};var pe=mr,Ei=class Ei{static get gamepads(){return this._gamepads}static update(){this._gamepads=Array.from(navigator.getGamepads())}};d(Ei,"GamepadManager"),Ei._gamepads=[];var Si=Ei;var go=class go extends q{constructor(t,i=0,n=0,o=0){super("Range");this._value=t;this._min=i;this._max=n;this._step=o}toJsonObject(){return{...super.toJsonObject(),min:this._min,max:this._max,step:this._step,value:this._value}}fromJson(t){this.min=t.min,this.max=t.max,this.step=t.step,this.value=t.value}get value(){return this._value}set value(t){this._value=Math.max(this._min,Math.min(this._max,t))}get min(){return this._min}set min(t){this._min=t,this._min>this._max&&(this._max=this._min),this.value=this._value}get max(){return this._max}set max(t){this._max=t,this._max<this._min&&(this._min=this._max),this.value=this._value}get step(){return this._step}set step(t){this._step=t}};d(go,"NumberRange");var K=go;var bo=class bo extends q{constructor(t="Scene Fog"){super("SceneFog");this.name=t;this.enabled=!0;this.fogType=0;this.distance=.01;this.density=.001;this.heightFalloff=0;this.baseHeight=0;this.color=hr.grey}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(bo,"SceneFog");var Ai=bo;var Ri=class Ri extends q{static get className(){return"Vector2"}get vector(){return this._vec}get x(){return this.vector[0]}set x(r){this.vector[0]=r}get y(){return this.vector[1]}set y(r){this.vector[1]=r}constructor(r=0,t=0){super("Vector2"),this._vec=he.fromValues(r,t)}fromJson(r){super.fromJson(r),this.x=r.x,this.y=r.y}toJsonObject(){return{type:this.constructor.name,className:Ri.className,x:this.x,y:this.y}}set(r=0,t=0){this.x=r,this.y=t}};d(Ri,"Vector2");var pr=Ri,Ci=class Ci extends pr{constructor(t=0,i=0,n=0){super(t,i);this._className="Vector3";this._vec=x.fromValues(t,i,n)}get vector(){return this._vec}get x(){return this.vector[0]}set x(t){this.vector[0]=t}get y(){return this.vector[1]}set y(t){this.vector[1]=t}get z(){return this.vector[2]}set z(t){this.vector[2]=t}fromJson(t){super.fromJson(t),this.z=t.z}toJsonObject(){return{...super.toJsonObject(),className:Ci.className,z:this.z}}set(t=0,i=0,n=0){super.set(t,i),this.z=n}};d(Ci,"Vector3");var Fe=Ci;function xo(e,r){let t=r[0],i=r[1],n=r[2],o=r[3],s=Math.max(-1,Math.min(1,2*(o*i-n*t)));e[0]=Math.atan2(2*(o*t+i*n),1-2*(t*t+i*i)),e[1]=Math.asin(s),e[2]=Math.atan2(2*(o*n+t*i),1-2*(i*i+n*n))}d(xo,"toEuler");var yo=class yo extends q{constructor(){super("Transform");this._parent=null;this._children=[];this._dirty=!0;this.parentEntity=null;this._position=x.create(),this._rotation=B.create(),this._rotationInDegrees=x.create(),this._scale=x.fromValues(1,1,1),this._modelMatrix=E.create(),this._localMatrix=E.create(),this._uuid=ot(),this._dirty=!0}static get className(){return"Transform"}get modelMatrix(){return this.current}get current(){return this._dirty&&this.updateMatrices(),this._modelMatrix}get localPosition(){return this._position}get localRotation(){return this._rotationInDegrees}get localRotationQuat(){return this._rotation}get localScale(){return this._scale}get worldPosition(){let t=x.create();return E.getTranslation(t,this.current),t}set worldPosition(t){if(this._parent){let i=E.create();E.invert(i,this._parent.modelMatrix),x.transformMat4(this._position,t,i)}else x.copy(this._position,t);this._dirty=!0}get worldRotationQuat(){let t=B.create();return E.getRotation(t,this.current),t}set worldRotationQuat(t){if(this._parent){let i=B.create();B.invert(i,this._parent.worldRotationQuat),B.multiply(this._rotation,i,t)}else B.copy(this._rotation,t);B.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}get worldRotation(){let t=x.create();return xo(t,this.worldRotationQuat),x.scale(t,t,180/Math.PI),t}set worldRotation(t){let i=B.create();B.fromEuler(i,t[0],t[1],t[2]),this.worldRotationQuat=i}get worldScale(){let t=x.create();return E.getScaling(t,this.current),t}set worldScale(t){if(this._parent){let i=this._parent.worldScale;this._scale[0]=t[0]/i[0],this._scale[1]=t[1]/i[1],this._scale[2]=t[2]/i[2]}else x.copy(this._scale,t);this._dirty=!0}get parent(){return this._parent}get children(){return this._children}setLocalPosition(t=0,i=0,n=0){x.set(this._position,t,i,n),this._dirty=!0}setLocalRotation(t=0,i=0,n=0){x.set(this._rotationInDegrees,t,i,n),B.fromEuler(this._rotation,t,i,n),this._dirty=!0}setLocalScale(t=1,i=1,n=1){x.set(this._scale,t,i,n),this._dirty=!0}setWorldPosition(t=0,i=0,n=0){this.worldPosition=x.fromValues(t,i,n)}setWorldRotation(t=0,i=0,n=0){this.worldRotation=x.fromValues(t,i,n)}setWorldScale(t=1,i=1,n=1){this.worldScale=x.fromValues(t,i,n)}translate(t=0,i=0,n=0){x.add(this._position,this._position,x.fromValues(t,i,n)),this._dirty=!0}rotate(t=0,i=0,n=0){let o=B.create();B.fromEuler(o,t,i,n),B.multiply(this._rotation,this._rotation,o),B.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}scale(t=1,i=1,n=1){x.multiply(this._scale,this._scale,x.fromValues(t,i,n)),this._dirty=!0}updateMatrices(){let t=this._dirty;t&&(E.fromRotationTranslationScale(this._localMatrix,this._rotation,this._position,this._scale),this._parent?E.multiply(this._modelMatrix,this._parent.current,this._localMatrix):E.copy(this._modelMatrix,this._localMatrix),this._dirty=!1);for(let i of this._children)i.setDirty(t||i._dirty),i.updateMatrices()}setParent(t){if(this._parent){let i=this._parent._children.indexOf(this);i>-1&&this._parent._children.splice(i,1)}this._parent=t,this._parent&&this._parent._children.push(this),this._dirty=!0}get right(){let t=this.current;return x.fromValues(t[0],t[1],t[2])}get left(){return x.negate(x.create(),this.right)}get up(){let t=this.current;return x.fromValues(t[4],t[5],t[6])}get down(){return x.negate(x.create(),this.up)}get forward(){let t=this.current;return x.fromValues(t[8],t[9],t[10])}get back(){return x.negate(x.create(),this.forward)}lookAt(t,i){let n=t instanceof Fe?t.vector:t,o=i instanceof Fe?i.vector:i||x.fromValues(0,1,0),s=this.worldPosition,a=x.normalize(x.create(),x.sub(x.create(),n,s)),l=x.normalize(x.create(),x.cross(x.create(),o,a)),u=x.cross(x.create(),a,l),c=E.fromValues(l[0],l[1],l[2],0,u[0],u[1],u[2],0,a[0],a[1],a[2],0,s[0],s[1],s[2],1),h=B.create();E.getRotation(h,c),this.worldRotationQuat=h,this._dirty=!0}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,parent:this.parent?.uuid,position:[this.localPosition[0],this.localPosition[1],this.localPosition[2]],rotation:[this.localRotation[0],this.localRotation[1],this.localRotation[2]],scale:[this.localScale[0],this.localScale[1],this.localScale[2]]}}fromJson(t){super.fromJson(t),this.setLocalPosition(t.position[0],t.position[1],t.position[2]),this.setLocalRotation(t.rotation[0],t.rotation[1],t.rotation[2]),this.setLocalScale(t.scale[0],t.scale[1],t.scale[2]),this._dirty=!0}rotateByQuat(t){B.multiply(this._rotation,t,this._rotation),B.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}setDirty(t){this._dirty=t}setLocalRotationQuat(t){B.copy(this._rotation,t),B.normalize(this._rotation,this._rotation),this.updateEulerFromQuat(),this._dirty=!0}updateEulerFromQuat(){let t=x.create();xo(t,this._rotation),x.scale(this._rotationInDegrees,t,180/Math.PI)}getEulerFromQuat(t){let i=x.create();return xo(i,t),x.scale(i,i,180/Math.PI),i}};d(yo,"Transform");var Je=yo;Object.defineProperty(Je.prototype,"position",{get:d(function(){return this.localPosition},"get")});Object.defineProperty(Je.prototype,"rotation",{get:d(function(){return this.localRotation},"get")});Object.defineProperty(Je.prototype,"rotationQuat",{get:d(function(){return this.localRotationQuat},"get")});var Ur=class Ur{};d(Ur,"ShaderSources"),Ur.frag={entity_picker:"assets/shaders/editor/entity-picker.frag",handle:"assets/shaders/editor/handle/handle.frag",entity:"assets/shaders/editor/picker/entity.frag",color:"assets/shaders/frag/color.frag",default_lit:"assets/shaders/frag/default-lit.frag",default_unlit:"assets/shaders/frag/default-unlit.frag",depth_only:"assets/shaders/frag/depth-only.frag",screen_blit:"assets/shaders/frag/screen-blit.frag",skybox:"assets/shaders/frag/skybox.frag",fog:"assets/shaders/functions/fog.frag",functions:"assets/shaders/functions/functions.frag",light:"assets/shaders/functions/light.frag",copy_with_depth:"assets/shaders/post-processing/copy-with-depth.frag",retro:"assets/shaders/post-processing/retro.frag",bitangent:"assets/shaders/tools/bitangent.frag",normal:"assets/shaders/tools/normal.frag",tangent:"assets/shaders/tools/tangent.frag",uv:"assets/shaders/tools/uv.frag"},Ur.vertex={handle:"assets/shaders/editor/handle/handle.vert",entity:"assets/shaders/editor/picker/entity.vert",default:"assets/shaders/vertex/default.vert",fullscreen:"assets/shaders/vertex/fullscreen.vert",screen_quad:"assets/shaders/vertex/screen-quad.vert",shadow_caster:"assets/shaders/vertex/shadow-caster.vert",skybox:"assets/shaders/vertex/skybox.vert"};var oe=Ur;var _o=(t=>(t[t.SRC_ALPHA=WebGL2RenderingContext.SRC_ALPHA]="SRC_ALPHA",t[t.ONE=WebGL2RenderingContext.ONE]="ONE",t))(_o||{}),wo=(i=>(i[i.ONE_MINUS_SRC_ALPHA=WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA]="ONE_MINUS_SRC_ALPHA",i[i.ONE=WebGL2RenderingContext.ONE]="ONE",i[i.ZERO=WebGL2RenderingContext.ZERO]="ZERO",i))(wo||{});var bm=(n=>(n[n.Color=WebGL2RenderingContext.COLOR_BUFFER_BIT]="Color",n[n.Depth=WebGL2RenderingContext.DEPTH_BUFFER_BIT]="Depth",n[n.Stencil=WebGL2RenderingContext.STENCIL_BUFFER_BIT]="Stencil",n[n.ColorAndDepth=WebGL2RenderingContext.COLOR_BUFFER_BIT|WebGL2RenderingContext.DEPTH_BUFFER_BIT]="ColorAndDepth",n))(bm||{});var Mo=(i=>(i[i.FRONT=WebGL2RenderingContext.FRONT]="FRONT",i[i.BACK=WebGL2RenderingContext.BACK]="BACK",i[i.NONE=WebGL2RenderingContext.NONE]="NONE",i))(Mo||{});var To=(a=>(a[a.Less=WebGL2RenderingContext.LESS]="Less",a[a.LessOrEqual=WebGL2RenderingContext.LEQUAL]="LessOrEqual",a[a.Greater=WebGL2RenderingContext.GREATER]="Greater",a[a.GreaterOrEqual=WebGL2RenderingContext.GEQUAL]="GreaterOrEqual",a[a.Equal=WebGL2RenderingContext.EQUAL]="Equal",a[a.Always=WebGL2RenderingContext.ALWAYS]="Always",a[a.Never=WebGL2RenderingContext.NEVER]="Never",a))(To||{});var So=(t=>(t[t.CounterClockwise=WebGL2RenderingContext.CCW]="CounterClockwise",t[t.Clockwise=WebGL2RenderingContext.CW]="Clockwise",t))(So||{});function Or(){return{center:x.create(),radius:0}}d(Or,"createSphere");function Gr(e,r=new Float32Array(24)){let t=d((i,n)=>e[n*4+i],"row");for(let i=0;i<6;i++){let n=i>>1,o=i&1?-1:1,s=t(3,0)+o*t(n,0),a=t(3,1)+o*t(n,1),l=t(3,2)+o*t(n,2),u=t(3,3)+o*t(n,3),c=Math.hypot(s,a,l)||1;r[i*4]=s/c,r[i*4+1]=a/c,r[i*4+2]=l/c,r[i*4+3]=u/c}return r}d(Gr,"frustumPlanes");function zr(e,r,t){for(let i=0;i<24;i+=4)if(e[i]*r[0]+e[i+1]*r[1]+e[i+2]*r[2]+e[i+3]<-t)return!1;return!0}d(zr,"sphereInFrustum");var za=new WeakMap;function Va(e){let r=e?.vertices;if(!r?.length)return null;let t=za.get(r);if(t)return t;let i=x.fromValues(1/0,1/0,1/0),n=x.fromValues(-1/0,-1/0,-1/0);for(let l of r)x.min(i,i,l),x.max(n,n,l);let o=x.lerp(x.create(),i,n,.5),s=0;for(let l of r)s=Math.max(s,x.squaredDistance(o,l));let a={center:o,radius:Math.sqrt(s)};return za.set(r,a),a}d(Va,"localBoundingSphere");function Eo(e){return Math.sqrt(Math.max(e[0]*e[0]+e[1]*e[1]+e[2]*e[2],e[4]*e[4]+e[5]*e[5]+e[6]*e[6],e[8]*e[8]+e[9]*e[9]+e[10]*e[10]))}d(Eo,"maxScale");function Wa(e,r,t){return x.transformMat4(e.center,r.center,t),e.radius=r.radius*Eo(t),e}d(Wa,"transformSphere");var Ha=E.create(),Ja=new Float32Array(24),Ao=Or();function qa(e,r,t,i=!0){let n=r.transform.worldPosition;E.multiply(Ha,r.projectionMatrix,r.viewMatrix),Gr(Ha,Ja);let s=e.objects.filter(u=>u.active&&u.show).map(u=>({entity:u,renderer:u.getBehaviour(Te),distance:x.distance(u.transform.worldPosition,n)})).filter(u=>!!u.renderer),a=d(u=>!i||!u.renderer.worldBounds(Ao)||zr(Ja,Ao.center,Ao.radius),"inView"),l=d(u=>s.filter(c=>c.renderer.renderLayer===u),"layer");return{camera:r,opaque:l(2).filter(a).sort((u,c)=>u.distance-c.distance).map(u=>u.entity),skybox:l(5).map(u=>u.entity),transparent:l(3).filter(a).sort((u,c)=>c.distance-u.distance).map(u=>u.entity),lights:e.lights.filter(u=>u.active&&u.show),shadowCasters:s.filter(u=>u.renderer.castShadows&&u.renderer.renderLayer!==5).map(u=>u.entity),time:t}}d(qa,"buildFrameData");var Co=5,Li=20,fr=20,xm=1,Ya=(()=>{let e=0,r=d(t=>{let i=e;return e+=t,i},"take");return{ambient:r(1),counts:r(1),dirDirection:r(Co),dirColor:r(Co),pointPosition:r(Li),pointColor:r(Li),pointAtten:r(Li),spotPosition:r(fr),spotDirection:r(fr),spotColor:r(fr),spotCone:r(fr),spotAtten:r(fr),slots:e}})(),ym=[.01,.01,.01,1];function _m(e,r=new Map,t){let i=Ya,n=t??new Float32Array(i.slots*4);n.fill(0);let o=new Int32Array(n.buffer,n.byteOffset,n.length),s=d((f,g,b,M,_)=>n.set([g,b,M,_],f*4),"set"),a=d(f=>[f.color.r*f.color.a,f.color.g*f.color.a,f.color.b*f.color.a],"intensity"),l=d(f=>r.get(f)??-1,"slotOf"),u=e.find(f=>f.entityType===0);n.set(u?u.color.toVec4():ym,i.ambient*4);let c=e.filter(f=>f.entityType===1).slice(0,Co),h=e.filter(f=>f.entityType===2).slice(0,Li),m=e.filter(f=>f.entityType===3).slice(0,fr);o.set([c.length,h.length,m.length,0],i.counts*4);let p=x.create();c.forEach((f,g)=>{x.normalize(p,f.direction),s(i.dirDirection+g,p[0],p[1],p[2],0),s(i.dirColor+g,...a(f),l(f))}),h.forEach((f,g)=>{let b=f.transform.worldPosition;s(i.pointPosition+g,b[0],b[1],b[2],f.range),s(i.pointColor+g,...a(f),l(f)),s(i.pointAtten+g,f.attenuation.constant,f.attenuation.linear,f.attenuation.quadratic,0)});let v=Math.PI/180;return m.forEach((f,g)=>{let b=f.transform.worldPosition;x.normalize(p,f.toLightDirection),s(i.spotPosition+g,b[0],b[1],b[2],f.range),s(i.spotDirection+g,p[0],p[1],p[2],0),s(i.spotColor+g,...a(f),l(f)),s(i.spotCone+g,Math.cos(f.coneAngles.inner*v),Math.cos(f.coneAngles.outer*v),0,0),s(i.spotAtten+g,f.attenuation.constant,f.attenuation.linear,f.attenuation.quadratic,0)}),n}d(_m,"packLights");var Lo=class Lo{constructor(r){this.gl=r;this.data=new Float32Array(Ya.slots*4);this.buffer=r.createBuffer(),r.bindBuffer(r.UNIFORM_BUFFER,this.buffer),r.bufferData(r.UNIFORM_BUFFER,this.data.byteLength,r.DYNAMIC_DRAW),r.bindBuffer(r.UNIFORM_BUFFER,null)}update(r,t){_m(r,t,this.data);let i=this.gl;i.bindBuffer(i.UNIFORM_BUFFER,this.buffer),i.bufferSubData(i.UNIFORM_BUFFER,0,this.data),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,xm,this.buffer)}dispose(){this.gl.deleteBuffer(this.buffer)}};d(Lo,"LightsUBO");var Xi=Lo;var wt={"assets/shaders/editor/entity-picker.frag":`#version 300 es
precision highp float;

uniform float u_entity_id;
out vec4 fragColor;

void main() { fragColor = vec4(u_entity_id / 255.0, 0.0, 0.0, 1.0); }
`,"assets/shaders/editor/handle/handle.frag":`#version 300 es

precision mediump float;
in vec3 v_position;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_position,1.0);
}
`,"assets/shaders/editor/handle/handle.vert":`#version 300 es

in vec3 a_position;
in mat4 aInstanceModelMatrix; // This attribute will advance once per instance

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

out vec3 v_position;

void main(void) {
  v_position = a_position;
  gl_Position =      uProjectionMatrix * uViewMatrix * aInstanceModelMatrix * vec4(a_position,0);
}
`,"assets/shaders/editor/picker/entity.frag":`#version 300 es
precision highp float;
uniform float u_id;
out vec4 outColor;
void main() { outColor = vec4(u_id / 255.0, 0.0, 0.0, 1.0); }
`,"assets/shaders/editor/picker/entity.vert":`#version 300 es

layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

uniform mat4 u_modelMatrix;

in vec4 a_position;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
}`,"assets/shaders/frag/color.frag":`#version 300 es

precision mediump float;
uniform vec4 u_matColor;
uniform float u_id;

in vec2 v_uv;
out vec4 fragColor;

void main() {
  fragColor = u_matColor;
  if (u_id > 0.0) {
    fragColor = vec4(u_id / 255.0, 0.0, 0.0, 1.0);
  }
}
`,"assets/shaders/frag/default-lit.frag":`#version 300 es
precision highp float;

uniform int u_fogEnabled; 

uniform sampler2D u_mainTex;
uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform float u_emmission;
uniform float u_id;
uniform float u_sid;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

@INCLUDE_UTIL_FUNC
@INCLUDE_LIGHT_FUNC
@INCLUDE_FOG_FUNC
void main() {
    vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
    vec4 sampledTexColor = texture(u_mainTex, uv);
    
    // We add a tiny offset (0.0001) to avoid pow(0, ...) undefined behavior in some older drivers
    vec3 linearTexColor = pow(sampledTexColor.rgb + 0.0001, vec3(2.2));
    vec3 linearMatColor = pow(u_matColor.rgb + 0.0001, vec3(2.2)); 
    
    vec4 baseColor = vec4(linearTexColor * linearMatColor, (u_matColor.a * sampledTexColor.a));

    // Lighting calculation (math is now accurately happening in linear space)
    vec3 totalLitColorRGB = calculateTotalLitColor(baseColor.rgb, uv);

    // Linear and unclamped: lights may go above 1 (HDR); the pipeline's final
    // copy tone maps and gamma-encodes.
    vec4 finalColor = vec4(max(totalLitColorRGB, 0.0), baseColor.a);
    vec3 foggedRGB = finalColor.rgb;

    // Fog application (fog math also blends much better in linear space)
    if (u_fogEnabled == 1) {
        vec3 mainLightDir = u_lightCounts.x > 0 ? u_dirDirection[0].xyz : vec3(0.0);
        vec3 mainLightCol = u_lightCounts.x > 0 ? u_dirColor[0].rgb : vec3(0.0);
        
        foggedRGB = applyFog(
            finalColor.rgb, 
            v_fogDistance, 
            v_position, 
            u_cameraPosition, 
            u_lightCounts.x, 
            mainLightDir, 
            mainLightCol
        );
    }
  
    fragColor = vec4(max(foggedRGB, 0.0), finalColor.a);
}`,"assets/shaders/frag/default-unlit.frag":`#version 300 es

precision mediump float;
uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform float u_id;

in vec2 v_uv;
in vec3 v_position;

out vec4 fragColor;


void main() {
  vec2 uv = v_uv * u_uvScale + u_uvOffset;
  vec4 color = texture(u_mainTex, uv) * u_matColor;
  // Textures and colours are sRGB; the scene is drawn in linear colour and the
  // pipeline's final copy gamma-encodes it.
  fragColor = vec4(pow(color.rgb, vec3(2.2)), color.a);
}
`,"assets/shaders/frag/depth-only.frag":`#version 300 es
precision highp float;

void main() {
    // The main purpose of this shader is to render the depth
    // to the framebuffer. Since we are using a depth texture,
    // we don't need to write anything to fragColor. The depth
    // value is automatically stored by the GPU.
    // So, this main function can be empty.
}
`,"assets/shaders/frag/screen-blit.frag":`#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_screenTexture;
out vec4 fragColor;

void main() {
    // Sample the rendered scene texture
    vec4 texColor = texture(u_screenTexture, v_uv);
    fragColor = vec4(texColor.rgb, 1.0);
}`,"assets/shaders/frag/skybox.frag":`#version 300 es

// highp: the star and cloud hashes need 32-bit floats; mediump is 16-bit on phone GPUs
// and turns the stars into streaks. The hashes themselves avoid sin() (functions.frag).
precision highp float;

// --- GLOBAL SAMPLERS & ENVIRONMENT ---
uniform samplerCube u_mainTex;
uniform vec4 u_matColor;
uniform float u_time;

// --- PROCEDURAL SKY UNIFORMS ---
uniform vec4 u_skyColor;
uniform vec4 u_horizonColor;
uniform vec4 u_groundColor;
uniform float u_exponent;

// --- SUN UNIFORMS ---
uniform int u_useSun;
uniform vec3 u_sunDirection;
uniform vec4 u_sunColor;
uniform float u_sunSize;    
uniform float u_sunFalloff; 

// --- MOON UNIFORMS ---
uniform int u_useMoon;
uniform vec3 u_moonDirection;
uniform vec4 u_moonColor;
uniform float u_moonSize;
uniform float u_moonFalloff;
uniform float u_moonPhase;
uniform float u_moonEarthshine;
uniform float u_moonTerminatorSoftness;
uniform int u_moonEnableRotation;
uniform float u_moonRotationSpeed;

// --- CLOUDS UNIFORMS ---
uniform int u_useClouds;
uniform float u_cloudSeed;
uniform float u_cloudTiling;
uniform float u_weatherCondition;
uniform float u_cloudSparsity;
uniform float u_windCloudSpeed;
uniform float u_cloudSpeed;
uniform int u_cloudRepetition;

// --- STARS UNIFORMS ---
uniform int u_useStars;
uniform float u_starIntensity;
uniform float u_starScale;
uniform float u_starSparsity;
uniform float u_starSpeed;

in vec3 v_viewDirection;
out vec4 fragColor;

// --- EXTERNAL NOISE/UTILITY MACRO ---
@INCLUDE_UTIL_FUNC


// --- GLOBAL WEATHER COMMUNICATOR INTERFACE ---
float g_cloudAlpha = 0.0;
vec3 g_cloudColor  = vec3(0.0);

// --- FUNCTION PROTOTYPES ---
vec3 drawStars(vec3 currentSkyColor, vec3 viewDir);
vec3 drawClouds(vec3 currentSkyColor, vec3 viewDir);
vec3 drawSun(vec3 viewDir);
vec3 drawMoon(vec3 currentSkyColor, vec3 viewDir);

// --- MAIN PIPELINE EXECUTION ---
void main() {
    vec3 viewDir = normalize(v_viewDirection);

    // 1. Sample the background cubemap
    vec4 sampledTexColor = texture(u_mainTex, viewDir);
    
    // 2. Convert from sRGB to Linear Space (Gamma Correction In)
    vec3 linearTexColor = pow(sampledTexColor.rgb + 0.0001, vec3(2.2));
    vec3 linearMatColor = pow(u_matColor.rgb + 0.0001, vec3(2.2));
    vec3 baseTexColor = linearTexColor * linearMatColor;

    // 3. Calculate Procedural Sky Gradient
    float y = viewDir.y;
    float absY = abs(y);
    float p = pow(absY, u_exponent);
    vec3 targetColor = (y > 0.0) ? u_skyColor.rgb : u_groundColor.rgb;
    vec3 gradientColor = mix(u_horizonColor.rgb, targetColor, p);

    // 4. Blend the Texture and the Procedural Gradient
    // Multiplying them tints the cubemap with your procedural sky colors.
    // (If you want the texture to completely overwrite the sky gradient, 
    // change this to: vec3 finalColor = mix(gradientColor, baseTexColor, u_matColor.a);)
    vec3 finalColor = gradientColor * baseTexColor;

    // 5. Apply Procedural Elements
    if(u_useStars == 1 && u_sunDirection.y < 0.0){
       finalColor = drawStars(finalColor, viewDir);
    }
    if(u_useClouds == 1){
      finalColor = drawClouds(finalColor, viewDir); 
    }

    // Sun is only visible when it's above the horizon
    if (u_useSun == 1 && u_sunDirection.y > -0.1) {
        float sunOcclusion = 1.0 - (g_cloudAlpha * 0.95); 
        finalColor += drawSun(viewDir) * sunOcclusion;
    }

    if (u_useMoon == 1 && u_moonDirection.y > -0.1) {
        finalColor = drawMoon(finalColor, viewDir);
    }

    // Linear out: the pipeline's final copy tone maps and gamma-encodes.
    fragColor = vec4(max(finalColor, 0.0), 1.0);
}

// --- RENDERING SUBSYSTEM IMPLEMENTATIONS ---
float calculateMoonTexture(vec3 normal, float frequency) {
    vec3 p = normal * frequency;
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 3; i++) {
        value += amplitude * noise3D(p);
        p *= 2.5; 
        amplitude *= 0.5; 
    }
    return value;
}

vec3 drawStars(vec3 currentSkyColor, vec3 viewDir) {
    if (viewDir.y < 0.0) {
        return currentSkyColor;
    }

    // =========================================================================
    // CONFIGURATION PROPERTIES (STARFIELD SYSTEM)
    // =========================================================================
    const float c_starClusterFreq = 2.9;                          // Frequency scale of the cosmic galaxy banding patterns
    const float c_starClusterCut  = 0.35;                          // Contrast threshold cutoff defining empty space dark voids
    const vec3 c_rotationAxis     = vec3(0.1961, 0.8825, 0.0981); // Pre-normalized 3D directional vector axis of Earth's tilt

    float angle = u_time * u_starSpeed;
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    mat3 rotationMatrix = mat3(
        oc * c_rotationAxis.x * c_rotationAxis.x + c,                    oc * c_rotationAxis.x * c_rotationAxis.y - c_rotationAxis.z * s, oc * c_rotationAxis.x * c_rotationAxis.z + c_rotationAxis.y * s,
        oc * c_rotationAxis.x * c_rotationAxis.y + c_rotationAxis.z * s, oc * c_rotationAxis.y * c_rotationAxis.y + c,                    oc * c_rotationAxis.y * c_rotationAxis.z - c_rotationAxis.x * s,
        oc * c_rotationAxis.x * c_rotationAxis.z - c_rotationAxis.y * s, oc * c_rotationAxis.y * c_rotationAxis.z + c_rotationAxis.x * s, oc * c_rotationAxis.z * c_rotationAxis.z + c
    );

    vec3 rotatedViewDir = rotationMatrix * viewDir;

    vec3 moonDir = normalize(u_moonDirection);
    float moonDot = max(0.0, dot(viewDir, moonDir));
    float d2 = 1.0 - moonDot * moonDot;
    float R2 = 1.0 - u_moonSize * u_moonSize;
    
    if (u_useMoon == 1 && d2 <= R2) {
        return currentSkyColor;
    }

    vec3 starCoord = rotatedViewDir * u_starScale; 
    vec3 i = floor(starCoord);
    vec3 f = fract(starCoord);
    
    float distToCenter = length(f - vec3(0.5));
    float pointMask = smoothstep(0.4, 0.0, distToCenter);

    float nightFactor = smoothstep(0.1, -0.2, u_sunDirection.y); 
    float dynamicExponent = mix(45.0, u_starSparsity, nightFactor);
    
    float rawNoise = hash3D(i);
    float starMask = pow(rawNoise, dynamicExponent) * pointMask; 

    if (starMask <= 0.0) {
        return currentSkyColor;
    }

    float densityNoise = calculateMoonTexture(rotatedViewDir, c_starClusterFreq);
    float densityMask = smoothstep(c_starClusterCut, c_starClusterCut + 0.3, densityNoise);
    starMask *= mix(0.1, 1.0, densityMask);

    float horizonFade = smoothstep(0.04, 0.25, viewDir.y); 
    float dynamicIntensity = mix(0.5, u_starIntensity, nightFactor);
    float finalStarIntensity = starMask * horizonFade * dynamicIntensity;

    float colorSeed = hash3D(i + vec3(12.34, 56.78, 90.12));
    vec3 icyBlue    = vec3(0.75, 0.88, 1.00);
    vec3 warmAmber  = vec3(1.00, 0.92, 0.78);
    vec3 cleanWhite = vec3(0.98, 0.98, 1.00);
    
    vec3 starColor = cleanWhite;
    starColor = mix(starColor, mix(cleanWhite, icyBlue, 0.5), step(colorSeed, 0.35));
    starColor = mix(starColor, mix(cleanWhite, warmAmber, 0.4), step(0.75, colorSeed));

    return max(currentSkyColor, starColor * finalStarIntensity);
}

vec3 drawClouds(vec3 currentSkyColor, vec3 viewDir) {

    if(u_useClouds == 0){
        return currentSkyColor;
    }

    if (viewDir.y < -0.01) {
        return currentSkyColor;
    }

    // =========================================================================
    // CONFIGURATION PROPERTIES (METEOROLOGICAL SYSTEM)
    // =========================================================================
    int rep = 1 + u_cloudRepetition;
    float c_weatherCondition = u_weatherCondition;     // Testing driver loop state (0.0 = Clear, 1.0 = Heavy Storm)
    float c_cloudTiling      = u_cloudTiling;                       // Size/frequency scale of the cloud fractal structures
    vec3 c_cloudSeed         = vec3(209.3  , 128.54 / (100.0 + u_time) , 975.9) + u_time *  u_cloudSpeed; // 3D generation coordinate translation offsets (Procedural Seed)
    float c_maxOpacityClear  = 0.75;                        // Alpha opacity limit clamping factor during standard clear days
    float c_maxOpacityStorm  = 0.98;                        // Alpha opacity limit clamping factor during heavy dark storms
    const float c_zenithPatchWeight= 0.8;                         // Opacity blending mix weight of the overhead zenith dome cap

    // Configurable Color Parameters
    vec3 c_cloudColorDay  = mix(vec3(1.0), u_sunColor.rgb, 0.3);  // Main daylight color highlight profile edge
    vec3 c_cloudShadowDay = u_horizonColor.rgb * 0.8;             // Base undershade color profile for fair weather clouds
    vec3 c_cloudColorRain  = mix(u_horizonColor.rgb * 1.5, vec3(0.75, 0.77, 0.80), 0.3); // Rain highlight color configuration matrix
    vec3 c_cloudShadowRain = mix(u_horizonColor.rgb * 0.8, vec3(0.45, 0.47, 0.50), 0.3); // Rain undershade color configuration matrix

    // =========================================================================

    vec2 cloudUV = viewDir.xz / (viewDir.y + 0.001);
    vec2 windOffset = vec2(u_time * u_windCloudSpeed, u_time * u_windCloudSpeed);
    cloudUV = (cloudUV * c_cloudTiling) + windOffset;

    vec3 pPlanar = vec3(cloudUV.x, 0.0, cloudUV.y) + c_cloudSeed;
    float nPlanar  = 0.500 * noise3D(pPlanar); pPlanar *= 2.05;
    for(int i = 0; i < rep; i++){
        nPlanar       += 0.250 * noise3D(pPlanar); pPlanar *= 1.02;
    }
    nPlanar       += 0.125 * noise3D(pPlanar);
    
    float baseCloudNoise = nPlanar / 0.875;

    vec3 pSpherical = (viewDir * (c_cloudTiling * 2.5)) + vec3(windOffset.x, 0.0, windOffset.y) + c_cloudSeed;
    float nSpherical  = 0.500 * noise3D(pSpherical); pSpherical *= 2.05;
    nSpherical       += 0.250 * noise3D(pSpherical);
    float zenithNoise = nSpherical / 0.750;

    float zenithWeight = pow(viewDir.y, 3.0); 
    float cloudNoise = mix(baseCloudNoise, zenithNoise, zenithWeight * c_zenithPatchWeight);

    float baseDensity = mix(0.75, 0.15, c_weatherCondition);
    float dynamicDensity = clamp(baseDensity + u_cloudSparsity * (1.0 - baseDensity), 0.0, 0.98);
    float dynamicSharpness = mix(0.35, 0.15, c_weatherCondition);
    float cloudCoverage = smoothstep(dynamicDensity, dynamicDensity + dynamicSharpness, cloudNoise);

    float edgeFade = smoothstep(0.01, 0.15, viewDir.y);
    g_cloudAlpha = cloudCoverage * edgeFade;

    if (g_cloudAlpha <= 0.0) {
        return currentSkyColor;
    }

    vec3 currentShadow    = mix(c_cloudShadowDay, c_cloudShadowRain, c_weatherCondition);
    vec3 currentHighlight = mix(c_cloudColorDay, c_cloudColorRain, c_weatherCondition);
    g_cloudColor = mix(currentShadow, currentHighlight, smoothstep(0.2, 0.8, cloudNoise));

    float dynamicMaxOpacity = mix(c_maxOpacityClear, c_maxOpacityStorm, c_weatherCondition);
    return mix(currentSkyColor, g_cloudColor, g_cloudAlpha * dynamicMaxOpacity);
}

vec3 drawSun(vec3 viewDir) {
    // =========================================================================
    // CONFIGURATION PROPERTIES (HELIOCENTRIC LOGIC SUB-SYSTEM)
    // =========================================================================
    const float c_coronaGlowPower = 180.0;                       // Sharpness falloff rate exponent of the tight corona flare halo
    const float c_coronaGlowScale = 0.65;                        // Intensity scale brightness factor of the tight corona halo
    const float c_wideGlarePower  = 12.0;                         // Sharpness falloff rate exponent of the broad screen lens flood
    const float c_wideGlareScale  = 0.25;                         // Intensity scale brightness factor of the broad screen lens flood
    const float c_raySymmetryFreq1= 9.0;                          // Sharpness pattern frequency speed pass 1 for solar ray needles
    const float c_raySymmetryFreq2= 15.0;                         // Sharpness pattern frequency speed pass 2 for structural solar beams
    const float c_raySymmetryFreq3= 4.0;                          // Cross modulation masking frequency mapping break gaps between rays
    const float c_rayFalloffPower = 450.0;                        // Compression distance curve multiplier scaling starburst projections
    const float c_rayIntensityScale = 0.45;                       // Shimmer emission strength scale factor for the directional beams

    vec3 sunDir = normalize(u_sunDirection);
    float sunDot = max(0.0, dot(viewDir, sunDir));
    
    if (sunDot < 0.7) {
        return vec3(0.0);
    }

    float sunCore = smoothstep(u_sunSize - u_sunFalloff, u_sunSize, sunDot);
    float sunGlow = pow(sunDot, c_coronaGlowPower) * c_coronaGlowScale; 
    float wideGlare = pow(sunDot, c_wideGlarePower) * c_wideGlareScale; 
    
    vec3 rayProj = cross(viewDir, sunDir);
    float rayAngle = atan(rayProj.y, rayProj.x);
    float rayPattern = sin(rayAngle * c_raySymmetryFreq1) * sin(rayAngle * c_raySymmetryFreq2 + 1.2) * cos(rayAngle * c_raySymmetryFreq3);
    float sunRays = max(0.0, rayPattern) * pow(sunDot, c_rayFalloffPower) * c_rayIntensityScale;
    
    vec3 coreColor = vec3(1.0, 0.98, 0.95);      
    vec3 edgeColor = vec3(1.0, 0.65, 0.28);      
    vec3 outerHazeColor = vec3(0.92, 0.42, 0.3); 
    
    vec3 mixedSunColor = mix(edgeColor, coreColor, sunCore);
    vec3 finalGlowColor = mix(outerHazeColor, mixedSunColor, smoothstep(0.0, 0.3, sunGlow + sunCore));
    
    return (sunCore * coreColor) + 
           (sunGlow * finalGlowColor) + 
           (sunRays * edgeColor) + 
           (wideGlare * outerHazeColor * u_sunColor.rgb);
}



vec3 drawMoon(vec3 currentSkyColor, vec3 viewDir) {
    // =========================================================================
    // CONFIGURATION PROPERTIES (LUNAR ENVIRONMENT SYSTEM)
    // =========================================================================
    const float c_haloRadiusWiden = 0.015;                      // Mathematical thickness boundary radius of the atmospheric ring
    const float c_haloAlphaWeight = 0.1;                         // Ambient light blending transparency factor for phase glow halos
    const float c_textureFreqBase = 3.5;                          // Octave frequency scale mapping primary lunar craters/maria valleys
    const float c_textureFreqDet  = 12.0;                         // Octave frequency scale mapping secondary high-resolution cracks
    const float c_craterRimCutoff = 0.68;                         // Highpass amplitude filter mask clipping crater wall brightness
    const float c_horizonHazePow  = 2.0;                          // Thickness curve attenuation falloff driving dust horizon fading

    vec3 moonDir = normalize(u_moonDirection);
    float moonDot = max(0.0, dot(viewDir, moonDir));
    
    float d2 = 1.0 - moonDot * moonDot;
    float R2 = 1.0 - u_moonSize * u_moonSize;
    
    float phaseAngle = u_moonPhase * 6.2831853;
    float phaseFade = 1.0;

    float haloOuterRadius = R2 + c_haloRadiusWiden;
    vec3 colorOut = currentSkyColor;
    
    if (d2 > R2 && d2 < haloOuterRadius) {
        float haloFactor = 1.0 - ((d2 - R2) / (haloOuterRadius - R2));
        colorOut = mix(currentSkyColor, u_horizonColor.rgb, c_haloAlphaWeight * haloFactor * phaseFade);
    }

    if (d2 > R2) {
        return colorOut;
    }

    float moonCore = smoothstep(u_moonSize - u_moonFalloff, u_moonSize, moonDot);
    
    float z = sqrt(max(0.0, R2 - d2));
    vec3 N = normalize(viewDir + moonDir * (z - moonDot));
    
    vec3 moonRight = normalize(cross(vec3(0.0, 1.0, 0.0001), moonDir));
    vec3 L = normalize(moonDir * cos(phaseAngle) + moonRight * sin(phaseAngle));
    float moonLighting = smoothstep(-u_moonTerminatorSoftness, u_moonTerminatorSoftness, dot(N, L));
    
    vec3 rotatedN = N;
    if (u_moonEnableRotation == 1) {
        float rotAngle = u_time * u_moonRotationSpeed;
        float rSin = sin(rotAngle);
        float rCos = cos(rotAngle);
        rotatedN.xz = vec2(N.x * rCos - N.z * rSin, N.x * rSin + N.z * rCos);
    }
    
    float baseNoise = calculateMoonTexture(rotatedN, c_textureFreqBase);
    float detailNoise = calculateMoonTexture(rotatedN + vec3(baseNoise * 0.15), c_textureFreqDet);
    float combinedNoise = mix(baseNoise, detailNoise, 0.35);
    
    float mariaMask = smoothstep(0.25, 0.55, combinedNoise);
    vec3 moonBaseColor = mix(u_moonColor.rgb * 0.3, u_moonColor.rgb * 1.1, mariaMask);
    
    float craterRim = smoothstep(c_craterRimCutoff, c_craterRimCutoff + 0.04, detailNoise) * 0.25;
    moonBaseColor += vec3(craterRim);
    
    vec3 moonBodyColor = moonBaseColor * mix(u_moonEarthshine, 1.0, moonLighting);

    float horizonHaze = pow(1.0 - max(0.0, viewDir.y), c_horizonHazePow);
    float atmosphericThickness = mix(0.15, 0.65, horizonHaze);
    moonBodyColor = mix(moonBodyColor, currentSkyColor, atmosphericThickness);

    // Corrected phase logic: full moon should be opaque, new moon should be transparent (or have earthshine).
    float edgeLightingFactor = smoothstep(0.4, 0.6, cos(phaseAngle) * 0.5 + 0.5);
    float moonAlpha = moonCore * mix(u_moonEarthshine, 1.0, edgeLightingFactor);

    vec3 completeMoon = mix(colorOut, moonBodyColor, moonAlpha);
    return mix(completeMoon, g_cloudColor, g_cloudAlpha * 0.9);
}   

`,"assets/shaders/functions/fog.frag":`uniform vec3 u_FogColor;
uniform float u_FogDensity;
uniform int u_fogType; 
uniform float u_FogHeightFalloff; 
uniform float u_FogBaseHeight;    
in float v_fogDistance;


float calculateLinearFogFactor(float distance, float fogStart, float fogEnd) {
    float fogFactor = (distance - fogStart) / (fogEnd - fogStart);
    return clamp(fogFactor, 0.0, 1.0);
}

float calculateExponentialFogFactor(float distance, float fogDensity) {
    float fogFactor = 1.0 - exp(-distance * fogDensity);
    return clamp(fogFactor, 0.0, 1.0);
}

float calculateExponentialSquaredFogFactor(float distance, float fogDensity) {
    float fogFactor = 1.0 - exp(-pow(distance * fogDensity, 2.0));
    return clamp(fogFactor, 0.0, 1.0);
}

vec3 applyLinearFog(vec3 originalColor, vec3 fogColor, float distance, float fogStart, float fogEnd) {
    float fogFactor = calculateLinearFogFactor(distance, fogStart, fogEnd);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyExponentialFog(vec3 originalColor, vec3 fogColor, float distance, float fogDensity) {
    float fogFactor = calculateExponentialFogFactor(distance, fogDensity);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyExponentialSquaredFog(vec3 originalColor, vec3 fogColor, float distance, float fogDensity) {
    float fogFactor = calculateExponentialSquaredFogFactor(distance, fogDensity);
    return mix(originalColor, fogColor, fogFactor);
}

vec3 applyFog(vec3 originalColor, float distance, vec3 fragPos, vec3 camPos, int numLights, vec3 lightDir, vec3 lightColor) {
    vec3 effectiveFogColor = u_FogColor;

    if (numLights > 0) {
        vec3 viewDir = normalize(fragPos - camPos);
        vec3 lDir = normalize(-lightDir);
        
        float sunInscatter = max(0.0, dot(viewDir, lDir));
        sunInscatter = pow(sunInscatter, 8.0);
        
        effectiveFogColor += lightColor * sunInscatter;
    }

    float heightDelta = max(0.0, fragPos.y - u_FogBaseHeight);
    float heightDensityFactor = exp(-heightDelta * u_FogHeightFalloff);
    float effectiveDensity = u_FogDensity * heightDensityFactor;

    if (u_fogType == 2) {
        return applyExponentialSquaredFog(originalColor, effectiveFogColor, distance, effectiveDensity);
    } else if (u_fogType == 0) {
        return applyLinearFog(originalColor, effectiveFogColor, distance, 1.0 / (effectiveDensity + 0.001), 2.0 / (effectiveDensity + 0.001)); 
    } else {
        return applyExponentialFog(originalColor, effectiveFogColor, distance, effectiveDensity);
    }
}`,"assets/shaders/functions/functions.frag":`
// Hashes without sin() (Dave Hoskins, "Hash without Sine"). The classic
// fract(sin(x) * 43758.5) needs an exact sin() of large arguments: phone GPUs
// (Mali, Adreno) reduce the range with little precision, and the noise turns
// into bands and hard straight lines (the clouds near the horizon, where the
// coordinates are large). These only use fract() and products.
float rand(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash3D(vec3 p) {
    vec3 p3 = fract(p * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(hash3D(i + vec3(0.0, 0.0, 0.0)), hash3D(i + vec3(1.0, 0.0, 0.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 0.0)), hash3D(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(hash3D(i + vec3(0.0, 0.0, 1.0)), hash3D(i + vec3(1.0, 0.0, 1.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 1.0)), hash3D(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

`,"assets/shaders/functions/light.frag":`#define MAX_DIRECTIONAL_LIGHTS 5
#define MAX_POINT_LIGHTS 20
#define MAX_SPOT_LIGHTS 20

uniform float u_specularStrength;
uniform float u_roughness;
uniform vec3 u_cameraPosition;
uniform float u_normalMapStrength;

#define MAX_SHADOW_VIEWS 17
#define MAX_SHADOW_SLOTS 7

// Shadow views of the frame, all in one depth atlas (core/render/shadows.ts:
// keep the order and sizes in sync with SHADOWS_LAYOUT).
layout(std140) uniform ShadowsBlock {
    mat4 u_shadowMatrix[MAX_SHADOW_VIEWS];  // world -> light clip space
    vec4 u_shadowRect[MAX_SHADOW_VIEWS];    // atlas uv: x, y, size, size
    vec4 u_shadowParams[MAX_SHADOW_SLOTS];  // texel size, perspective (1/0), 0, first view
    vec4 u_shadowExtra[MAX_SHADOW_SLOTS];   // x: strength (per light)
    vec4 u_shadowAtlas;                     // 1/atlas size, filter taps (1, 4, 16), enabled
};
uniform highp sampler2DShadow u_shadowAtlasMap;
uniform int u_receiveShadows;

uniform sampler2D u_normalMap;
uniform sampler2D u_specularMap;
uniform sampler2D u_roughnessMap;
uniform sampler2D u_aoMap;
uniform sampler2D u_emissiveMap;

// All lights of the frame, uploaded once per frame (core/render/lights-ubo.ts:
// keep the order and sizes in sync with LIGHTS_LAYOUT).
layout(std140) uniform LightsBlock {
    vec4 u_lightAmbient;
    ivec4 u_lightCounts;                        // x directional, y point, z spot
    vec4 u_dirDirection[MAX_DIRECTIONAL_LIGHTS];
    vec4 u_dirColor[MAX_DIRECTIONAL_LIGHTS];    // w: shadow slot (-1 none)
    vec4 u_pointPosition[MAX_POINT_LIGHTS];     // w: range
    vec4 u_pointColor[MAX_POINT_LIGHTS];        // w: shadow slot
    vec4 u_pointAtten[MAX_POINT_LIGHTS];        // constant, linear, quadratic
    vec4 u_spotPosition[MAX_SPOT_LIGHTS];       // w: range
    vec4 u_spotDirection[MAX_SPOT_LIGHTS];
    vec4 u_spotColor[MAX_SPOT_LIGHTS];          // w: shadow slot
    vec4 u_spotCone[MAX_SPOT_LIGHTS];           // cos inner, cos outer
    vec4 u_spotAtten[MAX_SPOT_LIGHTS];
};

// Face of a point light's cube for a direction from the light: +X -X +Y -Y +Z -Z
// (same rule as cubeFaceFor in shadows.ts).
int cubeFace(vec3 v) {
    vec3 a = abs(v);
    if (a.x >= a.y && a.x >= a.z) return v.x > 0.0 ? 0 : 1;
    if (a.y >= a.z) return v.y > 0.0 ? 2 : 3;
    return v.z > 0.0 ? 4 : 5;
}

// PCF inside one atlas tile: 1 tap (hard), 4 taps on a grid, or 16 rotated
// Poisson taps; each tap is a hardware 2x2 comparison. Returns 1 lit, 0 shadowed.
float sampleShadowView(int view, vec3 position, float depthBias) {
    vec4 clip = u_shadowMatrix[view] * vec4(position, 1.0);
    if (clip.w <= 0.0) return 1.0;
    vec3 p = clip.xyz / clip.w * 0.5 + 0.5;
    if (p.z > 1.0 || p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 1.0;

    vec2 poissonDisk[16] = vec2[](
        vec2(-0.94201624, -0.39906216), vec2(0.94558609, -0.76890725),
        vec2(-0.09418410, -0.92938870), vec2(0.34495938, 0.29387760),
        vec2(-0.91588581, 0.45778432), vec2(-0.81544232, -0.87912464),
        vec2(-0.38277543, 0.27676845), vec2(0.97484398, 0.75648379),
        vec2(0.44323325, -0.97511554), vec2(0.53742981, -0.47373420),
        vec2(-0.26496911, -0.41893023), vec2(0.79197514, 0.19090188),
        vec2(-0.24188840, 0.99706507), vec2(-0.81409555, 0.14304622),
        vec2(0.19984126, 0.78641367), vec2(0.14383161, -0.14100790)
    );

    vec4 rect = u_shadowRect[view];
    float texel = u_shadowAtlas.x;
    // Stay a texel and a half inside the tile so no tap reads the neighbour.
    vec2 lo = rect.xy + vec2(texel * 1.5);
    vec2 hi = rect.xy + rect.zw - vec2(texel * 1.5);
    vec2 uv = rect.xy + p.xy * rect.zw;
    float ref = p.z - depthBias;

    int taps = int(u_shadowAtlas.y + 0.5);
    if (taps <= 1) return texture(u_shadowAtlasMap, vec3(clamp(uv, lo, hi), ref));
    if (taps <= 4) {
        float sum = 0.0;
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2(-0.5, -0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2( 0.5, -0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2(-0.5,  0.5) * texel * 2.0, lo, hi), ref));
        sum += texture(u_shadowAtlasMap, vec3(clamp(uv + vec2( 0.5,  0.5) * texel * 2.0, lo, hi), ref));
        return sum * 0.25;
    }
    float radius = texel * 2.5;

    float angle = rand(p.xy) * 6.283185;
    float c = cos(angle);
    float s = sin(angle);
    float lit = 0.0;
    for (int i = 0; i < 16; i++) {
        vec2 o = vec2(poissonDisk[i].x * c - poissonDisk[i].y * s, poissonDisk[i].x * s + poissonDisk[i].y * c);
        lit += texture(u_shadowAtlasMap, vec3(clamp(uv + o * radius, lo, hi), ref));
    }
    return lit / 16.0;
}

// Light reaching a point from shadow slot \`slotF\` (-1: no shadow).
// lightPos (unused for directional lights) gives the distance for a
// perspective view's texel size and picks a point light's cube face.
float shadowFactor(float slotF, vec3 normal, vec3 toLight, vec3 lightPos, bool isPoint) {
    int slot = int(slotF);
    if (slot < 0 || u_receiveShadows == 0 || u_shadowAtlas.z < 0.5) return 1.0;
    vec4 prm = u_shadowParams[slot];
    vec4 extra = u_shadowExtra[slot];
    // World size of a shadow-map texel here: the biases are in texels, so they
    // stay just big enough against acne and the shadow keeps touching its object.
    float texel = prm.y > 0.5 ? prm.x * length(v_position - lightPos) : prm.x;
    float ndotl = clamp(dot(normal, toLight), 0.0, 1.0);
    // The normal offset is for grazing angles, where acne appears first.
    float sinAngle = sqrt(1.0 - ndotl * ndotl);
    vec3 position = v_position + normal * (extra.z * texel * sinAngle) + toLight * (extra.y * texel);
    int view = int(prm.w) + (isPoint ? cubeFace(v_position - lightPos) : 0);
    float lit = sampleShadowView(view, position, 0.0);
    return mix(1.0, lit, extra.x);
}

vec3 getFinalNormal(vec2 uv) {
    vec3 n = normalize(v_normal);
    
    if (u_normalMapStrength > 0.0) {
        if (length(v_tangent) > 0.0001 && length(v_bitangent) > 0.0001) {
            vec3 normalFromMap = texture(u_normalMap, uv).rgb * 2.0 - 1.0;
            mat3 tbnMatrix = mat3(normalize(v_tangent), normalize(v_bitangent), n);
            vec3 perturbedNormal = tbnMatrix * normalFromMap;
            return normalize(mix(n, normalize(perturbedNormal), u_normalMapStrength));
        }
    }
    return n;
}

vec2 calculateBlinnPhong(vec3 lightDir, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    float diffuseIntensity = max(dot(normal, lightDir), 0.0);
    float specularIntensity = 0.0;
    
    if (diffuseIntensity > 0.0) {
        vec3 halfVecSum = lightDir + viewDir;
        vec3 halfVec = length(halfVecSum) > 0.0001 ? normalize(halfVecSum) : normal;
        specularIntensity = pow(max(0.0, dot(normal, halfVec)), shininess) * specStrength;
    }
    return vec2(diffuseIntensity, specularIntensity);
}

vec3 applyDirectionalLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightDir = normalize(-u_dirDirection[index].xyz);
    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    
    if (intensities.x <= 0.0) return vec3(0.0);

    float shadow = shadowFactor(u_dirColor[index].w, normal, lightDir, vec3(0.0), false);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    return (diffuse + specular) * u_dirColor[index].rgb * shadow;
}

// Smooth cut-off at the light's range (Frostbite / UE4 windowing): 1 near the
// light, 0 at the range, so a light only colours what is inside its range.
float rangeWindow(float distance, float range) {
    if (range <= 0.0) return 1.0;
    float r = distance / range;
    float w = clamp(1.0 - r * r * r * r, 0.0, 1.0);
    return w * w;
}

vec3 applyPointLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_pointPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_pointAtten[index].x +
                               u_pointAtten[index].y * distance +
                               u_pointAtten[index].z * (distance * distance));
    attenuation *= rangeWindow(distance, u_pointPosition[index].w);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_pointColor[index].w, normal, lightDir, u_pointPosition[index].xyz, true);

    return (diffuse + specular) * u_pointColor[index].rgb * attenuation * shadow;
}

vec3 applySpotLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_spotPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float angleCos = dot(lightDir, -u_spotDirection[index].xyz);
    float coneFactor = smoothstep(u_spotCone[index].y, u_spotCone[index].x, angleCos);
    
    if (coneFactor <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_spotAtten[index].x +
                               u_spotAtten[index].y * distance +
                               u_spotAtten[index].z * (distance * distance));
    attenuation *= rangeWindow(distance, u_spotPosition[index].w);
    
    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_spotColor[index].w, normal, lightDir, u_spotPosition[index].xyz, false);

    return (diffuse + specular) * u_spotColor[index].rgb * attenuation * coneFactor * shadow;
}

vec3 calculateTotalLitColor(vec3 baseColor, vec2 uv) {
    vec3 finalNormal = getFinalNormal(uv);
    
    vec3 cameraDelta = u_cameraPosition - v_position;
    vec3 viewDir = length(cameraDelta) > 0.0001 ? normalize(cameraDelta) : vec3(0.0, 0.0, 1.0);
    
    float sampledSpecular = texture(u_specularMap, uv).r;
    float sampledRoughness = texture(u_roughnessMap, uv).r;
    
    float finalRoughness = sampledRoughness * u_roughness;
    
    // Fade out specular intensity completely on rough surfaces to prevent the milky wash
    float finalSpecularStrength = sampledSpecular * u_specularStrength * (1.0 - finalRoughness);
    
    float clampedRoughness = clamp(finalRoughness * finalRoughness, 0.001, 0.999);
    float shininess = (2.0 / clampedRoughness) - 2.0;

    float ao = texture(u_aoMap, uv).r;
    vec3 emissive = texture(u_emissiveMap, uv).rgb;

    vec3 totalLitColorRGB = (u_lightAmbient.rgb * baseColor * ao) + emissive;

    for (int i = 0; i < u_lightCounts.x; ++i) {
        totalLitColorRGB += applyDirectionalLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.y; ++i) {
        totalLitColorRGB += applyPointLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.z; ++i) {
        totalLitColorRGB += applySpotLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }
    
    return totalLitColorRGB;
}`,"assets/shaders/post-processing/copy-with-depth.frag":`#version 300 es
precision highp float;

// Final copy of the scene to the bound framebuffer. The scene is drawn in
// linear colour (HDR targets can hold values above 1): this applies the
// exposure, the tone mapping, the saturation, the sRGB gamma and the contrast, and writes depth through
// gl_FragDepth, so what is drawn afterwards (editor grid, gizmos) is still
// hidden by the scene's objects.
in vec2 v_uv;
uniform sampler2D u_color;
uniform highp sampler2D u_depth;
uniform int u_toneMapping;   // 0 none (clamp), 1 Reinhard, 2 ACES (Narkowicz fit)
uniform float u_exposure;
uniform float u_saturation;  // 1 unchanged, 0 grey
uniform float u_contrast;    // 1 unchanged, around mid grey after gamma
out vec4 fragColor;

vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
    vec4 color = texture(u_color, v_uv);
    vec3 rgb = color.rgb * u_exposure;
    if (u_toneMapping == 1) rgb = rgb / (1.0 + rgb);
    else if (u_toneMapping == 2) rgb = aces(rgb);
    rgb = clamp(rgb, 0.0, 1.0);
    float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    rgb = max(mix(vec3(luma), rgb, u_saturation), 0.0);
    vec3 srgb = pow(clamp(rgb, 0.0, 1.0), vec3(1.0 / 2.2));
    srgb = (srgb - 0.5) * u_contrast + 0.5;
    fragColor = vec4(clamp(srgb, 0.0, 1.0), color.a);
    gl_FragDepth = texture(u_depth, v_uv).r;
}
`,"assets/shaders/post-processing/retro.frag":`#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_screenTexture;
uniform float u_time;
uniform float u_distortionStrength; // Try 0.15
uniform float u_aberrationSpread;   // Try 0.008

void main() {
    // 1. CRT Barrel Distortion
    // Shift UVs to center (-0.5 to 0.5) to calculate radial distance
    vec2 centeredUv = v_uv - 0.5;
    float distanceSquared = dot(centeredUv, centeredUv);
    
    // Distort UVs based on distance from center
    vec2 distortedUv = v_uv + centeredUv * (distanceSquared * u_distortionStrength);

    // 2. Chromatic Aberration
    // Sample the RGB channels at slightly different horizontal offsets
    float r = texture(u_screenTexture, distortedUv - vec2(u_aberrationSpread, 0.0)).r;
    float g = texture(u_screenTexture, distortedUv).g;
    float b = texture(u_screenTexture, distortedUv + vec2(u_aberrationSpread, 0.0)).b;

    // 3. Scanlines (using sine wave over the Y axis)
    // Multiply by a large number (like 800) to create thin horizontal lines
    float scanline = sin(distortedUv.y * 800.0 + u_time * 5.0) * 0.04;

    // Outside the distorted screen: black, like the bezel of a CRT.
    if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Combine into final color, darkening slightly with the scanline
    fragColor = vec4(vec3(r, g, b) - scanline, 1.0);
}`,"assets/shaders/tools/bitangent.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
 fragColor = vec4(v_bitangent,1);
}
`,"assets/shaders/tools/normal.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;

  vec4 sampledTexColor = texture(u_mainTex, uv);
  vec4 baseColor = sampledTexColor * u_matColor;


  // fragColor = vec4(uv,0,1);
  fragColor = vec4(v_normal,1);
  // fragColor = vec4(v_bitangent,1);
  // fragColor = vec4(v_tangent * 0.5 + 0.5, 1.0);
  // fragColor = vec4(v_bitangent * 0.5 + 0.5, 1.0);

}
`,"assets/shaders/tools/tangent.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
  fragColor = vec4(v_tangent, 1.0);
}
`,"assets/shaders/tools/uv.frag":`#version 300 es
precision mediump float;

#define MAX_DIRECTIONAL_LIGHTS 5 // Max number of directional lights
#define MAX_POINT_LIGHTS 20       // Max number of point lights
#define MAX_SPOT_LIGHTS 20        // Max number of spot lights

uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform sampler2D u_mainTex;
uniform sampler2D u_normalMap; // New: Uniform for the normal map texture



in vec2 v_uv;
in vec3 v_normal; // Interpolated normal (from vertex shader)
in vec3 v_position; // Crucial for point and spot lights: fragment's world position
// New: Tangent and Bitangent vectors from the vertex shader for TBN matrix
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

void main() {
  vec2 uv = (v_uv * u_uvScale) + u_uvOffset;

  vec4 sampledTexColor = texture(u_mainTex, uv);
  vec4 baseColor = sampledTexColor * u_matColor;


  fragColor = vec4(uv,0,1);

}
`,"assets/shaders/vertex/default.vert":`#version 300 es

// This replaces individual camera uniforms
layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

uniform mat4 u_worldMatrix;
uniform mat3 u_worldInverseTransposeMatrix;

uniform float u_time;
uniform vec2 u_screenResolution;

uniform float u_fogDistance;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
in vec3 a_tangent;
in vec3 a_bitangent;

#ifdef SKINNED
// Skinning: 4 joints per vertex; the joint matrices are rows of a float
// texture, 4 texels (columns) per joint, written by SkinnedMeshRendererBehaviour.
in uvec4 a_joints;
in vec4 a_weights;
uniform highp sampler2D u_jointTexture;

mat4 jointMatrix(uint joint) {
  int row = int(joint);
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, row), 0),
    texelFetch(u_jointTexture, ivec2(1, row), 0),
    texelFetch(u_jointTexture, ivec2(2, row), 0),
    texelFetch(u_jointTexture, ivec2(3, row), 0));
}

mat4 skinMatrix() {
  return a_weights.x * jointMatrix(a_joints.x)
       + a_weights.y * jointMatrix(a_joints.y)
       + a_weights.z * jointMatrix(a_joints.z)
       + a_weights.w * jointMatrix(a_joints.w);
}
#endif

// Outputs to the fragment shader
out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;
out vec3 v_position_view;
out vec3 v_tangent;
out vec3 v_bitangent;
out float v_fogDistance;

void main() {
  vec4 localPosition = vec4(a_position, 1.0);
  vec3 localNormal = a_normal;
  vec3 localTangent = a_tangent;
  vec3 localBitangent = a_bitangent;
#ifdef SKINNED
  // Joint matrices are in mesh space, so the world matrices apply after.
  // mat3(skin) is right for normals while bones have no non-uniform scale.
  mat4 skin = skinMatrix();
  localPosition = skin * localPosition;
  localNormal = mat3(skin) * localNormal;
  localTangent = mat3(skin) * localTangent;
  localBitangent = mat3(skin) * localBitangent;
#endif

  // Standard vertex transformations
  vec4 worldPosition = u_worldMatrix * localPosition;
  
  vec4 viewPosition = u_viewMatrix * worldPosition;

  v_position = worldPosition.xyz;
  v_position_view = viewPosition.xyz;
  v_normal = u_worldInverseTransposeMatrix * localNormal;
  v_tangent = u_worldInverseTransposeMatrix * localTangent;
  v_bitangent = u_worldInverseTransposeMatrix * localBitangent;
  v_uv = a_uv;

  // Calculate the distance for fog (using true radial distance from the camera)
  v_fogDistance = length(viewPosition.xyz) + u_fogDistance;

  // We multiply the matrices in order (Projection * View * Model) directly in the shader
  gl_Position = u_projectionMatrix * viewPosition;
  gl_PointSize = 10.0;
}`,"assets/shaders/vertex/fullscreen.vert":`#version 300 es
out vec2 v_uv;

// Generate a full-screen triangle using the gl_VertexID trick
void main() {
    // Calculate vertices entirely on the GPU
    float x = float((gl_VertexID & 1) << 2) - 1.0;
    float y = float((gl_VertexID & 2) << 1) - 1.0;
    
    // Map the -1.0 to 1.0 NDC space to 0.0 to 1.0 UV space
    v_uv = vec2(x * 0.5 + 0.5, y * 0.5 + 0.5);
    
    gl_Position = vec4(x, y, 0.0, 1.0);
}`,"assets/shaders/vertex/screen-quad.vert":`#version 300 es
out vec2 v_uv;

// Generate a full-screen triangle using the gl_VertexID trick
void main() {
    // Calculate vertices entirely on the GPU
    float x = float((gl_VertexID & 1) << 2) - 1.0;
    float y = float((gl_VertexID & 2) << 1) - 1.0;
    
    // Map the -1.0 to 1.0 NDC space to 0.0 to 1.0 UV space
    v_uv = vec2(x * 0.5 + 0.5, y * 0.5 + 0.5);
    
    gl_Position = vec4(x, y, 0.0, 1.0);
}`,"assets/shaders/vertex/shadow-caster.vert":`#version 300 es
uniform mat4 u_modelMatrix;
in vec4 a_position;

#ifdef SKINNED
// Skinning: 4 joints per vertex; the joint matrices are rows of a float
// texture, 4 texels (columns) per joint, written by SkinnedMeshRendererBehaviour.
in uvec4 a_joints;
in vec4 a_weights;
uniform highp sampler2D u_jointTexture;

mat4 jointMatrix(uint joint) {
  int row = int(joint);
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, row), 0),
    texelFetch(u_jointTexture, ivec2(1, row), 0),
    texelFetch(u_jointTexture, ivec2(2, row), 0),
    texelFetch(u_jointTexture, ivec2(3, row), 0));
}

mat4 skinMatrix() {
  return a_weights.x * jointMatrix(a_joints.x)
       + a_weights.y * jointMatrix(a_joints.y)
       + a_weights.z * jointMatrix(a_joints.z)
       + a_weights.w * jointMatrix(a_joints.w);
}
#endif

void main() {
#ifdef SKINNED
    gl_Position = u_modelMatrix * (skinMatrix() * a_position);
#else
    gl_Position = u_modelMatrix * a_position;
#endif
}
`,"assets/shaders/vertex/skybox.vert":`#version 300 es

precision highp float;

// 1. The shared Camera UBO
layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

in vec3 a_position;
out vec3 v_viewDirection;

void main() {
  // 2. STRIP THE TRANSLATION
  // We cast the view matrix down to a mat3 to drop the XYZ position data, 
  // then back to a mat4. This forces the skybox to only rotate, never move.
  mat4 viewRotationOnly = mat4(mat3(u_viewMatrix));

  // 3. Calculate the clip-space position
  vec4 pos = u_projectionMatrix * viewRotationOnly * vec4(a_position, 1.0);

  // 4. THE DEPTH TRICK
  // We set Z equal to W (pos.xyww). When WebGL does the perspective divide (W/W), 
  // the depth becomes exactly 1.0 (the maximum possible depth). 
  // This guarantees the skybox renders behind absolutely everything else.
  gl_Position = pos.xyww;

  // The local vertex position serves as the direction vector for the cubemap
  v_viewDirection = a_position;
}`};var Pi=class Pi{constructor(r,t){this.gl=r;this.locations=new Map;let i=wt[oe.vertex.fullscreen],n=wt[t];if(!i||!n)throw new Error(`FullscreenProgram: shader not embedded: ${n?oe.vertex.fullscreen:t}`);this.program=Pi.link(r,i,n),this.vao=r.createVertexArray()}use(){this.gl.useProgram(this.program)}uniform(r){return this.locations.has(r)||this.locations.set(r,this.gl.getUniformLocation(this.program,r)),this.locations.get(r)}bindTexture(r,t,i){let n=this.gl;n.activeTexture(n.TEXTURE0+i),n.bindTexture(n.TEXTURE_2D,t),n.uniform1i(this.uniform(r),i)}draw(){this.gl.bindVertexArray(this.vao),this.gl.drawArrays(this.gl.TRIANGLES,0,3),this.gl.bindVertexArray(null)}dispose(){this.gl.deleteProgram(this.program),this.gl.deleteVertexArray(this.vao)}static link(r,t,i){let n=d((l,u)=>{let c=r.createShader(l);if(r.shaderSource(c,u),r.compileShader(c),!r.getShaderParameter(c,r.COMPILE_STATUS)){let h=r.getShaderInfoLog(c);throw r.deleteShader(c),new Error(`FullscreenProgram: compile failed: ${h}`)}return c},"compile"),o=r.createProgram(),s=n(r.VERTEX_SHADER,t),a=n(r.FRAGMENT_SHADER,i);if(r.attachShader(o,s),r.attachShader(o,a),r.linkProgram(o),r.deleteShader(s),r.deleteShader(a),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(`FullscreenProgram: link failed: ${r.getProgramInfoLog(o)}`);return o}};d(Pi,"FullscreenProgram");var vr=Pi;var Xo=class Xo{constructor(){this.tempVertices=[];this.tempNormals=[];this.tempUVs=[];this.tempFaces=[];this.outputVertices=[];this.outputNormals=[];this.outputUVs=[];this.outputIndices=[]}parse(r){this.resetParser();let t=r.split(`
`);for(let i of t){let n=i.trim();if(n.length===0||n.startsWith("#"))continue;let o=n.split(/\s+/);switch(o[0]){case"v":this.parseVertex(o);break;case"vt":this.parseUV(o);break;case"vn":this.parseNormal(o);break;case"f":this.parseFace(o);break;default:break}}return this.consolidateMeshData(),new Z(this.outputVertices,this.outputNormals,this.outputUVs,this.outputIndices)}resetParser(){this.tempVertices=[],this.tempNormals=[],this.tempUVs=[],this.tempFaces=[],this.outputVertices=[],this.outputNormals=[],this.outputUVs=[],this.outputIndices=[]}parseVertex(r){this.tempVertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]))}parseUV(r){this.tempUVs.push(parseFloat(r[1]),parseFloat(r[2]))}parseNormal(r){this.tempNormals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]))}parseFace(r){let t={positions:[],uvs:[],normals:[]};for(let i=1;i<r.length;i++){let o=r[i].split("/").map(s=>parseInt(s,10));t.positions.push(o[0]-1),o.length>1&&!isNaN(o[1])?t.uvs.push(o[1]-1):t.uvs.push(-1),o.length>2&&!isNaN(o[2])||o.length===2&&isNaN(o[1])?t.normals.push(o[2]-1):t.normals.push(-1)}if(t.positions.length>=3)for(let i=1;i<t.positions.length-1;i++)this.tempFaces.push({positions:[t.positions[0],t.positions[i],t.positions[i+1]],uvs:t.uvs.includes(-1)?[-1,-1,-1]:[t.uvs[0],t.uvs[i],t.uvs[i+1]],normals:t.normals.includes(-1)?[-1,-1,-1]:[t.normals[0],t.normals[i],t.normals[i+1]]})}consolidateMeshData(){let r=new Map,t=0;for(let i of this.tempFaces)for(let n=0;n<3;n++){let o=i.positions[n],s=i.uvs[n],a=i.normals[n],l=`${o}/${s}/${a}`;r.has(l)||(r.set(l,t),this.outputVertices.push(x.fromValues(this.tempVertices[o*3+0],this.tempVertices[o*3+1],this.tempVertices[o*3+2])),s!==-1?this.outputUVs.push(he.fromValues(this.tempUVs[s*2+0],this.tempUVs[s*2+1])):this.outputUVs.push(he.fromValues(0,0)),a!==-1?this.outputNormals.push(x.fromValues(this.tempNormals[a*3+0],this.tempNormals[a*3+1],this.tempNormals[a*3+2])):this.outputNormals.push(x.fromValues(0,0,0)),t++),this.outputIndices.push(r.get(l))}}};d(Xo,"ObjParser");var Bi=Xo;var ie=(r=>(r[r.TEXTURE_2D=WebGL2RenderingContext.TEXTURE_2D]="TEXTURE_2D",r))(ie||{}),ct=(s=>(s[s.NEAREST=WebGL2RenderingContext.NEAREST]="NEAREST",s[s.LINEAR=WebGL2RenderingContext.LINEAR]="LINEAR",s[s.NEAREST_MIPMAP_NEAREST=WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST]="NEAREST_MIPMAP_NEAREST",s[s.LINEAR_MIPMAP_NEAREST=WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST]="LINEAR_MIPMAP_NEAREST",s[s.NEAREST_MIPMAP_LINEAR=WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR]="NEAREST_MIPMAP_LINEAR",s[s.LINEAR_MIPMAP_LINEAR=WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR]="LINEAR_MIPMAP_LINEAR",s))(ct||{}),Gt=(i=>(i[i.REPEAT=WebGL2RenderingContext.REPEAT]="REPEAT",i[i.MIRRORED_REPEAT=WebGL2RenderingContext.MIRRORED_REPEAT]="MIRRORED_REPEAT",i[i.CLAMP_TO_EDGE=WebGL2RenderingContext.CLAMP_TO_EDGE]="CLAMP_TO_EDGE",i))(Gt||{}),Ee=(n=>(n[n.MIN_FILTER=WebGL2RenderingContext.TEXTURE_MIN_FILTER]="MIN_FILTER",n[n.MAG_FILTER=WebGL2RenderingContext.TEXTURE_MAG_FILTER]="MAG_FILTER",n[n.WRAP_S=WebGL2RenderingContext.TEXTURE_WRAP_S]="WRAP_S",n[n.WRAP_T=WebGL2RenderingContext.TEXTURE_WRAP_T]="WRAP_T",n))(Ee||{}),zt=class zt extends q{constructor(t,i){super("Texture");this.gl=t;this.textureUri=i;this.image=null;this._glTexture=null;this.isLoaded=!1;this.isLoading=!1;this.minFilter=ct.LINEAR_MIPMAP_LINEAR;this.magFilter=ct.LINEAR;this.wrapS=Gt.MIRRORED_REPEAT;this.wrapT=Gt.MIRRORED_REPEAT;this._isBound=!1;this._width=0;this._height=0;this._loadPromise=null}setGL(t){this.gl=t}static createDepthTexture(t,i,n){let o=t.createTexture();if(!o)return console.error("Failed to create WebGL depth texture."),new zt(t);t.bindTexture(ie.TEXTURE_2D,o),t.texImage2D(ie.TEXTURE_2D,0,t.DEPTH_COMPONENT32F,i,n,0,t.DEPTH_COMPONENT,t.FLOAT,null),t.texParameteri(ie.TEXTURE_2D,Ee.MIN_FILTER,ct.NEAREST),t.texParameteri(ie.TEXTURE_2D,Ee.MAG_FILTER,ct.NEAREST),t.texParameteri(ie.TEXTURE_2D,Ee.WRAP_S,Gt.CLAMP_TO_EDGE),t.texParameteri(ie.TEXTURE_2D,Ee.WRAP_T,Gt.CLAMP_TO_EDGE),t.bindTexture(ie.TEXTURE_2D,null);let s=new zt(t);return s._glTexture=o,s.isLoaded=!0,s._width=i,s._height=n,s}static create(t,i,n,o=null){let s=t.createTexture();if(!s)return console.error("Failed to create WebGL texture."),new zt(t);t.bindTexture(ie.TEXTURE_2D,s),o===null?(t.texImage2D(ie.TEXTURE_2D,0,t.RGBA8,i,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(ie.TEXTURE_2D,Ee.MIN_FILTER,ct.NEAREST),t.texParameteri(ie.TEXTURE_2D,Ee.MAG_FILTER,ct.NEAREST)):(t.texImage2D(ie.TEXTURE_2D,0,t.RGBA,i,n,0,t.RGBA,t.UNSIGNED_BYTE,o),t.texParameteri(ie.TEXTURE_2D,Ee.MIN_FILTER,ct.LINEAR_MIPMAP_LINEAR),t.texParameteri(ie.TEXTURE_2D,Ee.MAG_FILTER,ct.LINEAR),t.generateMipmap(ie.TEXTURE_2D)),t.texParameteri(ie.TEXTURE_2D,Ee.WRAP_S,Gt.CLAMP_TO_EDGE),t.texParameteri(ie.TEXTURE_2D,Ee.WRAP_T,Gt.CLAMP_TO_EDGE),t.bindTexture(ie.TEXTURE_2D,null);let a=new zt(t);return a._glTexture=s,a.isLoaded=!0,a._width=i,a._height=n,a}load(){if(this._loadPromise)return this._loadPromise;if(this.isLoaded)return Promise.resolve();if(!this.gl)return Promise.reject(new Error("WebGL context not available."));if(!this.textureUri)return Promise.reject(new Error("Failed to load image. Please provide a texture URL!"));let t=this.textureUri,i=this.loader??H.defaultLoader;return this.isLoading=!0,this._loadPromise=i.loadImage(t).then(n=>{if(this.isLoading=!1,!this.gl)throw new Error("WebGL context is null after loading.");this.image=n,this.isLoaded=!0,this._width=n.width,this._height=n.height,this.createGLTexture(this.gl)},n=>{throw this.isLoading=!1,this.isLoaded=!1,this.image=null,this._loadPromise=null,new Error(`Failed to load image: ${t}. Error: ${n}`)}),this._loadPromise}createGLTexture(t){if(!this.isLoaded||!this.image){console.warn("Image not loaded or image data is missing. Cannot create WebGL texture.");return}this._glTexture=t.createTexture(),this.bind(),t.texImage2D(ie.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,this.image),this.setTextureParameters(),this.unBind()}rebuild(){if(!this.gl||!this.isLoaded||!this.image){console.warn("Cannot rebuild texture. Either WebGL context, image, or loading status is invalid.");return}this.bind(),this.gl.texImage2D(ie.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.image),this.setTextureParameters(),this.unBind()}setTextureParameters(){this.gl&&(this.bind(),this.gl.texParameteri(ie.TEXTURE_2D,Ee.MIN_FILTER,this.minFilter),this.gl.texParameteri(ie.TEXTURE_2D,Ee.MAG_FILTER,this.magFilter),this.gl.texParameteri(ie.TEXTURE_2D,Ee.WRAP_S,this.wrapS),this.gl.texParameteri(ie.TEXTURE_2D,Ee.WRAP_T,this.wrapT),this.gl.generateMipmap(ie.TEXTURE_2D),this.unBind())}setMinFilter(t){this.minFilter=t,this.setTextureParameters()}setMagFilter(t){this.magFilter=t,this.setTextureParameters()}setWrapS(t){this.wrapS=t,this.setTextureParameters()}setWrapT(t){this.wrapT=t,this.setTextureParameters()}setPixels(t,i,n,o,s){if(!this.gl||!this._glTexture){console.warn("Cannot set pixels. WebGL context or texture is not available.");return}this.bind(),s instanceof HTMLImageElement||s instanceof HTMLCanvasElement||s instanceof HTMLVideoElement?this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,t,i,this.gl.RGBA,this.gl.UNSIGNED_BYTE,s):this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,t,i,n,o,this.gl.RGBA,this.gl.UNSIGNED_BYTE,s),this.unBind()}getPixels(t,i){if(!this.gl||!this._glTexture)return console.warn("Cannot get pixels. WebGL context or texture is not available."),null;let n=this.gl.createFramebuffer();this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,n),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,ie.TEXTURE_2D,this._glTexture,0);let o=new Uint8Array(t*i*4);return this.gl.readPixels(0,0,t,i,this.gl.RGBA,this.gl.UNSIGNED_BYTE,o),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.deleteFramebuffer(n),o}bind(){this.gl&&(this.gl.bindTexture(ie.TEXTURE_2D,this._glTexture),this._isBound=!0)}unBind(){!this.gl||!this._isBound||(this.gl.bindTexture(ie.TEXTURE_2D,null),this._isBound=!1)}get glTexture(){return this._glTexture}get isImageLoaded(){return this.isLoaded}get width(){return this._width}get height(){return this._height}destroy(){if(this.gl&&this._glTexture){let t=this._glTexture;this._glTexture=null,this.gl.deleteTexture(t),H.forgetTexture(this)}this.image=null,this.isLoaded=!1}toJsonObject(){return{...super.toJsonObject(),url:this.textureUri,minFilter:this.minFilter,magFilter:this.magFilter,wrapS:this.wrapS,wrapT:this.wrapT}}fromJson(t){super.fromJson(t),this.textureUri=t.url,t.minFilter&&(this.minFilter=t.minFilter),t.magFilter&&(this.magFilter=t.magFilter),t.wrapS&&(this.wrapS=t.wrapS),t.wrapT&&(this.wrapT=t.wrapT),this.isImageLoaded&&this.setTextureParameters()}};d(zt,"Texture");var Qe=zt;var Di=class Di extends Qe{constructor(t,i){super(t);this.gl=t;this.textureUris=i;this._className="CubemapTexture";this.isWhiteCubemap=!1;this.imagesData=[];this.loadedImages=[null,null,null,null,null,null]}static createWhiteCubemap(t){let i=new Di(t);return i.isWhiteCubemap=!0,i.generateWhiteCubemap(t),i.isLoaded=!0,i}generateWhiteCubemap(t){if(this._glTexture=t.createTexture(),!this._glTexture){console.error("Failed to create WebGL texture for white cubemap.");return}t.bindTexture(t.TEXTURE_CUBE_MAP,this._glTexture);let i=new Uint8Array([255,255,255,255]),n=[t.TEXTURE_CUBE_MAP_POSITIVE_X,t.TEXTURE_CUBE_MAP_NEGATIVE_X,t.TEXTURE_CUBE_MAP_POSITIVE_Y,t.TEXTURE_CUBE_MAP_NEGATIVE_Y,t.TEXTURE_CUBE_MAP_POSITIVE_Z,t.TEXTURE_CUBE_MAP_NEGATIVE_Z];for(let o of n)t.texImage2D(o,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,i);this.minFilter=t.NEAREST,this.magFilter=t.NEAREST,this.wrapS=t.CLAMP_TO_EDGE,this.wrapT=t.CLAMP_TO_EDGE,t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MIN_FILTER,this.minFilter),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MAG_FILTER,this.magFilter),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_S,this.wrapS),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_T,this.wrapT),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_R,this.wrapT),t.bindTexture(t.TEXTURE_CUBE_MAP,null),this._width=1,this._height=1}async load(){if(!(this.isLoading||this.isImageLoaded))return this.isLoading=!0,new Promise((t,i)=>{if(this.isWhiteCubemap){this.gl?(this.generateWhiteCubemap(this.gl),this.isLoaded=!0,this.isLoading=!1,t()):i(new Error("GL context missing for white cubemap."));return}if(!this.textureUris||this.textureUris.length!==6){i(new Error("Cubemap requires exactly six texture URIs."));return}for(let n=0;n<this.textureUris.length;n++){this.loadedImages[n]=null;let o=new Image;o.onload=()=>{this.setLoadedImage(n,!0),this.allImagesFetchedAndLoaded()&&t()},o.onerror=s=>{this.setLoadedImage(n,!1),i(new Error(`Failed to load image: ${this.textureUris[n]}. Error: ${s}`))},H.resolveUri(this.textureUris[n]).then(s=>{o.src=s},s=>i(new Error(`Failed to resolve ${this.textureUris[n]}: ${s}`))),this.imagesData[n]=o}})}allImagesFetchedAndLoaded(){return this.loadedImages.filter(t=>t===!0).length===this.textureUris?.length}allImagesFetched(){return this.loadedImages.filter(t=>t==null).length===0}setLoadedImage(t,i){this.loadedImages[t]=i,this.allImagesFetchedAndLoaded()&&!this.isImageLoaded&&this.gl?(this.createGLTexture(this.gl),this.isLoaded=!0,this.isLoading=!1):this.allImagesFetched()&&!this.allImagesFetchedAndLoaded()&&console.error("Was not possible to get all images!")}bind(){this.gl&&this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP,this._glTexture)}createGLTexture(t){if(this._glTexture=t.createTexture(),!this._glTexture){console.error("Failed to create WebGL texture for cubemap.");return}this.bind(),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MIN_FILTER,this.minFilter),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MAG_FILTER,this.magFilter),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_S,this.wrapS),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_T,this.wrapT),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_R,this.wrapT);let i=[{target:t.TEXTURE_CUBE_MAP_POSITIVE_X,image:this.imagesData[0]},{target:t.TEXTURE_CUBE_MAP_NEGATIVE_X,image:this.imagesData[1]},{target:t.TEXTURE_CUBE_MAP_POSITIVE_Y,image:this.imagesData[2]},{target:t.TEXTURE_CUBE_MAP_NEGATIVE_Y,image:this.imagesData[3]},{target:t.TEXTURE_CUBE_MAP_POSITIVE_Z,image:this.imagesData[4]},{target:t.TEXTURE_CUBE_MAP_NEGATIVE_Z,image:this.imagesData[5]}],n=0,o=t.RGBA,s=t.RGBA,a=t.UNSIGNED_BYTE;i.forEach(l=>{t.texImage2D(l.target,n,o,s,a,l.image)}),t.generateMipmap(t.TEXTURE_CUBE_MAP),this.unBind()}setTextureUris(t){t?.length!==6&&console.error(`Incorrect number of uris: 6 were expected but ${t.length} were given!`),this.textureUris=t}toJsonObject(){return{...super.toJsonObject(),uris:this.textureUris,isWhiteCubemap:this.isWhiteCubemap}}fromJson(t){super.fromJson(t),this.textureUris=t.uris,this.isWhiteCubemap=t.isWhiteCubemap??!1,this.isLoaded=!1,this.isLoading=!1,this.loadedImages=[null,null,null,null,null,null],this.imagesData=[]}};d(Di,"CubemapTexture");var gr=Di;var ki=class ki{constructor(r,t,i,n={}){this.gl=r;this._framebuffer=null;this._colorTexture=null;this._depthTexture=null;this._depthRenderbuffer=null;this._width=0;this._height=0;if(this.color=n.color===void 0?"rgba8":n.color,this.depth=n.depth===void 0?"texture":n.depth,this.color==="rgba16f"&&!ki.supportsFloatColor(r))throw new Error("RenderTarget: rgba16f needs EXT_color_buffer_float.");this.resize(t,i)}static supportsFloatColor(r){return!!r.getExtension("EXT_color_buffer_float")}get width(){return this._width}get height(){return this._height}get framebuffer(){return this._framebuffer}get colorTexture(){return this._colorTexture}get depthTexture(){return this._depthTexture}resize(r,t){if(r=Math.max(1,Math.floor(r)),t=Math.max(1,Math.floor(t)),this._framebuffer&&r===this._width&&t===this._height)return;this.dispose();let i=this.gl;if(this._width=r,this._height=t,this._framebuffer=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this._framebuffer),this.color){let o=this.color==="rgba16f"?i.RGBA16F:i.RGBA8,s=this.color==="rgba16f"?i.HALF_FLOAT:i.UNSIGNED_BYTE;this._colorTexture=this.createTexture(o,i.RGBA,s,i.LINEAR),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this._colorTexture,0)}else i.drawBuffers([i.NONE]),i.readBuffer(i.NONE);this.depth==="texture"?(this._depthTexture=this.createTexture(i.DEPTH_COMPONENT24,i.DEPTH_COMPONENT,i.UNSIGNED_INT,i.NEAREST),i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,this._depthTexture,0)):this.depth==="renderbuffer"&&(this._depthRenderbuffer=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,this._depthRenderbuffer),i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT24,r,t),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,this._depthRenderbuffer),i.bindRenderbuffer(i.RENDERBUFFER,null));let n=i.checkFramebufferStatus(i.FRAMEBUFFER);if(i.bindFramebuffer(i.FRAMEBUFFER,null),n!==i.FRAMEBUFFER_COMPLETE)throw new Error(`RenderTarget: framebuffer incomplete (0x${n.toString(16)}).`)}bind(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this._framebuffer),this.gl.viewport(0,0,this._width,this._height)}clear(r){let t=this.gl,i=0;this.color&&r&&(t.clearColor(r[0],r[1],r[2],r[3]),i|=t.COLOR_BUFFER_BIT),this.depth&&(t.depthMask(!0),i|=t.DEPTH_BUFFER_BIT),i&&t.clear(i)}dispose(){let r=this.gl;this._framebuffer&&r.deleteFramebuffer(this._framebuffer),this._colorTexture&&r.deleteTexture(this._colorTexture),this._depthTexture&&r.deleteTexture(this._depthTexture),this._depthRenderbuffer&&r.deleteRenderbuffer(this._depthRenderbuffer),this._framebuffer=this._colorTexture=this._depthTexture=this._depthRenderbuffer=null}createTexture(r,t,i,n){let o=this.gl,s=o.createTexture();return o.bindTexture(o.TEXTURE_2D,s),o.texImage2D(o.TEXTURE_2D,0,r,this._width,this._height,0,t,i,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,n),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,n),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),s}};d(ki,"RenderTarget");var Ze=ki;var Po="rendertexture://";function Bo(e){return!!e&&e.startsWith(Po)}d(Bo,"isRenderTextureUri");function Do(e){return Bo(e)?e:Po+e}d(Do,"renderTextureUri");var ko=class ko extends Qe{constructor(t,i){super(t,Do(i));this.targets=[null,null];this.readIndex=0;this.written=!1;this.isLoaded=!0,this.name=this.textureName}get textureName(){return this.textureUri.slice(Po.length)}get glTexture(){return this.written?this.targets[this.readIndex]?.colorTexture??null:null}beginWrite(t,i){let n=1-this.readIndex,o=this.targets[n];return o||(o=this.targets[n]=new Ze(this.gl,t,i,{color:"rgba8",depth:null})),o.resize(t,i),this._width=o.width,this._height=o.height,o}endWrite(){this.readIndex=1-this.readIndex,this.written=!0}load(){return Promise.resolve()}setTextureParameters(){}bind(){this.gl?.bindTexture(this.gl.TEXTURE_2D,this.glTexture),this._isBound=!0}destroy(){for(let t of this.targets)t?.dispose();this.targets[0]=this.targets[1]=null,this.written=!1}};d(ko,"RenderTexture");var Vr=ko;var Io=class Io{constructor(r){this.options=r;this.entries=new Map}async acquire(r){let t=this.entries.get(r);t||(t=this.startLoad(r)),t.refs++;try{let i=await t.promise;return this.createHandle(r,t,i)}catch(i){throw t.refs--,i}}peek(r){let t=this.entries.get(r);return t?.loaded?t.value:void 0}has(r){return this.entries.has(r)}remove(r,t){let i=this.entries.get(r);return!i||t!==void 0&&i.value!==t?!1:(this.entries.delete(r),!0)}trim(){let r=0;for(let[t,i]of this.entries)i.loaded&&i.refs===0&&(this.entries.delete(t),this.disposeValue(i.value),r++);return r}clear(){let r=[...this.entries.values()];this.entries.clear();for(let t of r)t.loaded&&this.disposeValue(t.value)}stats(){let r=0,t=0,i=0;for(let n of this.entries.values())n.loaded?n.refs===0&&t++:r++,i+=n.refs;return{entries:this.entries.size-r,loading:r,unused:t,references:i}}startLoad(r){let t={refs:0,loaded:!1,promise:void 0};return t.promise=this.options.load(r).then(i=>(this.entries.get(r)===t?(t.value=i,t.loaded=!0):this.disposeValue(i),i),i=>{throw this.entries.get(r)===t&&this.entries.delete(r),i}),this.entries.set(r,t),t}createHandle(r,t,i){let n=!1;return{key:r,value:i,release:d(()=>{n||(n=!0,this.entries.get(r)===t&&t.refs>0&&t.refs--)},"release")}}disposeValue(r){try{this.options.dispose?.(r)}catch(t){console.error("[ResourceCache] dispose failed",t)}}};d(Io,"ResourceCache");var Mt=Io;var Fo=class Fo{constructor(r){this.resolve=r}async loadText(r){let t=await fetch(await this.resolve(r));if(!t.ok)throw new Error(`Failed to load ${r} (HTTP ${t.status})`);return t.text()}async loadBinary(r){let t=await fetch(await this.resolve(r));if(!t.ok)throw new Error(`Failed to load ${r} (HTTP ${t.status})`);return t.arrayBuffer()}async loadImage(r){let t=await this.resolve(r);return new Promise((i,n)=>{let o=new Image;o.onload=()=>i(o),o.onerror=()=>n(new Error(`Failed to load image: ${r}`)),o.src=t})}};d(Fo,"DefaultResourceLoader");var ut=Fo;var wm="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4////fwAJ+wP99djxmgAAAABJRU5ErkJggg==",Mm="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGD4DwABBAEAgLvRWwAAAABJRU5ErkJggg==",Tm="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNoaPj/HwAGggL/bOBDIwAAAABJRU5ErkJggg==",Sm="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z/D/PwAG/gL+0yubzgAAAABJRU5ErkJggg==",Ae={white:"builtin://white",black:"builtin://black",normal:"builtin://normal",missing:"builtin://missing"},Em={[Ae.white]:wm,[Ae.black]:Mm,[Ae.normal]:Tm,[Ae.missing]:Sm};function br(e){return Em[e]}d(br,"builtinTextureUrl");var No=class No extends Z{constructor(){super(...arguments);this.joints=new Uint16Array(0);this.weights=new Float32Array(0)}};d(No,"SkinnedMeshData");var dt=No;function Tt(e){let r=e.indexOf("#");if(r<0)return null;let t=/^(mesh|skin|anim|image)\/(\d+)$/.exec(e.slice(r+1));return t?{modelUri:e.slice(0,r),kind:t[1],index:Number(t[2])}:null}d(Tt,"parseModelPartUri");var Ii=class Ii{constructor(r,t,i=Ii.durationOf(t)){this.name=r;this.channels=t;this.duration=i}static durationOf(r){let t=0;for(let i of r)i.times.length&&(t=Math.max(t,i.times[i.times.length-1]));return t}};d(Ii,"AnimationClip");var St=Ii;function Am(e){return e==="rotation"?4:3}d(Am,"componentCount");function Rm(e,r,t=0){let i=e.length;if(i<2||r<=e[0])return 0;if(r>=e[i-1])return i-1;if(t>=0&&t<i-1&&e[t]<=r&&r<e[t+1])return t;if(t+1<i-1&&e[t+1]<=r&&r<e[t+2])return t+1;let n=0,o=i-1;for(;o-n>1;){let s=n+o>>1;e[s]<=r?n=s:o=s}return n}d(Rm,"findKey");var Vt=B.create(),$a=B.create();function Uo(e,r,t,i=0){let{times:n,values:o,interpolation:s}=e,a=Am(e.property),l=s==="CUBICSPLINE",u=l?a*3:a,c=l?a:0,h=Rm(n,r,i),m=n.length-1;if(s==="STEP"||h>=m||r<=n[0]){for(let _=0;_<a;_++)t[_]=o[h*u+c+_];return h}let p=n[h],f=n[h+1]-p,g=f>0?(r-p)/f:0;if(l){let _=g*g,w=_*g,S=2*w-3*_+1,T=w-2*_+g,C=-2*w+3*_,I=w-_,k=h*u,D=(h+1)*u;for(let V=0;V<a;V++){let $=o[k+a+V],J=o[k+2*a+V]*f,N=o[D+a+V],xe=o[D+V]*f;t[V]=S*$+T*J+C*N+I*xe}return a===4&&Cm(t),h}let b=h*a,M=(h+1)*a;if(a===4)B.set(Vt,o[b],o[b+1],o[b+2],o[b+3]),B.set($a,o[M],o[M+1],o[M+2],o[M+3]),B.slerp(Vt,Vt,$a,g),t[0]=Vt[0],t[1]=Vt[1],t[2]=Vt[2],t[3]=Vt[3];else for(let _=0;_<a;_++)t[_]=o[b+_]+(o[M+_]-o[b+_])*g;return h}d(Uo,"sampleChannel");function Cm(e){let r=Math.hypot(e[0],e[1],e[2],e[3])||1;e[0]/=r,e[1]/=r,e[2]/=r,e[3]/=r}d(Cm,"normalize4");var ja="Kaydara FBX Binary  ";function Oo(e){return e.byteLength<27||new TextDecoder("ascii").decode(new Uint8Array(e,0,ja.length))!==ja?null:new DataView(e).getUint32(23,!0)}d(Oo,"fbxVersion");function Ka(e){return Oo(e)!==null||Qa(e)}d(Ka,"isFbx");function Qa(e){let r=new TextDecoder("utf-8").decode(new Uint8Array(e,0,Math.min(e.byteLength,1024)));return/^\s*;\s*FBX\s/.test(r)||r.includes("FBXHeaderExtension:")}d(Qa,"isAsciiFbx");async function Za(e){if(Oo(e)===null&&Qa(e))return Pm(new TextDecoder("utf-8").decode(e));let r=Oo(e);if(r===null)throw new Error("Not an FBX file.");if(r<7e3)throw new Error(`FBX ${r/1e3} is not supported: export as FBX 7.x binary (Mixamo: "FBX Binary").`);let t=new Go(e,r>=7500),i=t.readNodes(27,e.byteLength);return await Promise.all(t.pending.map(Lm)),{version:r,nodes:i}}d(Za,"readFbx");var Vo=class Vo{constructor(r,t){this.wide=t;this.text=new TextDecoder("utf-8");this.pending=[];this.view=new DataView(r),this.bytes=new Uint8Array(r)}readNodes(r,t){let i=[],n=r,o=this.wide?25:13;for(;n+o<=t;){let s=this.wide?Number(this.view.getBigUint64(n,!0)):this.view.getUint32(n,!0),a=this.wide?Number(this.view.getBigUint64(n+8,!0)):this.view.getUint32(n+4,!0),l=this.wide?Number(this.view.getBigUint64(n+16,!0)):this.view.getUint32(n+8,!0),u=this.bytes[n+o-1];if(s===0)break;let c=n+o,h=this.text.decode(this.bytes.subarray(c,c+u)),m=c+u,p=this.readProps(m,a),v=m+l,f=v<s?this.readNodes(v,s):[];i.push({name:h,props:p,children:f}),n=s}return i}readProps(r,t){let i=[],n=this.view,o=r;for(let s=0;s<t;s++){let a=String.fromCharCode(this.bytes[o++]);switch(a){case"Y":i.push(n.getInt16(o,!0)),o+=2;break;case"C":i.push(this.bytes[o]!==0),o+=1;break;case"I":i.push(n.getInt32(o,!0)),o+=4;break;case"F":i.push(n.getFloat32(o,!0)),o+=4;break;case"D":i.push(n.getFloat64(o,!0)),o+=8;break;case"L":i.push(Number(n.getBigInt64(o,!0))),o+=8;break;case"S":case"R":{let l=n.getUint32(o,!0),u=this.bytes.subarray(o+4,o+4+l);i.push(a==="S"?this.text.decode(u):u.slice()),o+=4+l;break}case"f":case"d":case"l":case"i":case"b":{let l=n.getUint32(o,!0),u=n.getUint32(o+4,!0),c=n.getUint32(o+8,!0),h=this.bytes.subarray(o+12,o+12+c);o+=12+c,u===1?(i.push(new Uint8Array(0)),this.pending.push({props:i,index:i.length-1,type:a,length:l,bytes:h.slice()})):i.push(el(a,h.slice(),l));break}default:throw new Error(`Unknown FBX property type '${a}' at byte ${o-1}.`)}}return i}};d(Vo,"Reader");var Go=Vo;async function Lm(e){let r=new Blob([e.bytes]).stream().pipeThrough(new DecompressionStream("deflate")),t=new Uint8Array(await new Response(r).arrayBuffer());e.props[e.index]=el(e.type,t,e.length)}d(Lm,"inflateInto");function el(e,r,t){let i=new DataView(r.buffer,r.byteOffset,r.byteLength);switch(e){case"f":{let n=new Float32Array(t);for(let o=0;o<t;o++)n[o]=i.getFloat32(o*4,!0);return n}case"d":{let n=new Float64Array(t);for(let o=0;o<t;o++)n[o]=i.getFloat64(o*8,!0);return n}case"i":{let n=new Int32Array(t);for(let o=0;o<t;o++)n[o]=i.getInt32(o*4,!0);return n}case"l":{let n=new Float64Array(t);for(let o=0;o<t;o++)n[o]=Number(i.getBigInt64(o*8,!0));return n}case"b":{let n=[];for(let o=0;o<t;o++)n.push(r[o]!==0);return n}}throw new Error(`Unknown FBX array type '${e}'.`)}d(el,"decodeArray");function Wr(e,r){return e?.children.find(t=>t.name===r)}d(Wr,"fbxChild");function ge(e,r){return Wr(e,r)?.props[0]}d(ge,"fbxValue");var Xm=/(Index|Indexes|Indices)$/;function Pm(e){let r=new zo(e),t=tl(r,!1),i=t.find(o=>o.name==="FBXHeaderExtension"),n=Number(ge(i,"FBXVersion")??7e3);if(n<7e3)throw new Error(`FBX ${n/1e3} is not supported: export as FBX 7.x (Mixamo: "FBX Binary").`);return{version:n,nodes:t}}d(Pm,"readAsciiFbx");var Wo=class Wo{constructor(r){this.s=r;this.i=0;this.peeked=null}peek(){return this.peeked||(this.peeked=this.read()),this.peeked}next(){let r=this.peek();return this.peeked=null,r}read(){let r=this.s;for(;;){for(;this.i<r.length&&r.charCodeAt(this.i)<=32;)this.i++;if(this.i>=r.length)return null;if(r[this.i]!==";")break;for(;this.i<r.length&&r[this.i]!==`
`;)this.i++}let t=r[this.i];if(t==="{"||t==="}"||t===",")return this.i++,{kind:t,value:t};if(t==='"'){let o=r.indexOf('"',this.i+1),s=r.slice(this.i+1,o<0?r.length:o).replace(/&quot;/g,'"');return this.i=o<0?r.length:o+1,{kind:"string",value:s}}if(t==="*"){let o=this.i+1;for(;o<r.length&&/[0-9]/.test(r[o]);)o++;let s=r.slice(this.i+1,o);return this.i=o,{kind:"count",value:s}}let i=this.i;for(;i<r.length&&/[^\s,{}":;]/.test(r[i]);)i++;i===this.i&&i++;let n=r.slice(this.i,i);return this.i=i,r[i]===":"?(this.i++,{kind:"key",value:n}):{kind:/^[-+]?(\d|\.\d)/.test(n)?"number":"word",value:n}}};d(Wo,"AsciiTokens");var zo=Wo;function tl(e,r){let t=[];for(;;){let i=e.peek();if(!i)break;if(i.kind==="}"){r&&e.next();break}e.next(),i.kind==="key"&&t.push(Bm(i.value,e))}return t}d(tl,"parseAsciiNodes");function Bm(e,r){let t=[],i=[],n=!0;for(;;){let o=r.peek();if(!o||o.kind==="key"||o.kind==="}")break;if(o.kind===","){r.next(),n=!0;continue}if(o.kind==="{"){r.next(),i=tl(r,!0);break}if(!n)break;if(r.next(),n=!1,o.kind==="count"){t.push(Dm(e,Number(o.value),r));break}t.push(o.kind==="number"?Number(o.value):o.value)}if(e==="Content"){let o=t.filter(l=>typeof l=="string"&&l.length>0).map(km),s=new Uint8Array(o.reduce((l,u)=>l+u.length,0)),a=0;for(let l of o)s.set(l,a),a+=l.length;return{name:e,props:s.length?[s]:[],children:i}}return{name:e,props:t,children:i}}d(Bm,"parseAsciiNode");function Dm(e,r,t){let i=Xm.test(e)?new Int32Array(r):new Float64Array(r);if(t.peek()?.kind!=="{")return i;t.next();let n=0;for(;;){let o=t.next();if(!o||o.kind==="}")break;o.kind==="number"&&n<r&&(i[n++]=Number(o.value))}return i}d(Dm,"parseAsciiArray");function km(e){let r=atob(e.replace(/[^A-Za-z0-9+/=]/g,"")),t=new Uint8Array(r.length);for(let i=0;i<r.length;i++)t[i]=r.charCodeAt(i);return t}d(km,"decodeBase64");var rl=46186158e3;async function ol(e,r={}){let{nodes:t}=await Za(e);return new Ho(t,r.fps??30).convert()}d(ol,"parseFbx");var Jo=class Jo{constructor(r,t){this.root=r;this.fps=t;this.objects=new Map;this.connections=[];this.nodeIndexById=new Map;this.model={nodes:[],meshes:[],skins:[],clips:[],materials:[],images:[],unitScale:.01};this.imageIndexById=new Map;this.materialIndexById=new Map}convert(){this.readSettings();for(let r of this.root.find(t=>t.name==="Objects")?.children??[]){let[t,i,n]=r.props;this.objects.set(t,{id:t,name:sl(i),kind:r.name,type:n??"",node:r})}for(let r of this.root.find(t=>t.name==="Connections")?.children??[]){let[t,i,n,o]=r.props;this.connections.push({type:t,child:i,parent:n,property:o})}return this.readNodes(),this.readMeshes(),this.readAnimations(),this.model}readSettings(){let r=Jr(this.root.find(n=>n.name==="GlobalSettings")),t=r.get("UnitScaleFactor")?.[0];typeof t=="number"&&t>0&&(this.model.unitScale=t/100);let i=r.get("UpAxis")?.[0];typeof i=="number"&&i!==1&&console.warn(`FBX: up axis ${"XYZ"[i]} is not converted; the model may lie on its side.`)}readNodes(){let r=[...this.objects.values()].filter(o=>o.kind==="Model"),t=new Set(r.map(o=>o.id)),i=new Map;for(let o of this.connections)o.type==="OO"&&t.has(o.child)&&t.has(o.parent)&&i.set(o.child,o.parent);let n=d(o=>{if(this.nodeIndexById.has(o.id))return;let s=i.get(o.id);s!==void 0&&n(this.objects.get(s));let a=s!==void 0?this.nodeIndexById.get(s):-1;this.nodeIndexById.set(o.id,this.model.nodes.length),this.model.nodes.push({name:o.name,parent:a,...Fm(o.node)})},"visit");r.forEach(n)}readMeshes(){for(let r of this.objects.values()){if(r.kind!=="Model"||r.type!=="Mesh")continue;let t=this.childrenOf(r.id).find(l=>l.kind==="Geometry");if(!t)continue;let i=this.model.nodes[this.nodeIndexById.get(r.id)],n=this.childrenOf(t.id).find(l=>l.kind==="Deformer"&&l.type==="Skin"),o=n?this.childrenOf(n.id).filter(l=>l.kind==="Deformer"&&l.type==="Cluster"):[],s=Im(t.node,o.map(l=>l.node));if(i.mesh=this.model.meshes.length,this.model.meshes.push(s),o.length){let l={joints:[],inverseBindMatrices:[]},u=this.bindPose().get(r.id)??this.globalMatrix(this.nodeIndexById.get(r.id));for(let c of o){let h=this.childrenOf(c.id).find(v=>v.kind==="Model");l.joints.push(h?this.nodeIndexById.get(h.id):0);let m=nl(ge(c.node,"TransformLink")),p=E.invert(E.create(),m)??E.create();l.inverseBindMatrices.push(E.multiply(p,p,u))}i.skin=this.model.skins.length,this.model.skins.push(l)}let a=this.childrenOf(r.id).find(l=>l.kind==="Material");a&&(i.material=this.readMaterial(a))}}readMaterial(r){let t=this.materialIndexById.get(r.id);if(t!==void 0)return t;let i=Jr(r.node),n=i.get("DiffuseColor")??i.get("Diffuse")??[.8,.8,.8],o={name:r.name,color:[n[0],n[1],n[2],1]};for(let s of this.connections){if(s.type!=="OP"||s.parent!==r.id)continue;let a=this.objects.get(s.child);if(a?.kind!=="Texture")continue;let l=this.readTextureImage(a);if(l===void 0)continue;let u=s.property??"";/^Diffuse/.test(u)?o.albedo=l:/Normal|Bump/.test(u)?o.normal=l:/^Specular|Reflection/.test(u)?o.specular=l:/^Emissive|Glow/.test(u)&&(o.emissive=l)}return o.albedo!==void 0&&(o.color=[1,1,1,1]),this.materialIndexById.set(r.id,this.model.materials.length),this.model.materials.push(o),this.model.materials.length-1}readTextureImage(r){let t=this.childrenOf(r.id).find(l=>l.kind==="Video");if(!t)return;let i=this.imageIndexById.get(t.id);if(i!==void 0)return i;let n=ge(t.node,"Content");if(!(n instanceof Uint8Array)||n.length===0)return;let o=String(ge(t.node,"RelativeFilename")??ge(t.node,"Filename")??t.name),s=o.split(/[\\/]/).pop()??o,a={name:s,mimeType:Om(n,s),data:n};return this.imageIndexById.set(t.id,this.model.images.length),this.model.images.push(a),this.model.images.length-1}readAnimations(){for(let r of this.objects.values()){if(r.kind!=="AnimationStack")continue;let t=this.readStack(r);t&&this.model.clips.push(t)}}readStack(r){let t=new Map,i=1/0,n=-1/0;for(let u of this.childrenOf(r.id).filter(c=>c.kind==="AnimationLayer"))for(let c of this.childrenOf(u.id).filter(h=>h.kind==="AnimationCurveNode")){let h=this.connections.find(M=>M.type==="OP"&&M.child===c.id&&this.objects.get(M.parent)?.kind==="Model");if(!h)continue;let m=h.property==="Lcl Translation"?"T":h.property==="Lcl Rotation"?"R":h.property==="Lcl Scaling"?"S":null,p=this.nodeIndexById.get(h.parent);if(!m||p===void 0)continue;let v=Jr(c.node),f=this.model.nodes[p],g=t.get(p)??{T:[],R:[],S:[]},b=m==="T"?f.translation:m==="S"?f.scale:null;["X","Y","Z"].forEach((M,_)=>{let w=this.connections.find(C=>C.type==="OP"&&C.parent===c.id&&C.property===`d|${M}`),S=w&&this.objects.get(w.child);if(S?.kind==="AnimationCurve"){let C=ge(S.node,"KeyTime"),I=ge(S.node,"KeyValueFloat");if(C&&I&&C.length){g[m][_]={times:C,values:I},i=Math.min(i,C[0]),n=Math.max(n,C[C.length-1]);return}}let T=v.get(`d|${M}`)?.[0];g[m][_]=typeof T=="number"?T:b?b[_]:0}),t.set(p,g)}if(!t.size||!isFinite(i))return null;let o=Math.max(1,Math.round((n-i)/rl*this.fps))+1,s=new Float32Array(o);for(let u=0;u<o;u++)s[u]=u/this.fps;let a=d(u=>i+u/this.fps*rl,"tick"),l=[];for(let[u,c]of t){let h=this.model.nodes[u],m=this.fbxNodeOf(u);if(c.T.length){let p=new Float32Array(o*3);for(let v=0;v<o;v++)for(let f=0;f<3;f++)p[v*3+f]=Hr(c.T[f],a(v));l.push({target:h.name,property:"translation",times:s,values:p,interpolation:"LINEAR"})}if(c.R.length){let p=Jr(m),v=Number(p.get("RotationOrder")?.[0]??0),f=xr(Wt(p.get("PreRotation")),0),g=B.invert(B.create(),xr(Wt(p.get("PostRotation")),0)),b=new Float32Array(o*4),M=B.create();for(let _=0;_<o;_++){let w=x.fromValues(Hr(c.R[0],a(_)),Hr(c.R[1],a(_)),Hr(c.R[2],a(_)));B.multiply(M,f,xr(w,v)),B.multiply(M,M,g),B.normalize(M,M),_>0&&M[0]*b[_*4-4]+M[1]*b[_*4-3]+M[2]*b[_*4-2]+M[3]*b[_*4-1]<0&&B.scale(M,M,-1),b.set(M,_*4)}l.push({target:h.name,property:"rotation",times:s,values:b,interpolation:"LINEAR"})}if(c.S.length){let p=new Float32Array(o*3);for(let v=0;v<o;v++)for(let f=0;f<3;f++)p[v*3+f]=Hr(c.S[f],a(v));l.push({target:h.name,property:"scale",times:s,values:p,interpolation:"LINEAR"})}}return new St(r.name||`Clip ${this.model.clips.length}`,l)}childrenOf(r){let t=[];for(let i of this.connections){if(i.parent!==r)continue;let n=this.objects.get(i.child);n&&t.push(n)}return t}bindPose(){if(this.bindPoseMatrices)return this.bindPoseMatrices;this.bindPoseMatrices=new Map;for(let r of this.objects.values())if(!(r.kind!=="Pose"||r.type!=="BindPose"))for(let t of r.node.children.filter(i=>i.name==="PoseNode")){let i=ge(t,"Node"),n=ge(t,"Matrix");typeof i=="number"&&n&&this.bindPoseMatrices.set(i,nl(n))}return this.bindPoseMatrices}globalMatrix(r){let t=this.model.nodes[r],i=E.fromRotationTranslationScale(E.create(),t.rotation,t.translation,t.scale);return t.parent>=0?E.multiply(i,this.globalMatrix(t.parent),i):i}fbxNodeOf(r){for(let[t,i]of this.nodeIndexById)if(i===r)return this.objects.get(t)?.node}};d(Jo,"FbxConverter");var Ho=Jo;function il(e,r,t){let i=ge(e,r);if(!e||!i)return null;let n=String(ge(e,"MappingInformationType")??"ByPolygonVertex"),o=String(ge(e,"ReferenceInformationType")??"Direct"),s=ge(e,t),a=o!=="Direct"&&s instanceof Int32Array;return{data:i,index(l,u,c){let h=n==="ByPolygonVertex"?l:n==="ByPolygon"?c:n==="AllSame"?0:u;return a?s[h]:h}}}d(il,"layer");function Im(e,r){let t=ge(e,"Vertices")??new Float64Array(0),i=ge(e,"PolygonVertexIndex")??new Int32Array(0),n=il(Wr(e,"LayerElementNormal"),"Normals","NormalsIndex"),o=il(Wr(e,"LayerElementUV"),"UV","UVIndex"),s=Array.from({length:t.length/3},()=>[]);r.forEach((g,b)=>{let M=ge(g,"Indexes"),_=ge(g,"Weights");if(!(!M||!_))for(let w=0;w<M.length;w++)s[M[w]]?.push([b,_[w]])});let a=r.length>0,l=a?new dt([]):new Z([]);l.providedNormals=!!n;let u=[],c=[],h=new Map,m=0,p=d((g,b,M)=>{let _=n?n.index(g,b,M):-1,w=o?o.index(g,b,M):-1,S=`${b}/${_}/${w}`,T=h.get(S);if(T!==void 0)return T;if(T=l.vertices.length,h.set(S,T),l.vertices.push(x.fromValues(t[b*3],t[b*3+1],t[b*3+2])),n&&l.normals.push(x.fromValues(n.data[_*3],n.data[_*3+1],n.data[_*3+2])),l.uvs.push(o?he.fromValues(o.data[w*2],1-o.data[w*2+1]):he.create()),a){let C=s[b].slice().sort((k,D)=>D[1]-k[1]).slice(0,4),I=C.reduce((k,D)=>k+D[1],0);I<=0&&m++;for(let k=0;k<4;k++)u.push(C[k]?.[0]??0),c.push(I>0?(C[k]?.[1]??0)/I:k===0?1:0)}return T},"addVertex"),v=[],f=0;for(let g=0;g<i.length;g++){let b=i[g],M=b<0?~b:b;if(v.push(p(g,M,f)),b<0){for(let _=1;_+1<v.length;_++)l.indices.push(v[0],v[_],v[_+1]);v=[],f++}}return l instanceof dt&&(l.joints=Uint16Array.from(u),l.weights=Float32Array.from(c),m&&console.warn(`FBX: ${m} skinned vertices had no weights; bound to the first bone.`)),l}d(Im,"buildMesh");function Fm(e){let r=Jr(e),t=Number(r.get("RotationOrder")?.[0]??0),i=B.multiply(B.create(),xr(Wt(r.get("PreRotation")),0),xr(Wt(r.get("Lcl Rotation")),t)),n=xr(Wt(r.get("PostRotation")),0);B.multiply(i,i,B.invert(n,n)),B.normalize(i,i);let o=r.has("Lcl Scaling")?Wt(r.get("Lcl Scaling")):x.fromValues(1,1,1);for(let s of["RotationPivot","ScalingPivot","RotationOffset","ScalingOffset"]){let a=r.get(s);if(a&&(a[0]||a[1]||a[2])){console.warn(`FBX: ${s} of "${sl(String(e.props[1]))}" is ignored.`);break}}return{translation:Wt(r.get("Lcl Translation")),rotation:i,scale:o}}d(Fm,"localTransform");var Nm=["XYZ","XZY","YZX","YXZ","ZXY","ZYX","XYZ"],Um={X:[1,0,0],Y:[0,1,0],Z:[0,0,1]};function xr(e,r){let t=B.create(),i=B.create();for(let n of Nm[r]??"XYZ"){let o=e["XYZ".indexOf(n)]*(Math.PI/180);B.setAxisAngle(i,Um[n],o),B.multiply(t,i,t)}return t}d(xr,"eulerToQuat");function nl(e){return e&&e.length===16?E.clone(Array.from(e)):E.create()}d(nl,"matrixOf");function Wt(e){return e?x.fromValues(Number(e[0])||0,Number(e[1])||0,Number(e[2])||0):x.create()}d(Wt,"vec3Of");function Hr(e,r){if(typeof e=="number")return e;let{times:t,values:i}=e,n=t.length;if(r<=t[0])return i[0];if(r>=t[n-1])return i[n-1];let o=0,s=n-1;for(;s-o>1;){let l=o+s>>1;t[l]<=r?o=l:s=l}let a=(r-t[o])/(t[s]-t[o]);return i[o]+(i[s]-i[o])*a}d(Hr,"evaluate");function Jr(e){let r=new Map;for(let t of Wr(e,"Properties70")?.children??[])r.set(String(t.props[0]),t.props.slice(4));return r}d(Jr,"props70");function sl(e){let r=e??"";if(r.includes("\0"))return r.split("\0")[0];let t=r.indexOf("::");return t>=0?r.slice(t+2):r}d(sl,"cleanName");function Om(e,r){return e[0]===137&&e[1]===80?"image/png":e[0]===255&&e[1]===216||/\.jpe?g$/i.test(r)?"image/jpeg":"image/png"}d(Om,"mimeOf");var Gm={lt:"<",gt:">",amp:"&",quot:'"',apos:"'"};function al(e){return e.indexOf("&")<0?e:e.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi,(r,t)=>t[0]==="#"?String.fromCodePoint(t[1]==="x"||t[1]==="X"?parseInt(t.slice(2),16):parseInt(t.slice(1),10)):Gm[t]??r)}d(al,"decode");function ll(e){let r={tag:"#document",attrs:{},children:[],text:""},t=[r],i=[[]],n=e.length,o=0,s=d(()=>{let a=t.pop();a.text=al(i.pop().join(""))},"closeTop");for(;o<n;){let a=e.indexOf("<",o);if(a<0){i[i.length-1].push(e.slice(o));break}if(a>o&&i[i.length-1].push(e.slice(o,a)),e.startsWith("<!--",a)){let f=e.indexOf("-->",a+4);o=f<0?n:f+3;continue}if(e.startsWith("<![CDATA[",a)){let f=e.indexOf("]]>",a+9);i[i.length-1].push(e.slice(a+9,f<0?n:f)),o=f<0?n:f+3;continue}if(e[a+1]==="?"||e[a+1]==="!"){let f=e.indexOf(">",a);o=f<0?n:f+1;continue}let l=zm(e,a);if(e[a+1]==="/"){let f=e.slice(a+2,l).trim();for(;t.length>1;){let g=t[t.length-1];if(s(),g.tag===f)break}o=l+1;continue}let u=e[l-1]==="/",c=e.slice(a+1,u?l-1:l),h=/^\s*([^\s/>]+)/.exec(c),m={tag:h?h[1]:"",attrs:{},children:[],text:""},p=/([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g,v=c.slice(h?h[0].length:0);for(let f=p.exec(v);f;f=p.exec(v))m.attrs[f[1]]=al(f[3]??f[4]??"");t[t.length-1].children.push(m),u||(t.push(m),i.push([])),o=l+1}for(;t.length>1;)s();return r}d(ll,"parseXml");function zm(e,r){let t="";for(let i=r+1;i<e.length;i++){let n=e[i];if(t)n===t&&(t="");else if(n==='"'||n==="'")t=n;else if(n===">")return i}return e.length-1}d(zm,"findTagEnd");function j(e,r){return e?.children.find(t=>t.tag===r)}d(j,"xmlChild");function Pe(e,r){return e?e.children.filter(t=>t.tag===r):[]}d(Pe,"xmlChildren");function Ht(e,r,t=[]){for(let i of e?.children??[])i.tag===r&&t.push(i),Ht(i,r,t);return t}d(Ht,"xmlDescendants");function cl(e){return new TextDecoder("utf-8").decode(new Uint8Array(e,0,Math.min(e.byteLength,2048))).includes("<COLLADA")}d(cl,"isCollada");function ul(e){return new qo(ll(e)).convert()}d(ul,"parseCollada");var Yo=class Yo{constructor(r){this.ids=new Map;this.model={nodes:[],meshes:[],skins:[],clips:[],materials:[],images:[],unitScale:1};this.nodeIndex={byId:new Map,bySid:new Map,byName:new Map};this.imageIndexById=new Map;this.materialIndexById=new Map;this.geometryCache=new Map;this.pendingSkins=[];this.collada=j(r,"COLLADA")??r;let t=d(i=>{i.attrs.id&&this.ids.set(i.attrs.id,i),i.children.forEach(t)},"index");t(this.collada)}convert(){let r=j(this.collada,"asset"),t=Number(j(r,"unit")?.attrs.meter);t>0&&(this.model.unitScale=t);let i=j(r,"up_axis")?.text.trim();i&&i!=="Y_UP"&&console.warn(`COLLADA: ${i} is not converted; the model may lie on its side.`);let n=j(j(this.collada,"scene"),"instance_visual_scene")?.attrs.url,o=n&&this.ref(n)||Ht(this.collada,"visual_scene")[0];for(let s of Pe(o,"node"))this.readNode(s,-1);for(let s of this.pendingSkins)this.readSkin(s);return this.readAnimations(),this.model}readNode(r,t){let i=this.model.nodes.length,n=this.localMatrix(r),o={name:r.attrs.name||r.attrs.id||r.attrs.sid||`Node ${i}`,parent:t,translation:E.getTranslation(x.create(),n),rotation:B.normalize(B.create(),E.getRotation(B.create(),n)),scale:E.getScaling(x.create(),n)};this.model.nodes.push(o),r.attrs.id&&this.nodeIndex.byId.set(r.attrs.id,i),r.attrs.sid&&this.nodeIndex.bySid.set(r.attrs.sid,i),this.nodeIndex.byName.set(o.name,i);for(let s of Pe(r,"instance_geometry")){let a=this.ref(s.attrs.url);a&&this.attachPrimitives(i,this.readGeometry(a),this.materialBindings(s))}for(let s of Pe(r,"instance_controller")){let a=this.ref(s.attrs.url);if(a){let l=j(s,"skeleton")?.text.trim();this.pendingSkins.push({node:i,controller:a,skeleton:l,bindings:this.materialBindings(s)})}}for(let s of Pe(r,"node"))this.readNode(s,i)}localMatrix(r){let t=E.create();for(let i of r.children){let n=Et(i.text);i.tag==="matrix"&&n.length>=16?E.multiply(t,t,Fi(n)):i.tag==="translate"?E.translate(t,t,[n[0],n[1],n[2]]):i.tag==="rotate"?E.rotate(t,t,n[3]*Math.PI/180,[n[0],n[1],n[2]]):i.tag==="scale"&&E.scale(t,t,[n[0],n[1],n[2]])}return t}materialBindings(r){let t=new Map;for(let i of Ht(r,"instance_material"))t.set(i.attrs.symbol,i.attrs.target.replace(/^#/,""));return t}attachPrimitives(r,t,i,n){t.forEach((o,s)=>{let a=r;if(s>0){a=this.model.nodes.length;let h=this.model.nodes[r];this.model.nodes.push({name:`${h.name} (${o.material||s})`,parent:r,translation:x.create(),rotation:B.create(),scale:x.fromValues(1,1,1)})}let l=this.model.nodes[a];l.mesh=this.model.meshes.length,this.model.meshes.push(o.mesh),n!==void 0&&(l.skin=n);let u=i.get(o.material)??o.material,c=u?this.readMaterial(u):void 0;c!==void 0&&(l.material=c)})}readGeometry(r){let t=this.geometryCache.get(r.attrs.id);if(t)return t;let i=j(r,"mesh"),n=[];for(let o of i?.children??[])["triangles","polylist","polygons"].includes(o.tag)&&n.push(this.readPrimitive(i,o));return this.geometryCache.set(r.attrs.id,n),n}readPrimitive(r,t){let i=[];for(let f of Pe(t,"input")){let g=Number(f.attrs.offset??0);if(f.attrs.semantic==="VERTEX"){let b=this.ref(f.attrs.source);for(let M of Pe(b,"input")){let _=this.readSource(this.ref(M.attrs.source));i.push({semantic:M.attrs.semantic,offset:g,..._})}}else(f.attrs.semantic==="NORMAL"||f.attrs.semantic==="TEXCOORD"&&!i.some(b=>b.semantic==="TEXCOORD"))&&i.push({semantic:f.attrs.semantic,offset:g,...this.readSource(this.ref(f.attrs.source))})}let n=Math.max(...Pe(t,"input").map(f=>Number(f.attrs.offset??0)))+1,o=i.find(f=>f.semantic==="POSITION"),s=i.find(f=>f.semantic==="NORMAL"),a=i.find(f=>f.semantic==="TEXCOORD"),l=Pe(t,"p").map(f=>Et(f.text)),u=[],c=[];if(t.tag==="polylist")u.push(...Et(j(t,"vcount")?.text??"")),c=l[0]??[];else if(t.tag==="triangles"){c=l[0]??[];for(let f=0;f<c.length/n/3;f++)u.push(3)}else for(let f of l)u.push(f.length/n),c.push(...f);let h=new Z([]);h.providedNormals=!!s;let m=[],p=new Map,v=0;for(let f of u){let g=[];for(let b=0;b<f;b++,v++){let M=v*n,_=o?c[M+o.offset]:0,w=s?c[M+s.offset]:-1,S=a?c[M+a.offset]:-1,T=`${_}/${w}/${S}`,C=p.get(T);if(C===void 0){C=h.vertices.length,p.set(T,C),m.push(_);let I=o.data,k=o.stride;h.vertices.push(x.fromValues(I[_*k],I[_*k+1],I[_*k+2])),s&&h.normals.push(x.fromValues(s.data[w*s.stride],s.data[w*s.stride+1],s.data[w*s.stride+2])),h.uvs.push(a?he.fromValues(a.data[S*a.stride],1-a.data[S*a.stride+1]):he.create())}g.push(C)}for(let b=1;b+1<g.length;b++)h.indices.push(g[0],g[b],g[b+1])}return{mesh:h,material:t.attrs.material??"",positionOf:m}}readSkin(r){let t=j(r.controller,"skin"),i=t&&this.ref(t.attrs.source);if(!t||!i)return;let n=Fi(Et(j(t,"bind_shape_matrix")?.text??"1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1")),o=Pe(j(t,"joints"),"input"),s=this.readNames(this.ref(o.find(T=>T.attrs.semantic==="JOINT")?.attrs.source)),a=this.readSource(this.ref(o.find(T=>T.attrs.semantic==="INV_BIND_MATRIX")?.attrs.source)),l={joints:[],inverseBindMatrices:[]};s.forEach((T,C)=>{let I=this.nodeIndex.bySid.get(T)??this.nodeIndex.byName.get(T)??this.nodeIndex.byId.get(T);I===void 0&&console.warn(`COLLADA: joint "${T}" has no node; using the first node.`),l.joints.push(I??0);let k=Fi(Array.from(a.data.subarray(C*16,C*16+16)));l.inverseBindMatrices.push(E.multiply(k,k,n))});let u=j(t,"vertex_weights"),c=Pe(u,"input"),h=Math.max(...c.map(T=>Number(T.attrs.offset??0)))+1,m=Number(c.find(T=>T.attrs.semantic==="JOINT")?.attrs.offset??0),p=c.find(T=>T.attrs.semantic==="WEIGHT"),v=Number(p?.attrs.offset??1),f=this.readSource(this.ref(p?.attrs.source)).data,g=Et(j(u,"vcount")?.text??""),b=Et(j(u,"v")?.text??""),M=[],_=0;g.forEach((T,C)=>{let I=[];for(let k=0;k<T;k++,_++){let D=b[_*h+m],V=f[b[_*h+v]];D>=0&&I.push([D,V])}M[C]=I});let w=this.model.skins.length;this.model.skins.push(l);let S=this.readGeometry(i).map(T=>({...T,mesh:Vm(T,M)}));this.attachPrimitives(r.node,S,r.bindings,w)}readMaterial(r){let t=this.materialIndexById.get(r);if(t!==void 0)return t;let i=this.ids.get(r);if(!i)return;let n=this.ref(j(i,"instance_effect")?.attrs.url),o={name:i.attrs.name||r,color:[.8,.8,.8,1]},s=j(n,"profile_COMMON"),a=new Map;for(let g of Pe(s,"newparam"))a.set(g.attrs.sid,g);let l=d(g=>{let b=a.get(g),M=j(j(b,"sampler2D"),"source")?.text.trim(),_=M?a.get(M):void 0,w=j(j(_,"surface"),"init_from")?.text.trim()??g;return this.readImage(w)},"imageOfSampler"),c=j(s,"technique")?.children.find(g=>["phong","lambert","blinn","constant"].includes(g.tag)),h=d(g=>j(c,g),"slot"),m=d(g=>{let b=j(g,"texture");return b?l(b.attrs.texture):void 0},"texture"),p=h("diffuse");o.albedo=m(p);let v=Et(j(p,"color")?.text??"");o.albedo!==void 0?o.color=[1,1,1,1]:v.length>=3&&(o.color=[v[0],v[1],v[2],1]),o.emissive=m(h("emission")),o.specular=m(h("specular"));let f=Ht(n,"bump")[0]??Ht(n,"displacement")[0];return o.normal=m(f),this.materialIndexById.set(r,this.model.materials.length),this.model.materials.push(o),this.model.materials.length-1}readImage(r){let t=this.imageIndexById.get(r);if(t!==void 0)return t;let i=this.ids.get(r),n=j(i,"init_from"),o=(j(n,"ref")?.text??n?.text??"").trim();if(!i||!o)return;let s=decodeURIComponent(o.split(/[\\/]/).pop()??o);return this.imageIndexById.set(r,this.model.images.length),this.model.images.push({name:s,mimeType:/\.jpe?g$/i.test(s)?"image/jpeg":"image/png",path:o.replace(/^file:\/\/\/?/,"")}),this.model.images.length-1}readAnimations(){let r=[],t=0;for(let i of Ht(j(this.collada,"library_animations"),"animation"))for(let n of Pe(i,"channel")){let[o,s]=(n.attrs.target??"").split("/"),a=this.nodeIndex.byId.get(o),l=this.ref(n.attrs.source);if(a===void 0||!l)continue;let u=Pe(l,"input"),c=this.readSource(this.ref(u.find(m=>m.attrs.semantic==="INPUT")?.attrs.source)).data,h=this.readSource(this.ref(u.find(m=>m.attrs.semantic==="OUTPUT")?.attrs.source));if(h.stride!==16||!/^(transform|matrix)/.test(s??"")){t++;continue}r.push(...Wm(this.model.nodes[a].name,c,h.data))}t&&console.warn(`COLLADA: ${t} animation channels that are not whole matrices were skipped.`),r.length&&this.model.clips.push(new St("Animation",r))}ref(r){return r?this.ids.get(r.replace(/^#/,"")):void 0}readSource(r){let t=j(r,"float_array"),i=j(j(r,"technique_common"),"accessor");return{data:Float64Array.from(Et(t?.text??"")),stride:Number(i?.attrs.stride??1)}}readNames(r){return((j(r,"Name_array")??j(r,"IDREF_array"))?.text??"").trim().split(/\s+/).filter(Boolean)}};d(Yo,"ColladaConverter");var qo=Yo;function Et(e){let r=[];for(let t of e.split(/\s+/))t&&r.push(Number(t));return r}d(Et,"numbers");function Fi(e){let r=E.create();for(let t=0;t<4;t++)for(let i=0;i<4;i++)r[i*4+t]=e[t*4+i];return r}d(Fi,"rowMajor");function Vm(e,r){let t=e.mesh,i=new dt(t.vertices,t.normals,t.uvs,t.indices);i.providedNormals=t.providedNormals;let n=new Uint16Array(t.vertices.length*4),o=new Float32Array(t.vertices.length*4);return e.positionOf.forEach((s,a)=>{let l=(r[s]??[]).slice().sort((c,h)=>h[1]-c[1]).slice(0,4),u=l.reduce((c,h)=>c+h[1],0);for(let c=0;c<4;c++)n[a*4+c]=l[c]?.[0]??0,o[a*4+c]=u>0?(l[c]?.[1]??0)/u:c===0?1:0}),i.joints=n,i.weights=o,i}d(Vm,"toSkinned");function Wm(e,r,t){let i=r.length,n=new Float32Array(i*3),o=new Float32Array(i*4),s=new Float32Array(i*3),a=E.create(),l=B.create(),u=x.create();for(let h=0;h<i;h++)E.copy(a,Fi(t.subarray(h*16,h*16+16))),n.set(E.getTranslation(u,a),h*3),E.getRotation(l,a),B.normalize(l,l),h>0&&l[0]*o[h*4-4]+l[1]*o[h*4-3]+l[2]*o[h*4-2]+l[3]*o[h*4-1]<0&&B.scale(l,l,-1),o.set(l,h*4),s.set(E.getScaling(u,a),h*3);let c=Float32Array.from(r);return[{target:e,property:"translation",times:c,values:n,interpolation:"LINEAR"},{target:e,property:"rotation",times:c,values:o,interpolation:"LINEAR"},{target:e,property:"scale",times:c,values:s,interpolation:"LINEAR"}]}d(Wm,"matrixChannels");var ht=class ht{constructor(r,t){this.gl=r;this.loader=t;this.objParser=new Bi;this.renderTextures=new Map;this.builtinLoader=new ut(async r=>br(r)??r);this.missingLoader=new ut(async()=>br(Ae.missing));this.modelImageLoader={loadText:d(r=>this.loader.loadText(r),"loadText"),loadImage:d(async r=>{let t=Tt(r),i=(await this.getModel(t.modelUri)).images[t.index];if(!i)throw new Error(`${r}: the model has no image ${t.index}.`);if(i.data)return createImageBitmap(new Blob([i.data],{type:i.mimeType}));if(i.path&&/^(https?:|\/|\.)/.test(t.modelUri))return this.loader.loadImage(new URL(i.path,new URL(t.modelUri,location.href)).href);throw new Error(`${r}: the image "${i.path}" is a separate file; place the model with instantiateModel's resolveImage.`)},"loadImage")};this.textures=new Mt({load:d(async i=>{if(Bo(i))return this.getRenderTexture(i);let n=new Qe(this.requireGl(i),i);n.loader=br(i)?this.builtinLoader:Tt(i)?.kind==="image"?this.modelImageLoader:this.loader;try{await n.load()}catch(o){console.warn(`Texture ${i} could not be loaded; using the missing texture.`,o),n.loader=this.missingLoader,await n.load()}return n},"load"),dispose:d(i=>{i instanceof Vr||i.destroy()},"dispose")}),this.cubemaps=new Mt({load:d(async i=>{let n=new gr(this.requireGl(i),i.split("|"));return await n.load(),n},"load"),dispose:d(i=>i.destroy(),"dispose")}),this.meshes=new Mt({load:d(async i=>this.objParser.parse(await this.loader.loadText(i)),"load")}),this.models=new Mt({load:d(async i=>{let n=await this.loadBinary(i);if(Ka(n))return ol(n);if(cl(n))return ul(new TextDecoder("utf-8").decode(n));throw new Error(`${i} is not a model format the engine reads (FBX 7.x, COLLADA).`)},"load")}),this.shaders=new Mt({load:d(async i=>wt[i]??this.loader.loadText(i),"load")})}static cubemapKey(r){let{right:t,left:i,up:n,bottom:o,front:s,back:a}=r;return[t,i,n,o,s,a].join("|")}async getTexture(r){return ht.peekValue(await this.textures.acquire(r))}async getCubemap(r){return ht.peekValue(await this.cubemaps.acquire(ht.cubemapKey(r)))}getRenderTexture(r){let t=Do(r),i=this.renderTextures.get(t);return i||(i=new Vr(this.requireGl(t),t),this.renderTextures.set(t,i)),i}getWhiteCubemap(){let r=Ae.white;return this.getCubemap({right:r,left:r,up:r,bottom:r,front:r,back:r})}async getMesh(r){return ht.peekValue(await this.meshes.acquire(r))}async getModel(r){return ht.peekValue(await this.models.acquire(r.split("#")[0]))}async loadBinary(r){if(this.loader.loadBinary)return this.loader.loadBinary(r);let t=await fetch(r);if(!t.ok)throw new Error(`Failed to load ${r} (HTTP ${t.status})`);return t.arrayBuffer()}async getShader(r){return ht.peekValue(await this.shaders.acquire(r))}static peekValue(r){return r.release(),r.value}setLoader(r){this.loader=r}getLoader(){return this.loader}stats(){return{textures:this.textures.stats(),cubemaps:this.cubemaps.stats(),meshes:this.meshes.stats(),shaders:this.shaders.stats(),models:this.models.stats()}}trim(){return this.textures.trim()+this.cubemaps.trim()+this.meshes.trim()+this.shaders.trim()+this.models.trim()}dispose(){this.textures.clear(),this.cubemaps.clear(),this.meshes.clear(),this.shaders.clear(),this.models.clear();for(let r of this.renderTextures.values())r.destroy();this.renderTextures.clear()}requireGl(r){if(!this.gl)throw new Error(`Cannot load ${r}: no WebGL context is known yet.`);return this.gl}};d(ht,"ResourceManager");var qr=ht;var ee=class ee{static for(r){let t=r??ee.currentGl;r&&(ee.currentGl=r);let i=ee.managers.get(t);return i||(i=new qr(t,ee.loader),ee.managers.set(t,i)),i}static setLoader(r){ee.customLoader=r;for(let t of ee.managers.values())t.setLoader(ee.loader)}static setUriResolver(r){ee.uriResolver=r}static async resolveUri(r){let t=br(r);return t||(ee.uriResolver?await ee.uriResolver(r):r)}static releaseContext(r){let t=ee.managers.get(r);t&&(t.dispose(),ee.managers.delete(r),ee.currentGl===r&&(ee.currentGl=null))}static forgetTexture(r){let t=r.textureUri;if(t){for(let i of ee.managers.values())if(i.textures.remove(t,r))return}}static trim(){let r=0;for(let t of ee.managers.values())r+=t.trim();return r}static stats(){return[...ee.managers.values()].map(r=>r.stats())}static clear(){for(let r of ee.managers.values())r.dispose();ee.managers.clear(),ee.currentGl=null}static get loader(){return ee.customLoader??ee.defaultLoader}};d(ee,"Resources"),ee.managers=new Map,ee.currentGl=null,ee.uriResolver=null,ee.customLoader=null,ee.defaultLoader=new ut(r=>ee.resolveUri(r));var H=ee;var et=class et extends q{constructor(t,i,n=oe.frag.color,o=oe.vertex.default){super("Shader");this.gl=t;this.material=i;this.fragUri=n;this.vertexUri=o;this._className="Shader";this._initialized=!1;this._buffers={position:null,normal:null,uv:null,tangent:null,bitangent:null,indices:null};this.fragmentSource=null;this.vertexSource=null;this.defines=[];this.indexType=5123;this._uuid=ot()}static preFetchFunctionsGlsl(){for(let t of Object.values(et.SHADER_FUNCTIONS))H.for().getShader(t)}static instanciate(t,i){return new et(t,i)}get shaderProgram(){return this._shaderProgram}get initialized(){return this._initialized}get buffers(){return this._buffers}async initialize(){if(this._initialized)return!0;let t=Object.keys(et.SHADER_FUNCTIONS),i=await H.for().getShader(this.vertexUri),n=await H.for().getShader(this.fragUri);i.trim().startsWith("<")&&console.warn(`[Shader Warning] Vertex source from ${this.vertexUri} starts with '<'. It may be HTML.`),n.trim().startsWith("<")&&console.warn(`[Shader Warning] Fragment source from ${this.fragUri} starts with '<'. It may be HTML.`);for(let a of t)if(n.includes(a)){let l=et.SHADER_FUNCTIONS[a],u=await H.for().getShader(l);n=n.replace(a,u)}i=et.withDefines(i,this.defines),n=et.withDefines(n,this.defines);let o=this.compileShader(this.gl,this.gl.VERTEX_SHADER,i,this.vertexUri),s=this.compileShader(this.gl,this.gl.FRAGMENT_SHADER,n,this.fragUri);return!o||!s?!1:(this._shaderProgram=this.createProgram(this.gl,o,s),this._initialized=!0,!0)}static withDefines(t,i){if(!i.length)return t;let n=i.map(s=>`#define ${s}`).join(`
`)+`
`,o=/^\s*#version[^\n]*\n/.exec(t);return o?t.slice(0,o[0].length)+n+t.slice(o[0].length):n+t}initBuffers(t,i){(!i.providedNormals||i.normals.length!==i.vertices.length)&&i.calculateNormals(),i.calculateTangentsAndBitangents();let n={position:null,normal:null,uv:null,tangent:null,bitangent:null,indices:null};n.position=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.position);let o=[];for(let u of i.vertices)o.push(u[0],u[1],u[2]);t.bufferData(t.ARRAY_BUFFER,new Float32Array(o),t.STATIC_DRAW),n.normal=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.normal);let s=[];for(let u of i.normals)s.push(u[0],u[1],u[2]);t.bufferData(t.ARRAY_BUFFER,new Float32Array(s),t.STATIC_DRAW),n.uv=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.uv);let a=[];for(let u of i.uvs)a.push(u[0],u[1]);if(t.bufferData(t.ARRAY_BUFFER,new Float32Array(a),t.STATIC_DRAW),i.tangents&&i.tangents.length>0){n.tangent=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.tangent);let u=[];for(let c of i.tangents)u.push(c[0],c[1],c[2]);t.bufferData(t.ARRAY_BUFFER,new Float32Array(u),t.STATIC_DRAW)}if(i.bitangents&&i.bitangents.length>0){n.bitangent=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.bitangent);let u=[];for(let c of i.bitangents)u.push(c[0],c[1],c[2]);t.bufferData(t.ARRAY_BUFFER,new Float32Array(u),t.STATIC_DRAW)}i instanceof dt&&i.joints.length&&(n.joints=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.joints),t.bufferData(t.ARRAY_BUFFER,i.joints,t.STATIC_DRAW),n.weights=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,n.weights),t.bufferData(t.ARRAY_BUFFER,i.weights,t.STATIC_DRAW));let l=i.vertices.length>65535;this.indexType=l?t.UNSIGNED_INT:t.UNSIGNED_SHORT,n.indices=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.indices),t.bufferData(t.ELEMENT_ARRAY_BUFFER,l?new Uint32Array(i.indices):new Uint16Array(i.indices),t.STATIC_DRAW),this._buffers=n}bindBuffers(){if(!this.gl||!this._shaderProgram)return;let t=this.gl.getAttribLocation(this._shaderProgram,"a_position");this._buffers.position&&t!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.position),this.gl.vertexAttribPointer(t,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(t)):t!==-1&&this.gl.disableVertexAttribArray(t);let i=this.gl.getAttribLocation(this._shaderProgram,"a_normal");this._buffers.normal&&i!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.normal),this.gl.vertexAttribPointer(i,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(i)):i!==-1&&this.gl.disableVertexAttribArray(i);let n=this.gl.getAttribLocation(this._shaderProgram,"a_uv");this._buffers.uv&&n!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.uv),this.gl.vertexAttribPointer(n,2,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(n)):n!==-1&&this.gl.disableVertexAttribArray(n);let o=this.gl.getAttribLocation(this._shaderProgram,"a_tangent");this._buffers.tangent&&o!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.tangent),this.gl.vertexAttribPointer(o,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(o)):o!==-1&&this.gl.disableVertexAttribArray(o);let s=this.gl.getAttribLocation(this._shaderProgram,"a_bitangent");this._buffers.bitangent&&s!==-1?(this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._buffers.bitangent),this.gl.vertexAttribPointer(s,3,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(s)):s!==-1&&this.gl.disableVertexAttribArray(s),this.bindSkinAttributes(this._shaderProgram),this._buffers.indices&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._buffers.indices)}bindSkinAttributes(t){let i=this.gl,n=i.getAttribLocation(t,"a_joints"),o=i.getAttribLocation(t,"a_weights");n!==-1&&(this._buffers.joints?(i.bindBuffer(i.ARRAY_BUFFER,this._buffers.joints),i.vertexAttribIPointer(n,4,i.UNSIGNED_SHORT,0,0),i.enableVertexAttribArray(n)):i.disableVertexAttribArray(n)),o!==-1&&(this._buffers.weights?(i.bindBuffer(i.ARRAY_BUFFER,this._buffers.weights),i.vertexAttribPointer(o,4,i.FLOAT,!1,0,0),i.enableVertexAttribArray(o)):i.disableVertexAttribArray(o))}use(){!this._shaderProgram||!this._initialized||this.gl.useProgram(this._shaderProgram)}release(){}loadDataIntoShader(){if(!this.material)return;this.use();let t=this.material;t&&this.setVec4("u_matColor",t.color.toVec4())}setMat4(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&(this.use(),this.gl.uniformMatrix4fv(n,!1,Float32Array.from(i)))}setMat3(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniformMatrix3fv(n,!1,Float32Array.from(i))}setVec4(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniform4fv(n,Float32Array.from(i))}setVec3(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniform3fv(n,Float32Array.from(i))}setVec2(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniform2fv(n,Float32Array.from(i))}setFloat(t,i){let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniform1f(n,i)}setInt(t,i){this.use();let n=this.gl.getUniformLocation(this._shaderProgram,t);n&&this.gl.uniform1i(n,i)}setTexture(t,i,n){this.use();let o=this.gl.getUniformLocation(this._shaderProgram,t);o&&(this.gl.activeTexture(this.gl.TEXTURE0+n),this.gl.bindTexture(this.gl.TEXTURE_2D,i.glTexture),this.gl.uniform1i(o,n))}setBuffer(t,i){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(i.flat()),this.gl.STATIC_DRAW)}setIndices(t){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._buffers.indices);let i=new Uint16Array(t);this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,i,this.gl.STATIC_DRAW)}compileShader(t,i,n,o){let s=t.createShader(i);if(!s)return null;if(t.shaderSource(s,n),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS)){let a=i===t.VERTEX_SHADER?"Vertex":"Fragment",l=t.getShaderInfoLog(s),u=n.split(`
`),c=u.slice(0,15).join(`
`)+(u.length>15?`
...`:"");return console.error(`[Shader Compilation Error] ${a} Shader failed: ${o}`),console.error(`Info Log:
${l}`),console.error(`Source Preview:
${c}`),t.deleteShader(s),null}return s}createProgram(t,i,n){let o=t.createProgram();if(!o)return null;if(this._shaderProgram&&this.gl.deleteProgram(this._shaderProgram),t.attachShader(o,i),t.attachShader(o,n),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS))return console.trace("Unable to initialize the shader program:",t.getProgramInfoLog(o)),null;let s=[["CameraBlock",0],["LightsBlock",1],["ShadowsBlock",2]];for(let[a,l]of s){let u=t.getUniformBlockIndex(o,a);u!==t.INVALID_INDEX&&t.uniformBlockBinding(o,u,l)}return o}recompile(){this._initialized=!1,this.initialize()}destroy(){this._buffers.position&&this.gl.deleteBuffer(this._buffers.position),this._buffers.normal&&this.gl.deleteBuffer(this._buffers.normal),this._buffers.uv&&this.gl.deleteBuffer(this._buffers.uv),this._buffers.tangent&&this.gl.deleteBuffer(this._buffers.tangent),this._buffers.bitangent&&this.gl.deleteBuffer(this._buffers.bitangent),this._buffers.indices&&this.gl.deleteBuffer(this._buffers.indices),this._buffers.joints&&this.gl.deleteBuffer(this._buffers.joints),this._buffers.weights&&this.gl.deleteBuffer(this._buffers.weights),this._shaderProgram&&this.gl.deleteProgram(this._shaderProgram),this._initialized=!1}toJsonObject(){return{...super.toJsonObject(),uuid:this.uuid,type:this.constructor.name,fragUri:this.fragUri,vertexUri:this.vertexUri,material:this.material?.toJsonObject()}}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(et,"Shader"),et.SHADER_FUNCTIONS={"@INCLUDE_FOG_FUNC":oe.frag.fog,"@INCLUDE_LIGHT_FUNC":oe.frag.light,"@INCLUDE_UTIL_FUNC":oe.frag.functions};var Ne=et;var qt=4096,qe={directional:1,spot:4,point:2},$o=qe.directional+qe.spot+qe.point,Jt=qe.directional+qe.spot+6*qe.point,dl=95,Ni={directional:[{x:0,y:0,size:2048}],spot:[0,1,2,3].map(e=>({x:2048+e%2*1024,y:Math.floor(e/2)*1024,size:1024})),point:Array.from({length:12},(e,r)=>({x:r%4*512,y:2048+Math.floor(r/4)*512,size:512}))};function Hm(e,r){if(r===qt)return e;let t=r/qt;return{x:e.x*t,y:e.y*t,size:e.size*t}}d(Hm,"scaledTile");function hl(e,r,t){let i=e.filter(h=>h.castShadows),n=d((h,m)=>i.filter(p=>p.entityType===h).map(p=>({l:p,d:x.distance(p.transform.worldPosition,r)})).sort((p,v)=>p.d-v.d).slice(0,m).sort((p,v)=>e.indexOf(p.l)-e.indexOf(v.l)).map(p=>p.l),"nearest"),o=t.atlasSize??qt,s=Math.min(qe.spot,Math.max(0,t.budget?.spot??qe.spot)),a=Math.min(qe.point,Math.max(0,t.budget?.point??qe.point)),l=d(h=>Hm(h,o),"tile"),u={atlasSize:o,slots:[],views:[],slotOf:new Map},c=d((h,m,p,v)=>{u.slotOf.set(h,u.slots.length),u.slots.push({light:h,firstView:u.views.length,viewCount:m.length,texelSize:p,perspective:v});for(let f of m)u.views.push({light:h,...f})},"addSlot");return n(1,qe.directional).forEach((h,m)=>{let p=l(Ni.directional[m]),v=Jm(h.direction,r,t.directionalDistance,p.size);c(h,[{rect:p,matrix:v}],2*t.directionalDistance/p.size,!1)}),n(3,s).forEach((h,m)=>{let p=l(Ni.spot[m]);c(h,[{rect:p,matrix:Ym(h)}],2*Math.tan(ml(h)/2)/p.size,!0)}),n(2,a).forEach((h,m)=>{let p=l(Ni.point[m*6]).size,v=2*Math.tan(dl*Math.PI/360)/p;c(h,jm(h).map((f,g)=>({matrix:f,rect:l(Ni.point[m*6+g])})),v,!0)}),u}d(hl,"planShadows");function Jm(e,r,t,i){let n=x.normalize(x.create(),e),o=Math.abs(n[1])>.999?x.fromValues(0,0,1):x.fromValues(0,1,0),s=x.scaleAndAdd(x.create(),r,n,-t),a=E.lookAt(E.create(),s,r,o),l=E.ortho(E.create(),-t,t,-t,t,.1,qm(t)),u=E.multiply(E.create(),l,a),c=x.transformMat4(x.create(),[0,0,0],u),h=i/2,m=(Math.round(c[0]*h)-c[0]*h)/h,p=(Math.round(c[1]*h)-c[1]*h)/h;return E.multiply(E.create(),E.fromTranslation(E.create(),[m,p,0]),u)}d(Jm,"directionalMatrix");function qm(e){return e*3}d(qm,"directionalDepthRange");function ml(e){return Math.min(170,e.coneAngles.outer*2+2)*(Math.PI/180)}d(ml,"spotFov");function Ym(e){let r=e.transform.worldPosition,t=x.normalize(x.create(),e.toLightDirection),i=Math.abs(t[1])>.999?x.fromValues(0,0,1):x.fromValues(0,1,0),n=x.add(x.create(),r,t),o=E.perspective(E.create(),ml(e),1,.05,Math.max(.1,e.range));return E.multiply(E.create(),o,E.lookAt(E.create(),r,n,i))}d(Ym,"spotMatrix");var $m=[{dir:[1,0,0],up:[0,-1,0]},{dir:[-1,0,0],up:[0,-1,0]},{dir:[0,1,0],up:[0,0,1]},{dir:[0,-1,0],up:[0,0,-1]},{dir:[0,0,1],up:[0,-1,0]},{dir:[0,0,-1],up:[0,-1,0]}];function jm(e){let r=e.transform.worldPosition,t=E.perspective(E.create(),dl*(Math.PI/180),1,.05,Math.max(.1,e.range));return $m.map(({dir:i,up:n})=>{let o=x.add(x.create(),r,i);return E.multiply(E.create(),t,E.lookAt(E.create(),r,o,n))})}d(jm,"pointMatrices");var jo={matrices:0,rects:4*Jt,params:5*Jt,extra:5*Jt+$o,atlas:5*Jt+2*$o,slots:5*Jt+2*$o+1};function pl(e,r,t,i=16){let n=e.atlasSize??qt,o=jo,s=t??new Float32Array(o.slots*4);return s.fill(0),e.views.forEach((a,l)=>{s.set(a.matrix,(o.matrices+l*4)*4);let u=1/n;s.set([a.rect.x*u,a.rect.y*u,a.rect.size*u,a.rect.size*u],(o.rects+l)*4)}),e.slots.forEach((a,l)=>{s.set([a.texelSize,a.perspective?1:0,0,a.firstView],(o.params+l)*4);let u=Math.min(1,Math.max(0,a.light.shadowStrength??1));s.set([u,Math.max(0,a.light.shadowDepthBias),Math.max(0,a.light.shadowNormalBias),0],(o.extra+l)*4)}),s.set([1/n,i,r?1:0,0],o.atlas*4),s}d(pl,"packShadows");var Qm=2,Ko=2,Yr=7,Yt=class Yt{constructor(r){this.gl=r;this.name="ShadowAtlasPass";this.enabled=!0;this.uboData=new Float32Array(jo.slots*4);this.filter=16;this.cacheViews=!0;this.stats={views:0,redrawn:0,draws:0};this.cache=[];this.casters=new Map;this.frame=0;this.planes=new Float32Array(24);this.bounds=Or();this.modelLight=E.create();this.atlas=this.createAtlas(qt),this.plain=Yt.casterProgram(r,[]),this.skinned=Yt.casterProgram(r,["SKINNED"]),this.ubo=r.createBuffer(),r.bindBuffer(r.UNIFORM_BUFFER,this.ubo),r.bufferData(r.UNIFORM_BUFFER,this.uboData.byteLength,r.DYNAMIC_DRAW),r.bindBuffer(r.UNIFORM_BUFFER,null)}get atlasTexture(){return this.atlas.depthTexture}get atlasSize(){return this.atlas.width}resetStats(){this.stats.views=this.stats.redrawn=this.stats.draws=0}invalidate(){this.cache=[]}render(r,t){let i=this.gl,n=this.enabled?r.views.slice(0,Jt):[];this.stats.views+=n.length,(r.atlasSize??qt)!==this.atlas.width&&(this.atlas.dispose(),this.atlas=this.createAtlas(r.atlasSize),this.invalidate()),(!this.enabled||!this.cacheViews)&&this.invalidate();let o=this.casterChanges(t),s=n.map((a,l)=>this.isDirty(l,a.light,a.matrix,o));if(s.some(a=>a)){let a=i.isEnabled(i.CULL_FACE),l=i.getParameter(i.CULL_FACE_MODE);this.atlas.bind(),i.enable(i.SCISSOR_TEST),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.depthMask(!0),i.enable(i.CULL_FACE),i.cullFace(i.FRONT),n.forEach((u,c)=>{if(!s[c])return;let{x:h,y:m,size:p}=u.rect;i.viewport(h,m,p,p),i.scissor(h,m,p,p),i.clear(i.DEPTH_BUFFER_BIT),Gr(u.matrix,this.planes);for(let v of t){let f=this.casters.get(v);f?.hasBounds&&!zr(this.planes,f.bounds.center,f.bounds.radius)||(this.drawDepth(v,u.matrix),this.stats.draws++)}this.cache[c]={light:u.light,matrix:Float32Array.from(u.matrix)},this.stats.redrawn++}),this.cache.length=n.length,i.disable(i.SCISSOR_TEST);for(let u of[this.plain,this.skinned])u.position>=0&&i.disableVertexAttribArray(u.position);i.cullFace(l),a||i.disable(i.CULL_FACE),i.bindFramebuffer(i.FRAMEBUFFER,null)}pl({...r,views:n},this.enabled,this.uboData,this.filter),i.bindBuffer(i.UNIFORM_BUFFER,this.ubo),i.bufferSubData(i.UNIFORM_BUFFER,0,this.uboData),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,Qm,this.ubo)}bindAtlas(){this.gl.activeTexture(this.gl.TEXTURE0+Ko),this.gl.bindTexture(this.gl.TEXTURE_2D,this.atlas.depthTexture),this.gl.activeTexture(this.gl.TEXTURE0)}casterChanges(r){let t=[],i=++this.frame;for(let n of r){let o=n.getBehaviour(Te),s=n.transform.modelMatrix,a=o?.deformationVersion??0,l=o?.shader?.buffers?.position??null,u=this.casters.get(n),c=!!u&&u.version===a&&u.buffer===l&&fl(u.matrix,s);if(u&&c){u.seen=i;continue}u&&t.push(u.hasBounds?{center:Float32Array.from(u.bounds.center),radius:u.bounds.radius}:null),u??(u={matrix:new Float32Array(16),version:a,buffer:l,bounds:Or(),hasBounds:!1,seen:i}),u.matrix.set(s),u.version=a,u.buffer=l,u.seen=i,u.hasBounds=!!o?.worldBounds(u.bounds),t.push(u.hasBounds?{center:Float32Array.from(u.bounds.center),radius:u.bounds.radius}:null),this.casters.set(n,u)}for(let[n,o]of this.casters)o.seen!==i&&(t.push(o.hasBounds?o.bounds:null),this.casters.delete(n));return t}isDirty(r,t,i,n){let o=this.cache[r];return!o||o.light!==t||!fl(o.matrix,i)?!0:n.length?(Gr(i,this.planes),n.some(s=>!s||zr(this.planes,s.center,s.radius))):!1}createAtlas(r){let t=this.gl,i=new Ze(t,r,r,{color:null,depth:"texture"});return t.bindTexture(t.TEXTURE_2D,i.depthTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),i}dispose(){this.atlas.dispose(),this.gl.deleteProgram(this.plain.program),this.gl.deleteProgram(this.skinned.program),this.gl.deleteBuffer(this.ubo)}drawDepth(r,t){let i=this.gl,n=r.getBehaviour(Te),o=n?.shader,s=o?.buffers,a=n?.mesh?.meshData?.indices;if(!o||!s?.position||!s.indices||!a?.length)return;let l=n.jointTexture,u=l&&s.joints?this.skinned:this.plain;i.useProgram(u.program),E.multiply(this.modelLight,t,r.transform.modelMatrix),i.uniformMatrix4fv(u.matrix,!1,this.modelLight),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,s.position),i.enableVertexAttribArray(u.position),i.vertexAttribPointer(u.position,3,i.FLOAT,!1,0,0),u===this.skinned&&(i.activeTexture(i.TEXTURE0+Yr),i.bindTexture(i.TEXTURE_2D,l),i.uniform1i(u.jointTexture,Yr),i.activeTexture(i.TEXTURE0),o.bindSkinAttributes(u.program)),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,s.indices),i.drawElements(i.TRIANGLES,a.length,o.indexType,0),u===this.skinned&&Yt.disableSkinAttributes(i,u.program)}static casterProgram(r,t){let i=Yt.link(r,Ne.withDefines(wt[oe.vertex.shadow_caster],t),wt[oe.frag.depth_only]);return{program:i,position:r.getAttribLocation(i,"a_position"),matrix:r.getUniformLocation(i,"u_modelMatrix"),jointTexture:r.getUniformLocation(i,"u_jointTexture")}}static disableSkinAttributes(r,t){for(let i of["a_joints","a_weights"]){let n=r.getAttribLocation(t,i);n>=0&&r.disableVertexAttribArray(n)}}static link(r,t,i){let n=d((s,a)=>{let l=r.createShader(s);if(r.shaderSource(l,a),r.compileShader(l),!r.getShaderParameter(l,r.COMPILE_STATUS))throw new Error(`ShadowAtlasPass: ${r.getShaderInfoLog(l)}`);return l},"compile"),o=r.createProgram();if(r.attachShader(o,n(r.VERTEX_SHADER,t)),r.attachShader(o,n(r.FRAGMENT_SHADER,i)),r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS))throw new Error(`ShadowAtlasPass: ${r.getProgramInfoLog(o)}`);return o}};d(Yt,"ShadowAtlasPass");var yr=Yt;function fl(e,r){for(let t=0;t<16;t++)if(e[t]!==r[t])return!1;return!0}d(fl,"equal");var Qo=class Qo extends q{constructor(r){super("GeometryPass"),this.gl=r,this.ubo=new Ot(r)}initialize(){}execute(r,t){if(!t)return;let{frame:i}=t;this.ubo.update(i.camera.viewMatrix,i.camera.projectionMatrix);for(let n of i.opaque)n.draw();for(let n of i.skybox)n.draw();for(let n of i.transparent)n.draw()}cleanup(){}resize(r,t){}setGl(r){this.gl=r,this.ubo=new Ot(r)}toJsonObject(){return this.getBaseJsonInfo()}fromJson(r){super.fromJson(r)}};d(Qo,"GeometryPass");var Ui=Qo;var es=class es{constructor(){this.enabled=!0;this.program=null}setUniforms(r,t){}render(r){if(!r.source)return;let t=r.gl;this.program??(this.program=new vr(t,this.fragUri)),r.target.bind(),this.program.use(),this.program.bindTexture("u_screenTexture",r.source.colorTexture,0),this.setUniforms(this.program,r),this.program.draw()}dispose(){this.program?.dispose(),this.program=null}};d(es,"PostEffect");var Zo=es,ts=class ts extends Zo{constructor(){super(...arguments);this.name="Retro";this.fragUri=oe.frag.retro;this.distortion=.15;this.aberration=.008}setUniforms(t,i){i.gl.uniform1f(t.uniform("u_time"),i.frame.time),i.gl.uniform1f(t.uniform("u_distortionStrength"),this.distortion),i.gl.uniform1f(t.uniform("u_aberrationSpread"),this.aberration)}};d(ts,"RetroEffect");var Oi=ts;var rs="";var Gi=class Gi extends q{constructor(){super("RenderPipelineSettings");this.shadowsEnabled=!0;this.shadowDistance=new K(60,5,500,1);this.hdr=!0;this.toneMapping=0;this.exposure=new K(1,0,8,.01);this.saturation=new K(1,0,2,.01);this.contrast=new K(1,.5,2,.01);this.retroEffect=!1;this.renderScale=new K(1,.25,2,.05);this.dynamicResolution=!1;this.targetFrameRate=new K(30,15,120,1);this.shadowMapSize=4096;this.shadowFilter=16;this.maxSpotShadows=new K(4,0,4,1);this.maxPointShadows=new K(2,0,2,1);this.cacheShadows=!0}applyQuality(t){let i={0:{scale:.5,dynamic:!0,atlas:1024,filter:4,spot:1,point:0},1:{scale:.75,dynamic:!0,atlas:2048,filter:4,spot:2,point:1},2:{scale:1,dynamic:!1,atlas:4096,filter:16,spot:4,point:2}},n=i[t]??i[2];this.renderScale.value=n.scale,this.dynamicResolution=n.dynamic,this.shadowMapSize=n.atlas,this.shadowFilter=n.filter,this.maxSpotShadows.value=n.spot,this.maxPointShadows.value=n.point,this.cacheShadows=!0}static suggestedQuality(t){if(typeof navigator>"u")return 2;let i=navigator,n=i.userAgentData?.mobile===!0||/Android|iPhone|iPad|iPod|Mobile/i.test(i.userAgent),o=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches&&!matchMedia("(any-pointer: fine)").matches;return n||o||Gi.isMobileGpu(t)?0:2}static isMobileGpu(t){if(!t)return!1;let i=t.getExtension("WEBGL_debug_renderer_info"),n=String(t.getParameter(i?i.UNMASKED_RENDERER_WEBGL:t.RENDERER)??"");return/Mali|Adreno|PowerVR|Apple GPU|Xclipse|Immortalis|Maleoon|VideoCore/i.test(n)}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(Gi,"RenderPipelineSettings");var $r=Gi,zi=class zi extends q{constructor(t="Render Pipeline"){super("RenderPipeline");this.name=t;this.settings=new $r;this.lightsUbo=null;this._views=new Map;this._copy=null;this._passes=[];this._retro=new Oi;this.effects=[this._retro];this._startTime=performance.now();this._dynamicFactor=1;this._lastFrame=0;this._frameTimes=[];this._lastAdjust=0;this._serializationIgnoreKeys.push("_gl","ubo","lightsUbo","scene","_shadowmapPass","_geometryPass","_views","_copy","_passes","_retro","effects","_startTime","_dynamicFactor","_lastFrame","_frameTimes","_lastAdjust")}static instanciate(){return new zi}get shadowMap(){return this._shadowmapPass}get currentRenderScale(){let t=this.settings.renderScale.value;return this.settings.dynamicResolution?t*this._dynamicFactor:t}get sceneTarget(){return this._views.get(rs)?.scene??null}setGlRenderingContext(t){this._gl=t,this.ubo=new Ot(t),this.lightsUbo?.dispose(),this.lightsUbo=new Xi(t),this._shadowmapPass?.dispose(),this._shadowmapPass=new yr(t),this._geometryPass??(this._geometryPass=new Ui(t)),this._geometryPass.setGl(t),this.applySettings(),this.disposeTargets(),this._copy?.dispose(),this._copy=new vr(t,oe.frag.copy_with_depth);for(let i of this._passes)i.initialize(t)}initialize(t){this.scene=t}addPass(t){this._gl&&t.initialize(this._gl),this._passes.push(t)}draw(){let t=this._gl,i=se.mainCamera;if(!this.scene||!t||!i||!this._copy)return;let n=Float32Array.from(t.getParameter(t.COLOR_CLEAR_VALUE)),o=performance.now(),s=(o-this._startTime)/1e3;this.applySettings(),this.adjustResolution(o),this._shadowmapPass.resetStats();let a=H.for(t);for(let u of this.textureCameras(i)){let c=a.getRenderTexture(u.targetTexture),h=Math.max(1,u.targetWidth|0),m=Math.max(1,u.targetHeight|0);u.aspectRatio=h/m,u.refreshMatrices(),se.setMainCamera(u);try{let p=c.beginWrite(h,m);this.renderView(u,c.textureUri,h,m,n,s,p),c.endWrite()}finally{se.setMainCamera(i)}}let l=this.currentRenderScale;this.renderView(i,rs,t.drawingBufferWidth*l,t.drawingBufferHeight*l,n,s,null)}adjustResolution(t){let i=this._lastFrame?t-this._lastFrame:0;if(this._lastFrame=t,!this.settings.dynamicResolution){this._dynamicFactor=1,this._frameTimes.length=0;return}if(i>0&&i<250&&this._frameTimes.push(i),t-this._lastAdjust<1e3||this._frameTimes.length<10)return;let n=this._frameTimes.reduce((s,a)=>s+a,0)/this._frameTimes.length;this._frameTimes.length=0,this._lastAdjust=t;let o=1e3/Math.max(1,this.settings.targetFrameRate.value);n>o*1.1?this._dynamicFactor=Math.max(.5,this._dynamicFactor-.1):n<o*.8&&(this._dynamicFactor=Math.min(1,this._dynamicFactor+.05))}textureCameras(t){return this.scene.objects.filter(i=>i instanceof se&&i!==t&&i.active&&!!i.targetTexture)}renderView(t,i,n,o,s,a,l){let u=this._gl,c=this.ensureView(i,n,o),h=c.scene;for(let b of this.scene.objects)b.transform.parent||b.transform.updateMatrices();let m=qa(this.scene,t,a);for(let b of new Set([...m.opaque,...m.transparent,...m.shadowCasters]))b.getBehaviour(Te)?.beforeRender();let p={gl:u,frame:m,target:h},v=hl(m.lights,t.transform.worldPosition,{directionalDistance:this.settings.shadowDistance.value,atlasSize:this.settings.shadowMapSize,budget:{spot:this.settings.maxSpotShadows.value,point:this.settings.maxPointShadows.value}});this._shadowmapPass.render(v,m.shadowCasters),this._shadowmapPass.bindAtlas(),this.ubo.update(t.viewMatrix,t.projectionMatrix),this.lightsUbo.update(m.lights,v.slotOf),h.bind(),h.clear(s),u.enable(u.DEPTH_TEST),u.depthFunc(u.LESS),this._geometryPass.execute(this.scene,p);for(let b of this._passes)b.execute(this.scene,p);let f=h,g=this.effects.filter(b=>b.enabled);g.length&&this.withFullscreenState(()=>{for(let b of g){let M=this.postTarget(c,f===c.post[0]?1:0);b.render({...p,source:f,target:M}),f=M}}),this.copyTo(l,f,h)}resize(t,i){let n=this.currentRenderScale;t=Math.max(1,Math.floor(t*n)),i=Math.max(1,Math.floor(i*n));let o=this._views.get(rs);o?.scene.resize(t,i);for(let s of o?.post??[])s.resize(t,i);for(let s of this._passes)s.resize(t,i)}destroy(){this.disposeTargets(),this._copy?.dispose(),this.lightsUbo?.dispose();for(let t of this.effects)t.dispose();this._shadowmapPass?.dispose();for(let t of this._passes)t.cleanup();this._copy=null}copyTo(t,i,n){let o=this._gl;t?t.bind():(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight)),this.withFullscreenState(()=>{o.enable(o.DEPTH_TEST),o.depthFunc(o.ALWAYS),o.depthMask(!0);let s=this._copy;s.use(),s.bindTexture("u_color",i.colorTexture,0),s.bindTexture("u_depth",n.depthTexture,1),o.uniform1i(s.uniform("u_toneMapping"),this.settings.toneMapping),o.uniform1f(s.uniform("u_exposure"),this.settings.exposure.value),o.uniform1f(s.uniform("u_saturation"),this.settings.saturation.value),o.uniform1f(s.uniform("u_contrast"),this.settings.contrast.value),s.draw(),o.depthFunc(o.LESS)})}withFullscreenState(t){let i=this._gl,n=i.isEnabled(i.BLEND),o=i.isEnabled(i.CULL_FACE),s=i.isEnabled(i.DEPTH_TEST);i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),t(),i.bindTexture(i.TEXTURE_2D,null),i.activeTexture(i.TEXTURE0),n&&i.enable(i.BLEND),o&&i.enable(i.CULL_FACE),s?i.enable(i.DEPTH_TEST):i.disable(i.DEPTH_TEST)}colorFormat(){return this.settings.hdr&&Ze.supportsFloatColor(this._gl)?"rgba16f":"rgba8"}ensureView(t,i,n){let o=this._views.get(t);return o&&o.scene.color!==this.colorFormat()&&(this.disposeView(o),o=void 0),o||(o={scene:new Ze(this._gl,i,n,{color:this.colorFormat(),depth:"texture"}),post:[]},this._views.set(t,o)),o.scene.resize(i,n),o}postTarget(t,i){let n=t.scene,o=t.post[i];return(!o||o.color!==n.color)&&(o?.dispose(),o=t.post[i]=new Ze(this._gl,n.width,n.height,{color:n.color,depth:null})),o.resize(n.width,n.height),o}disposeView(t){t.scene.dispose();for(let i of t.post)i.dispose()}disposeTargets(){for(let t of this._views.values())this.disposeView(t);this._views.clear()}applySettings(){this._shadowmapPass&&(this._shadowmapPass.enabled=this.settings.shadowsEnabled,this._shadowmapPass.filter=this.settings.shadowFilter,this._shadowmapPass.cacheViews=this.settings.cacheShadows,this._retro.enabled=this.settings.retroEffect)}fromJson(t){super.fromJson(t),t.settings&&this.settings.fromJson(t.settings),this.applySettings()}toJsonObject(){return{...this.getBaseJsonInfo(),settings:this.settings.toJsonObject()}}};d(zi,"RenderPipeline");var $t=zi;G.addDependency("RenderPipeline",$t.instanciate,{name:"RenderPipeline",type:"RenderBehaviour",path:"Renderers/RenderPipeline",description:"Forward render pipeline: shadow map, scene into an off-screen target, copy to the canvas."});var Rt=class Rt{static get primary(){return this.active.values().next().value}static onDown(r){return this.downListeners.add(r),()=>this.downListeners.delete(r)}static onMove(r){return this.moveListeners.add(r),()=>this.moveListeners.delete(r)}static onUp(r){return this.upListeners.add(r),()=>this.upListeners.delete(r)}static velocity(r,t=100){let i=r.history;if(i.length<2)return{x:0,y:0};let n=i[i.length-1],o=i[i.length-2];for(let a=i.length-2;a>=0&&n.time-i[a].time<=t;a--)o=i[a];let s=(n.time-o.time)/1e3;return s<=0?{x:0,y:0}:{x:(n.x-o.x)/s,y:(n.y-o.y)/s}}static _down(r,t,i,n,o){let s={id:r,type:t,x:i,y:n,startX:i,startY:n,startTime:o,history:[{x:i,y:n,time:o}]};this.active.set(r,s);for(let a of this.downListeners)a(s)}static _move(r,t,i,n){let o=this.active.get(r);if(o){for(o.x=t,o.y=i,o.history.push({x:t,y:i,time:n});o.history.length>2&&n-o.history[0].time>this.historyMs;)o.history.shift();for(let s of this.moveListeners)s(o)}}static _up(r,t,i,n){let o=this.active.get(r);if(o){this._move(r,t,i,n),this.active.delete(r);for(let s of this.upListeners)s(o)}}};d(Rt,"Pointer"),Rt.historyMs=250,Rt.active=new Map,Rt.downListeners=new Set,Rt.moveListeners=new Set,Rt.upListeners=new Set;var jt=Rt;var jr=class jr extends q{constructor(t,i=new Je){super("SceneEntity");this.destroyed=!1;this.active=!0;this.show=!0;this.tag="Entity";this.updateInEditor=!1;this.behaviours=[];this.entityType=-1;this.name=t,this.transform=i,this.transform.parentEntity=this}get type(){return this.constructor.name}static get className(){return"SceneEntity"}static instanciate(t="Entity",i){return(!i||!(i instanceof Je))&&(i=new Je),new jr(t,i)}initialize(){for(let t of this.behaviours)t.initialize();this.destroyed=!1,this.update(0)}update(t){if(this.active){this.transform.updateMatrices();for(let i of this.behaviours.filter(n=>n.active))i.update(t)}}draw(){if(this.active)for(let t of this.behaviours.filter(i=>i.active))t.draw()}destroy(){for(let t of this.behaviours)t.destroy();this.destroyed=!0}addBehaviour(t){t.parent=this,t.initialize(),this.behaviours.push(t)}removeBehaviour(t){let i=this.behaviours.indexOf(t);i>=0&&this.behaviours.splice(i,1)[0]?.destroy()}getBehaviours(t){return this.behaviours.filter(i=>i instanceof t)}getBehaviour(t){return this.behaviours.find(i=>i instanceof t)}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}toJsonObject(){let t=this.serializeAutomatically();return t.behaviours=this.behaviours.map(i=>i.toJsonObject()),console.debug("Serialized behaviour",t),t}clone(){let t=jr.instanciate(this.name,this.transform);return t.fromJson(this.toJsonObject()),t}};d(jr,"SceneEntity");var _e=jr;var Vi=class Vi extends _e{constructor(t){super(t);this._className="Light";this.entityType=0;this.castShadows=!1;this.shadowDepthBias=.5;this.shadowNormalBias=1;this.shadowStrength=.75;this.color=new y(.2,.2,.2,1),this.entityType=0}static instanciate(t,i){return new Vi(t||"Light")}};d(Vi,"Light");var Be=Vi;var Wi=class Wi extends Be{constructor(t){super(t);this._className="DirectionalLight";this.entityType=1;this.invertLightDirection=!1;this.entityType=1,this.color=new y(1,.98,.95,.7),this.castShadows=!0}static get className(){return"DirectionalLight"}get direction(){return x.normalize(x.create(),this.invertLightDirection?this.transform.back:this.transform.forward)}static instanciate(t,i){return new Wi(t||"Directional Light")}};d(Wi,"DirectionalLight");var Ct=Wi;var is=class is extends q{constructor(){super("LightAttenuation");this.constant=.2;this.linear=.01;this.quadratic=.001}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(is,"LightAttenuation");var _r=is;var ns=class ns extends q{constructor(){super("LightConeAngles");this.inner=20;this.outer=30}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(ns,"LightConeAngles");var Hi=ns;var qi=class qi extends Be{constructor(t){super(t);this._className="PointLight";this.entityType=2;this.range=25;this.entityType=2,this.color=new y(1,.85,.57,1),this.attenuation=new _r}static get className(){return"PointLight"}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}static instanciate(t,i){return new qi(t||"Light")}};d(qi,"PointLight");var Ji=qi;var $i=class $i extends Be{constructor(t){super(t);this._className="SpotLight";this.entityType=3;this.coneAngles=new Hi;this.attenuation=new _r;this.range=25;this.entityType=3,this.color=new y(1,.96,.89,1)}get toLightDirection(){return this.transform.forward}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}static instanciate(t,i){return new $i(t||"Light")}};d($i,"SpotLight");var Yi=$i;var ji=class ji extends _e{constructor(){super("Camera");this._className="Camera";this.cameraType=0;this.orthoSize=10;this.fieldOfView=45;this.nearPlane=.01;this.farPlane=2e3;this.aspectRatio=1;this.targetTexture="";this.targetWidth=512;this.targetHeight=512;this.tag="Camera";this.entityType=4,this._projectionMatrix=E.create(),this._viewMatrix=E.create()}static get mainCamera(){return this._mainCamera}get projectionMatrix(){return this._projectionMatrix}get viewMatrix(){return this._viewMatrix}static setMainCamera(t){this._mainCamera=t}initialize(){this.updateProjectionMatrix(),this.updateViewMatrix(),super.initialize()}updateProjectionMatrix(){if(this.cameraType===0)E.perspective(this._projectionMatrix,this.fieldOfView*Math.PI/180,this.aspectRatio,this.nearPlane,this.farPlane);else{let t=-this.orthoSize*this.aspectRatio,i=this.orthoSize*this.aspectRatio,n=-this.orthoSize,o=this.orthoSize;E.ortho(this._projectionMatrix,t,i,n,o,-this.farPlane,this.farPlane)}}refreshMatrices(){this.updateProjectionMatrix(),this.updateViewMatrix()}updateViewMatrix(){let t=this.transform.worldPosition,i=x.add(x.create(),t,this.transform.forward),n=this.transform.up;E.lookAt(this._viewMatrix,t,i,n)}update(t){this.updateViewMatrix(),super.update(t)}worldToScreenPosition(t,i,n){let o=E.create();E.multiply(o,this._projectionMatrix,this._viewMatrix);let s=ve.fromValues(t[0],t[1],t[2],1);if(ve.transformMat4(s,s,o),s[3]===0)return he.fromValues(0,0);let a=x.fromValues(s[0]/s[3],s[1]/s[3],s[2]/s[3]),l=(a[0]*.5+.5)*i,u=(a[1]*-.5+.5)*n;return he.fromValues(l,u)}screenToWorldRay(t,i,n){let o=2*t[0]/i-1,s=1-2*t[1]/n,a=E.create();E.multiply(a,this._projectionMatrix,this._viewMatrix);let l=E.create();E.invert(l,a);let u=ve.fromValues(o,s,-1,1),c=ve.fromValues(o,s,1,1),h=ve.create();ve.transformMat4(h,u,l);let m=ve.create();if(ve.transformMat4(m,c,l),h[3]===0||m[3]===0)return{origin:x.fromValues(0,0,0),direction:x.fromValues(0,0,0)};let p=x.fromValues(h[0]/h[3],h[1]/h[3],h[2]/h[3]),v=x.fromValues(m[0]/m[3],m[1]/m[3],m[2]/m[3]),f=x.create();return x.subtract(f,v,p),x.normalize(f,f),{origin:p,direction:f}}screenToWorldPosition(t,i,n,o){let{origin:s,direction:a}=this.screenToWorldRay(t,n,o),l=x.create();return x.scaleAndAdd(l,s,a,i),l}worldToClipPosition(t){let i=E.create();E.multiply(i,this._projectionMatrix,this._viewMatrix);let n=ve.fromValues(t[0],t[1],t[2],1);return ve.transformMat4(n,n,i),n}toJsonObject(){return{...super.toJsonObject(),cameraType:this.cameraType,orthoSize:this.orthoSize,fieldOfView:this.fieldOfView,nearPlane:this.nearPlane,farPlane:this.farPlane,aspectRatio:this.aspectRatio,targetTexture:this.targetTexture,targetWidth:this.targetWidth,targetHeight:this.targetHeight}}fromJson(t){super.fromJson(t),t.cameraType!==void 0&&(this.cameraType=t.cameraType),t.orthoSize!==void 0&&(this.orthoSize=t.orthoSize),t.fieldOfView!==void 0&&(this.fieldOfView=t.fieldOfView),t.nearPlane!==void 0&&(this.nearPlane=t.nearPlane),t.farPlane!==void 0&&(this.farPlane=t.farPlane),t.aspectRatio!==void 0&&(this.aspectRatio=t.aspectRatio),t.targetTexture!==void 0&&(this.targetTexture=t.targetTexture),t.targetWidth!==void 0&&(this.targetWidth=t.targetWidth),t.targetHeight!==void 0&&(this.targetHeight=t.targetHeight)}static instanciate(t,i){let n=new ji;return n.name=t||n.name,n.transform=i||n.transform,n}};d(ji,"Camera");var se=ji;var os=class os extends _e{constructor(){super("Scene");this._className="Scene";this.isRunning=!1;this.inEditMode=!1;this.clearColor=hr.aliceBlue;this.tag="Scene";this.entityType=5;this.ellapsedTime=0;this.resourceHandles=[];this._objects=[],this.behaviours=[],this.sceneFog=new Ai,this._renderPipeline=new $t,this._renderPipeline.initialize(this)}get shadowmap(){return this._renderPipeline.shadowMap}get renderPipeline(){return this._renderPipeline}get objects(){return this._objects}get lights(){return this._objects.filter(t=>t instanceof Be)}initialize(){for(let t of this.objects)t.initialize();super.initialize()}update(t){if(!this.destroyed&&(se.mainCamera&&se.mainCamera.update(t),this.behaviours.forEach(i=>i.beforeUpdate(t)),!this.isRunning&&this.inEditMode&&this.objects?.length&&(this.objects.filter(n=>n.updateInEditor).forEach(n=>n.update(t)),this.behaviours.forEach(n=>n.update(t))),!!this.isRunning)){this.ellapsedTime+=t;for(let i of this.objects.filter(n=>n.active))i.update(t);this.behaviours.forEach(i=>i.afterUpdate())}}draw(){this.destroyed||!this.gl||!se.mainCamera||this._renderPipeline.draw()}addEntity(t){this.destroyed||(t.scene=this,this._objects.push(t),t.initialize())}removeEntity(t){if(this.destroyed)return;let i=this._objects.indexOf(t);i!==-1&&(this._objects.splice(i,1),t.destroy())}addBehaviour(t){t.parent=this,this.behaviours.push(t),t.initialize()}setGlRenderingContext(t){this.gl=t,this.behaviours.forEach(i=>{i.setGl&&i.setGl(t)}),this._renderPipeline.setGlRenderingContext(t)}holdResource(t){this.resourceHandles.push(t)}destroy(){for(let t of this.objects)t.destroy();this._objects=[];for(let t of this.resourceHandles)t.release();this.resourceHandles=[],this._renderPipeline.destroy(),super.destroy()}fromJson(t){if(super.fromJson(t),t.renderPipeline){let i=G.instanciateObjectFromJsonData(t.renderPipeline.className);this._renderPipeline=i||new $t,this._renderPipeline.fromJson(t.renderPipeline)}else this._renderPipeline=new $t;this._renderPipeline.initialize(this),this.sceneFog.fromJson(t);for(let i of t.objects)this.addEntity(i)}toJsonObject(){let t={},i={},n=this.objects.filter(o=>o.getBehaviours(Te)).map(o=>o.getBehaviour(Te));for(let o of n)if(o){if(o.shader?.material)for(let s of Object.keys(o.shader.material)){let a=o.shader.material[s];a instanceof gr?i[a.textureUris?.join("|")||a.name]=a.toJsonObject():a instanceof Qe&&(i[a.textureUri||a.name]=a.toJsonObject())}o.serializesMesh&&(o.mesh?t[o.mesh.meshData.uuid]=o.mesh.meshData.toJsonObject():console.debug("No mesh for renderer",o))}return{...this.getBaseJsonInfo(),renderPipeline:this._renderPipeline.toJsonObject(),sceneFog:this.sceneFog.toJsonObject(),objects:this.objects.map(o=>o.toJsonObject()),meshMaps:t,textureMaps:i}}getEntitieByName(t){return this.objects.find(i=>i.name===t)}getEntitieClassByName(t){return this.objects.find(i=>i.className===t)}getEntitiesClassByName(t){return this.objects.filter(i=>i.className===t)}getEntitieByUuid(t){return this.objects.find(i=>i.uuid===t)}getEntitiesByTag(t){return this.objects.filter(i=>i.tag===t)}getEntities(t){return this._objects.filter(i=>i instanceof t)}};d(os,"Scene");var wr=os;var Ki=class Ki extends q{constructor(){super("EntityBehaviour");this.active=!0;this.renderLayer=2;this._initialized=!1;this._uuid=ot(),this._serializationIgnoreKeys.push("parent","_initialized","_serializationIgnoreKeys")}static instanciate(t){return new Ki}get transform(){return this.parent?.transform}initialize(){return this._initialized=!0}update(t){}updateEditor(t){}draw(){}destroy(){}toJsonObject(){return{...super.toJsonObject(),active:this.active,uuid:this.uuid}}fromJson(t){super.fromJson(t),this.active=t.active,this._uuid=t.uuid}clone(){return null}};d(Ki,"EntityBehaviour");var fe=Ki;var Qi=class Qi extends fe{constructor(t){super();this._gl=t;this._framebuffer=null;this._depthRenderbuffer=null;this._className="RendererBehaviour";this.drawPrimitiveType=1;this._time=0;this._worldMatrixUniformLocation=null;this._worldInverseTransposeMatrixUniformLocation=null;this.enableCullFace=!0;this.enableDephTest=!0;this.enableBlend=!0;this.writeToDephBuffer=!0;this.cullFace=Mo.BACK;this.dephMode=To.Less;this.faceWinding=So.CounterClockwise;this.blendMode={sourcefactor:_o.SRC_ALPHA,destfactor:wo.ONE_MINUS_SRC_ALPHA};this.renderLayer=2;this.castShadows=!0;this.mesh=new Ut}static instanciate(t){return new Qi(t)}initialize(){return this._initialized||!this._gl?!1:(this.setGlSettings(),this.initializeShader(),super.initialize())}setGlSettings(){this._gl&&(this.enableDephTest?(this._gl.enable(this._gl.DEPTH_TEST),this._gl.depthFunc(this.dephMode)):this._gl.disable(this._gl.DEPTH_TEST),this.enableBlend?(this._gl.enable(this._gl.BLEND),this._gl.blendFunc(this.blendMode.sourcefactor,this.blendMode.destfactor)):this._gl.disable(this._gl.BLEND),this.enableCullFace?(this._gl.enable(this._gl.CULL_FACE),this._gl.cullFace(this.cullFace)):this._gl.disable(this._gl.CULL_FACE),this._gl.depthMask(this.writeToDephBuffer),this._gl.frontFace(this.faceWinding))}initializeShader(){this.shader&&(this.shader.initialize(),this.shader.buffers.position=this._gl.createBuffer(),this.shader.buffers.uv=this._gl.createBuffer(),this.shader.buffers.indices=this._gl.createBuffer())}setCameraMatrices(){if(this.shader){let t=se.mainCamera,i=E.create();this.parent.transform.updateMatrices(),E.multiply(i,t.projectionMatrix,t.viewMatrix),E.multiply(i,i,this.parent.transform.modelMatrix),this.shader.setMat4("u_mvpMatrix",i)}}setModelWorldMatrices(){if(this._worldMatrixUniformLocation&&this._gl.uniformMatrix4fv(this._worldMatrixUniformLocation,!1,new Float32Array(this.parent.transform.modelMatrix)),this._worldInverseTransposeMatrixUniformLocation){let t=E.create();E.invert(t,this.parent.transform.modelMatrix),E.transpose(t,t);let i=ur.create();ur.fromMat4(i,t),this._gl.uniformMatrix3fv(this._worldInverseTransposeMatrixUniformLocation,!1,new Float32Array(i))}}setShaderVariables(){this.setGlSettings(),this.setCameraMatrices(),this.setModelWorldMatrices(),this.shader&&(this.shader.setFloat("u_time",this._time),this.shader.setVec2("u_screenResolution",[Ke.rendererWidth,Ke.rendererHeight]),this.shader.loadDataIntoShader())}setRenderTarget(t,i,n){if(!this._gl)return;this._framebuffer||(this._framebuffer=this._gl.createFramebuffer()),this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this._framebuffer),this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._gl.COLOR_ATTACHMENT0,this._gl.TEXTURE_2D,t,0),this._depthRenderbuffer||(this._depthRenderbuffer=this._gl.createRenderbuffer()),this._gl.bindRenderbuffer(this._gl.RENDERBUFFER,this._depthRenderbuffer),this._gl.renderbufferStorage(this._gl.RENDERBUFFER,this._gl.DEPTH_COMPONENT16,i,n),this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,this._gl.DEPTH_ATTACHMENT,this._gl.RENDERBUFFER,this._depthRenderbuffer);let o=this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);o!==this._gl.FRAMEBUFFER_COMPLETE&&console.error("Framebuffer not complete!",o),this._gl.viewport(0,0,i,n)}clearRenderTarget(){this._gl&&(this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,null),this._gl.viewport(0,0,Ke.rendererWidth,Ke.rendererHeight))}startPass(t,i,n,o=[0,0,0,0]){this.setRenderTarget(t,i,n),this._gl.clearColor(o[0],o[1],o[2],o[3]),this._gl.clear(this._gl.COLOR_BUFFER_BIT|this._gl.DEPTH_BUFFER_BIT)}endPass(){this.clearRenderTarget()}toJsonObject(){return{...super.toJsonObject(),shader:this.shader?.toJsonObject(),mesh:this.mesh.toJsonObject()}}fromJson(t){super.fromJson(t);let i=t.shader.material,n=G.instanciateObjectFromJsonData(i.className);n.fromJson(i),this.shader=G.instanciateObjectFromJsonData(t.shader.className,[this._gl,n]),this.shader?.fromJson(t.shader),t.mesh&&this.mesh.fromJson(t.mesh)}drawPoint(t,i=10,n=this.shader){if(!this._gl||!n||!n.buffers.position||!n._shaderProgram){console.warn("Renderer is not fully initialized. Cannot draw point.");return}this.drawPrimitiveType=0,n.use(),this.setShaderVariables(),n.setFloat("u_pointSize",i),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,n.buffers.position),this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(t.vector),this._gl.STATIC_DRAW);let o=this._gl.getAttribLocation(n._shaderProgram,"a_position");this._gl.enableVertexAttribArray(o),this._gl.vertexAttribPointer(o,3,this._gl.FLOAT,!1,0,0),this._gl.drawArrays(this._gl.POINTS,0,1),this._gl.disableVertexAttribArray(o),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,null),n.release()}drawLine(t,i){if(!this._gl||!this.shader||!this.shader.buffers.position){console.warn("Renderer is not fully initialized. Cannot draw line.");return}let n=[...t.vector,...i.vector];this.drawPrimitiveType=1,this.shader.use(),this.setShaderVariables(),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.shader.buffers.position),this._gl.bufferData(this._gl.ARRAY_BUFFER,new Float32Array(n),this._gl.STATIC_DRAW);let o=this._gl.getAttribLocation(this.shader._shaderProgram,"a_position");this._gl.enableVertexAttribArray(o),this._gl.vertexAttribPointer(o,3,this._gl.FLOAT,!1,0,0),this._gl.drawArrays(this._gl.LINES,0,2),this._gl.disableVertexAttribArray(o),this._gl.bindBuffer(this._gl.ARRAY_BUFFER,null),this.shader.release()}draw(){!this.mesh||!this.shader?._shaderProgram||(this.shader.use(),this.shader.bindBuffers(),this._gl.drawElements(this.drawPrimitiveType,this.mesh.meshData.indices.length,this.shader.indexType,0),this.shader.release())}beforeRender(){}worldBounds(t){let i=Va(this.mesh?.meshData);return!i||!this.parent?!1:(Wa(t,i,this.parent.transform.modelMatrix),!0)}get deformationVersion(){return 0}get serializesMesh(){return!0}get jointTexture(){return null}update(t){super.update(t),this._time+=t}setGl(t){this._gl=t}};d(Qi,"RendererBehaviour");var Te=Qi;var en=class en extends Ne{constructor(t,i){super(t,i,oe.frag.default_unlit,oe.vertex.default);this.gl=t;this.material=i;this._className="UnlitShader"}static instanciate(t,i){return new en(t,i)}async loadDataIntoShader(){this.material&&(super.loadDataIntoShader(),await this.checkAndLoadTextures(),this.setVec4("u_matColor",this.material.color.toVec4()),this.setVec2("u_uvScale",this.material.uvScale.vector),this.setVec2("u_uvOffset",this.material.uvOffset.vector),this.material.mainTex&&this.material.mainTex.isImageLoaded&&(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()))}async checkAndLoadTextures(){this.material.mainTex&&(this.material.mainTex.isImageLoaded?(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()):(this.material.mainTex.setGL(this.gl),await this.material.mainTex.load()))}release(){this.material?.mainTex&&this.material.mainTex.unBind()}};d(en,"UnlitShader");var Zi=en;var tn=class tn extends Ne{constructor(t,i){super(t,i,oe.frag.default_lit,oe.vertex.default);this.gl=t;this.material=i;this._className="LitShader";this._emissiveMapUniformLocation=null;this._tangentAttributeLocation=-1;this._bitangentAttributeLocation=-1;this._defaultTextures={}}static instanciate(t,i){return new tn(t,i)}loadDataIntoShader(){this.material&&(this.checkAndLoadTextures(),super.loadDataIntoShader(),this.setVec4("u_matColor",this.material.color.toVec4()),this.setVec2("u_uvScale",this.material.uvScale.vector),this.setVec2("u_uvOffset",this.material.uvOffset.vector),this.setFloat("u_specularStrength",this.material.specularStrength),this.setFloat("u_roughness",Math.max(this.material.roughness,.01)),this.setFloat("u_normalMapStrength",this.material.normalMapStrength),this.setVec3("u_cameraPosition",se.mainCamera.transform.worldPosition))}async checkAndLoadTextures(){let t=d(async(i,n,o,s)=>{let a=i;if((!a||!a.isImageLoaded)&&(a&&!a.isImageLoaded&&(a.setGL(this.gl),a.load()),a=await s(this.gl)),this._shaderProgram&&a){let l=this.gl.getUniformLocation(this._shaderProgram,n);l!==null&&(this.gl.activeTexture(this.gl.TEXTURE0+o),a.glTexture?this.gl.bindTexture(this.gl.TEXTURE_2D,a.glTexture):a.bind(),this.gl.uniform1i(l,o))}return a},"bindMap");this.material.mainTex=await t(this.material.mainTex,"u_mainTex",0,i=>H.for(i).getTexture(Ae.white)),this.material.normalTex=await t(this.material.normalTex,"u_normalMap",1,i=>H.for(i).getTexture(Ae.normal)),this.material.specularTex=await t(this.material.specularTex,"u_specularMap",3,i=>H.for(i).getTexture(Ae.white)),this.material.roughnessTex=await t(this.material.roughnessTex,"u_roughnessMap",4,i=>H.for(i).getTexture(Ae.white)),this.material.aoTex=await t(this.material.aoTex,"u_aoMap",5,i=>H.for(i).getTexture(Ae.white)),this.material.emissiveTex=await t(this.material.emissiveTex,"u_emissiveMap",6,i=>H.for(i).getTexture(Ae.black))}release(){super.release(),this.material.mainTex&&this.material.mainTex.unBind(),this.material.normalTex&&this.material.normalTex.unBind(),this.material.specularTex&&this.material.specularTex.unBind(),this.material.roughnessTex&&this.material.roughnessTex.unBind(),this.material.aoTex&&this.material.aoTex.unBind(),this.material.emissiveTex&&this.material.emissiveTex.unBind()}toJsonObject(){return{...super.toJsonObject(),mainTex:this.material.mainTex?.toJsonObject(),normalTex:this.material.normalTex?.toJsonObject(),specularTex:this.material.specularTex?.toJsonObject(),roughnessTex:this.material.roughnessTex?.toJsonObject(),aoTex:this.material.aoTex?.toJsonObject(),emissiveTex:this.material.emissiveTex?.toJsonObject()}}async fromJson(t){await super.fromJson(t),this.material.fromJson(t.material)}destroy(){super.destroy(),this.material.mainTex&&this.material.mainTex.destroy(),this.material.normalTex&&this.material.normalTex.destroy(),this.material.specularTex&&this.material.specularTex.destroy(),this.material.roughnessTex&&this.material.roughnessTex.destroy(),this.material.aoTex&&this.material.aoTex.destroy(),this.material.emissiveTex&&this.material.emissiveTex.destroy()}};d(tn,"LitShader");var mt=tn;var rn=class rn extends Ne{constructor(){super(...arguments);this._className="SkyboxShader";this.sun={useSun:!1,sunDirection:new Fe(0,.3,-10),sunColor:new y(1,1,1,1),sunSize:.999,sunFalloff:.03};this.moon={useMoon:!1,moonDirection:new Fe(0,-1,0),moonColor:new y(.8,.9,1,1),moonSize:.998,moonFalloff:.002,moonPhase:0,moonEarthshine:.02,moonTerminatorSoftness:.5,moonEnableRotation:1,moonRotationSpeed:.05};this.clouds={useClouds:!1,cloudSpeed:.1,cloudRepetition:0,cloudTiling:.4,cloudSeed:10,cloudSparsity:.01,wheatherCondition:.4};this.stars={useStars:!1,starIntensity:3,starScale:200,starSparsity:34,starSpeed:.004}}static instanciate(t,i){return new rn(t,i)}initialize(){return this.fragUri=oe.frag.skybox,this.vertexUri=oe.vertex.skybox,super.initialize()}async loadDataIntoShader(){this.material&&(this.use(),this.material.mainTex&&(this.material.mainTex.isImageLoaded?(this.setTexture("u_mainTex",this.material.mainTex,0),this.material.mainTex.bind()):(this.material.mainTex.setGL(this.gl),await this.material.mainTex.load())),super.loadDataIntoShader(),this.setVec3("u_sunDirection",this.sun.sunDirection.vector),this.setVec4("u_sunColor",this.sun.sunColor.toVec4()),this.setFloat("u_sunSize",this.sun.sunSize),this.setFloat("u_sunFalloff",this.sun.sunFalloff),this.setInt("u_useSun",this.sun.useSun?1:0),this.setVec3("u_moonDirection",this.moon.moonDirection.vector),this.setVec4("u_moonColor",this.moon.moonColor.toVec4()),this.setFloat("u_moonSize",this.moon.moonSize),this.setFloat("u_moonFalloff",this.moon.moonFalloff),this.setFloat("u_moonPhase",this.moon.moonPhase),this.setFloat("u_moonEarthshine",this.moon.moonEarthshine),this.setFloat("u_moonTerminatorSoftness",this.moon.moonTerminatorSoftness),this.setInt("u_moonEnableRotation",this.moon.moonEnableRotation),this.setFloat("u_moonRotationSpeed",this.moon.moonRotationSpeed),this.setInt("u_useMoon",this.moon.useMoon?1:0),this.setVec4("u_skyColor",this.material.skyColor.toVec4()),this.setVec4("u_horizonColor",this.material.horizonColor.toVec4()),this.setVec4("u_groundColor",this.material.groundColor.toVec4()),this.setFloat("u_exponent",this.material.exponent),this.setInt("u_cloudRepetition",this.clouds.cloudRepetition),this.setFloat("u_cloudSpeed",this.clouds.cloudSpeed),this.setFloat("u_cloudTiling",this.clouds.cloudTiling),this.setFloat("u_cloudSeed",this.clouds.cloudSeed),this.setInt("u_useClouds",this.clouds.useClouds?1:0),this.setFloat("u_weatherCondition",this.clouds.wheatherCondition),this.setFloat("u_cloudSparsity",this.clouds.cloudSparsity),this.setInt("u_useStars",this.stars.useStars?1:0),this.setFloat("u_starIntensity",this.stars.starIntensity),this.setFloat("u_starScale",this.stars.starScale),this.setFloat("u_starSparsity",this.stars.starSparsity),this.setFloat("u_starSpeed",this.stars.starSpeed),this.release())}setTexture(t,i,n){let o=this.gl.getUniformLocation(this._shaderProgram,t);o&&(this.gl.activeTexture(this.gl.TEXTURE0+n),i.bind(),this.gl.uniform1i(o,n))}release(){this.material.mainTex?.unBind()}};d(rn,"SkyboxShader");var Lt=rn;var nn=class nn extends Te{constructor(t){super(t);this._gl=t;this._className="MeshRendererBehaviour";this._normalMapUniformLocation=null;this._specularMapUniformLocation=null;this._roughnessMapUniformLocation=null;this._aoMapUniformLocation=null;this._emissiveMapUniformLocation=null;this._tangentAttributeLocation=-1;this._bitangentAttributeLocation=-1;this._defaultTextures={};this.receiveShadows=!0;this.drawPrimitiveType=4}static instanciate(t){return new nn(t)}get fog(){return this.parent.scene.sceneFog}draw(){if(!this.mesh||!this.shader?._shaderProgram)return;this.shader.use(),this.shader instanceof mt&&(this.shader.setInt("u_receiveShadows",this.receiveShadows?1:0),this.shader.setInt("u_shadowAtlasMap",Ko),this.setShaderVariables());let t=se.mainCamera.viewMatrix;this.shader.setMat4("u_viewMatrix",t),this.shader.setInt("u_fogEnabled",this.fog.enabled?1:0),this.fog.enabled&&(this.shader.setVec3("u_FogColor",this.fog.color.toVec3()),this.shader.setFloat("u_FogDensity",this.fog.density),this.shader.setFloat("u_fogDistance",this.fog.distance),this.shader.setInt("u_fogType",this.fog.fogType),this.shader.setFloat("u_FogHeightFalloff",this.fog.heightFalloff),this.shader.setFloat("u_FogBaseHeight",this.fog.baseHeight)),super.setShaderVariables(),super.draw()}initializeShader(){super.initializeShader(),this.shader&&(this.shader.buffers.normal=this._gl.createBuffer(),this.shader.buffers.tangent=this._gl.createBuffer(),this.shader.buffers.bitangent=this._gl.createBuffer(),this.shader.initBuffers(this._gl,this.mesh.meshData))}setShaderVariables(){this.setNormalMapsInformation()}getNormalMapLocations(){this.shader?._shaderProgram&&(this._normalMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_normalMap"),this._specularMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_specularMap"),this._roughnessMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_roughnessMap"),this._aoMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_aoMap"),this._emissiveMapUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_emissiveMap"),this._worldMatrixUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_worldMatrix"),this._worldInverseTransposeMatrixUniformLocation=this._gl.getUniformLocation(this.shader._shaderProgram,"u_worldInverseTransposeMatrix"),this._tangentAttributeLocation=this._gl.getAttribLocation(this.shader._shaderProgram,"a_tangent"),this._bitangentAttributeLocation=this._gl.getAttribLocation(this.shader._shaderProgram,"a_bitangent"))}getDefaultTexture(t){if(this._defaultTextures[t])return this._defaultTextures[t];let i=this._gl.createTexture();this._gl.bindTexture(this._gl.TEXTURE_2D,i);let n;return t==="white"?n=new Uint8Array([255,255,255,255]):t==="black"?n=new Uint8Array([0,0,0,255]):n=new Uint8Array([128,128,255,255]),this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,1,1,0,this._gl.RGBA,this._gl.UNSIGNED_BYTE,n),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MIN_FILTER,this._gl.NEAREST),this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MAG_FILTER,this._gl.NEAREST),this._defaultTextures[t]=i,i}bindMap(t,i,n,o){if(!i)return;let s;t&&t.glTexture?s=t.glTexture:s=this.getDefaultTexture(o),this._gl.activeTexture(this._gl.TEXTURE0+n),this._gl.bindTexture(this._gl.TEXTURE_2D,s),this._gl.uniform1i(i,n)}setNormalMapsInformation(){if(!this.shader)return;this.getNormalMapLocations();let t=this.shader.material;this.bindMap(t.normalTex,this._normalMapUniformLocation,1,"normal"),this.bindMap(t.specularTex,this._specularMapUniformLocation,3,"white"),this.bindMap(t.roughnessTex,this._roughnessMapUniformLocation,4,"white"),this.bindMap(t.aoTex,this._aoMapUniformLocation,5,"white"),this.bindMap(t.emissiveTex,this._emissiveMapUniformLocation,6,"black")}};d(nn,"MeshRendererBehaviour");var Ye=nn;var Kr=class Kr extends Ye{constructor(t){super(t);this._className="SkinnedMeshRendererBehaviour";this.meshUri="";this.skinUri="";this.boneIds=[];this.bones=[];this.inverseBindMatrices=[];this._jointTexture=null;this.jointData=new Float32Array(0);this.loaded=!1;this.loading=null;this.scratch=E.create();this.meshInverse=E.create();this.jointReach=new Float32Array(0);this._deformationVersion=0;this._serializationIgnoreKeys.push("bones","inverseBindMatrices","_jointTexture","jointData","loaded","loading","scratch","meshInverse","jointReach","_deformationVersion")}static instanciate(t){return new Kr(t)}get jointTexture(){return this.loaded?this._jointTexture:null}get serializesMesh(){return!1}whenLoaded(){return this.loading??Promise.resolve()}initializeShader(){this.shader&&(this.shader.defines.includes("SKINNED")||this.shader.defines.push("SKINNED"),this.shader.initialize(),this.loading=this.load().catch(t=>console.error(`SkinnedMeshRenderer: cannot load ${this.meshUri}`,t)))}async load(){let t=Tt(this.meshUri);if(!t||t.kind!=="mesh")throw new Error(`meshUri "${this.meshUri}" is not <model>#mesh/<n>`);let i=await H.for(this._gl).getModel(t.modelUri),n=i.meshes[t.index];if(!n)throw new Error(`${this.meshUri}: the model has no mesh ${t.index}`);let o=Tt(this.skinUri),s=o?.kind==="skin"?i.skins[o.index]:void 0;this.inverseBindMatrices=s?.inverseBindMatrices??[],this.mesh.meshData=n,this.shader.initBuffers(this._gl,n),this.createJointTexture(Math.max(1,this.inverseBindMatrices.length)),this.jointReach=Kr.jointReach(n,this.inverseBindMatrices),this.loaded=!0,this._deformationVersion++}static jointReach(t,i){let n=new Float32Array(i.length).fill(-1),o=i.map(u=>E.getTranslation(x.create(),E.invert(E.create(),u)??E.create())),{joints:s,weights:a,vertices:l}=t;if(!s?.length||!a?.length)return n;for(let u=0;u<l.length;u++){let c=0;for(let m=1;m<4;m++)a[u*4+m]>a[u*4+c]&&(c=m);let h=s[u*4+c];h===void 0||h>=o.length||(n[h]=Math.max(n[h],x.distance(l[u],o[h])))}return n}worldBounds(t){if(!this.loaded||!this.parent)return!1;(this.bones.length!==this.boneIds.length||this.bones.some(h=>!h))&&this.resolveBones();let i=Eo(this.parent.transform.modelMatrix),n=1/0,o=1/0,s=1/0,a=-1/0,l=-1/0,u=-1/0,c=t.center;for(let h=0;h<this.bones.length;h++){let m=this.bones[h],p=(this.jointReach[h]??-1)*i;!m||p<0||(E.getTranslation(c,m.modelMatrix),n=Math.min(n,c[0]-p),a=Math.max(a,c[0]+p),o=Math.min(o,c[1]-p),l=Math.max(l,c[1]+p),s=Math.min(s,c[2]-p),u=Math.max(u,c[2]+p))}return n>a?!1:(x.set(t.center,(n+a)/2,(o+l)/2,(s+u)/2),t.radius=Math.hypot(a-n,l-o,u-s)/2,!0)}get deformationVersion(){return this._deformationVersion}createJointTexture(t){let i=this._gl;this.jointData=new Float32Array(t*16);for(let n=0;n<t;n++)this.jointData.set(E.create(),n*16);this._jointTexture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this._jointTexture),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,4,t,0,i.RGBA,i.FLOAT,this.jointData),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.bindTexture(i.TEXTURE_2D,null)}resolveBones(){let t=this.parent?.scene;t&&(this.bones=this.boneIds.map(i=>t.getEntitieByUuid(i)?.transform??null))}beforeRender(){if(!this.loaded||!this._jointTexture)return;(this.bones.length!==this.boneIds.length||this.bones.some(s=>!s))&&this.resolveBones();let t=this.parent.transform;for(;t.parent;)t=t.parent;t.updateMatrices(),E.invert(this.meshInverse,this.parent.transform.modelMatrix);let i=Math.min(this.inverseBindMatrices.length,this.jointData.length/16),n=!1;for(let s=0;s<i;s++){let a=this.bones[s];if(!a)continue;E.multiply(this.scratch,this.meshInverse,a.modelMatrix),E.multiply(this.scratch,this.scratch,this.inverseBindMatrices[s]);let l=s*16;if(!n){for(let u=0;u<16;u++)if(this.jointData[l+u]!==this.scratch[u]){n=!0;break}}this.jointData.set(this.scratch,l)}if(!n)return;this._deformationVersion++;let o=this._gl;o.bindTexture(o.TEXTURE_2D,this._jointTexture),o.texSubImage2D(o.TEXTURE_2D,0,0,0,4,this.jointData.length/16,o.RGBA,o.FLOAT,this.jointData),o.bindTexture(o.TEXTURE_2D,null)}draw(){if(!this.loaded||!this.shader?._shaderProgram)return;let t=this._gl;this.shader.use(),t.activeTexture(t.TEXTURE0+Yr),t.bindTexture(t.TEXTURE_2D,this._jointTexture);let i=t.getUniformLocation(this.shader._shaderProgram,"u_jointTexture");t.uniform1i(i,Yr),t.activeTexture(t.TEXTURE0),super.draw(),yr.disableSkinAttributes(t,this.shader._shaderProgram)}destroy(){super.destroy(),this._jointTexture&&this._gl.deleteTexture(this._jointTexture),this._jointTexture=null,this.loaded=!1}toJsonObject(){let{mesh:t,...i}=super.toJsonObject();return{...i,meshUri:this.meshUri,skinUri:this.skinUri,boneIds:[...this.boneIds]}}fromJson(t){super.fromJson(t),this.meshUri=t.meshUri??"",this.skinUri=t.skinUri??"",this.boneIds=[...t.boneIds??[]]}};d(Kr,"SkinnedMeshRendererBehaviour");var Qr=Kr;var on=class on extends q{constructor(){super("ColorMaterial");this.color=new y}get type(){return this.constructor.name}static instanciate(){return new on}toJsonObject(){return{...super.toJsonObject(),name:this.name,color:this.color.toJsonObject()}}fromJson(t){super.fromJson(t),this.name=t.name,this.color=y.createFromJsonData(t.color)}};d(on,"ColorMaterial");var Xt=on;var sn=class sn extends Xt{constructor(){super(...arguments);this._className="UnlitMaterial";this.uvScale=new pr(1,1);this.uvOffset=new pr(0,0)}toJsonObject(){return{...super.toJsonObject(),mainTex:this.mainTex?.toJsonObject(),uvScale:[...this.uvScale.vector],uvOffset:[...this.uvOffset.vector]}}async fromJson(t){super.fromJson(t),t.mainTex?.url&&(this.mainTex=await H.for().getTexture(t.mainTex.url)),t.uvScale&&this.uvScale.set(...t.uvScale),t.uvOffset&&this.uvOffset.set(...t.uvOffset)}static instanciate(){return new sn}destroy(){this.mainTex&&this.mainTex.destroy()}};d(sn,"UnlitMaterial");var Mr=sn;var an=class an extends Mr{constructor(){super();this._className="LitMaterial";this.specularStrength=.5;this.roughness=.01;this.normalMapStrength=.1}toJsonObject(){return{...super.toJsonObject(),normalTex:this.normalTex?.toJsonObject(),specularStrength:this.specularStrength,roughness:this.roughness,normalMapStrength:this.normalMapStrength}}async fromJson(t){await super.fromJson(t),t.normalTex?.url&&(this.normalTex=await H.for().getTexture(t.normalTex.url),this.normalTex.fromJson(t.normalTex)),this.roughness=t.roughness,this.normalMapStrength=t.normalMapStrength}static instanciate(){return new an}destroy(){super.destroy(),this.normalTex&&this.normalTex.destroy()}};d(an,"LitMaterial");var Kt=an;var ln=class ln extends Xt{constructor(){super(...arguments);this._className="CubemapMaterial"}async fromJson(t){if(super.fromJson(t),t.mainTex?.uris){let i=t.mainTex.uris;this.mainTex=await H.for().getCubemap({right:i[0],left:i[1],up:i[2],bottom:i[3],front:i[4],back:i[5]})}}toJsonObject(){return{...super.toJsonObject(),mainTex:this.mainTex?.toJsonObject()}}static instanciate(){return new ln}};d(ln,"CubemapMaterial");var Tr=ln;var ss=class ss extends Tr{constructor(){super(...arguments);this._className="SkyboxMaterial";this.skyColor=new y(.35,.53,.7,1);this.horizonColor=new y(.7,.75,.8,1);this.groundColor=new y(.2,.2,.2,1);this.exponent=.6}toJsonObject(){return{...super.toJsonObject(),horizonColor:this.horizonColor.toJsonObject(),skyColor:this.skyColor.toJsonObject(),groundColor:this.groundColor.toJsonObject(),exponent:this.exponent}}async fromJson(t){await super.fromJson(t),this.horizonColor=y.createFromJsonData(t.horizonColor),this.skyColor=y.createFromJsonData(t.skyColor),this.groundColor=y.createFromJsonData(t.groundColor),this.exponent=t.exponent||this.exponent}};d(ss,"SkyboxMaterial");var Sr=ss;var cn=class cn extends Z{static instanciate(r,t,i,n){return new cn}constructor(r=2){let t=r/2,i=[],n=[],o=[],s=[],a=d((l,u,c,h,m,p,v,f,g,b)=>{i.push(l,u,c,h),n.push(m,m,m,m),o.push(p,v,f,g),s.push(b+0,b+1,b+2,b+0,b+2,b+3)},"addFace");a([-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t],[0,0,1],[0,0],[1,0],[1,1],[0,1],0),a([-t,t,-t],[t,t,-t],[t,-t,-t],[-t,-t,-t],[0,0,-1],[0,1],[0,0],[1,0],[1,1],4),a([-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t],[0,1,0],[0,1],[1,1],[1,0],[0,0],8),a([-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t],[0,-1,0],[0,1],[1,1],[1,0],[0,0],12),a([t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t],[1,0,0],[0,0],[1,0],[1,1],[0,1],16),a([-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t],[-1,0,0],[0,0],[1,0],[1,1],[0,1],20),super(i,n,o,s)}};d(cn,"CubePrimitive");var be=cn;var as=class as extends Z{constructor(r=2){let t=r/2,i=[],n=[],o=[],s=[];d((l,u,c,h,m,p,v,f,g,b)=>{i.push(l,u,c,h),n.push(m,m,m,m),o.push(p,v,f,g),s.push(b+0,b+1,b+2,b+0,b+2,b+3)},"addFace")([-t,-t,0],[t,-t,0],[t,t,0],[-t,t,0],[0,0,1],[0,0],[1,0],[1,1],[0,1],0),super(i,n,o,s)}};d(as,"QuadPrimitive");var un=as;var hn=class hn extends be{static instanciate(r,t,i,n){return new hn}constructor(r=2){super(r)}};d(hn,"SkyboxPrimitive");var dn=hn;var ls=class ls extends Z{constructor(r=1,t=32,i=16){let n=[],o=[],s=[],a=[];for(let l=0;l<=i;++l){let u=l/i,c=u*Math.PI;for(let h=0;h<=t;++h){let m=h/t,p=m*2*Math.PI,v=r*Math.sin(c)*Math.cos(p),f=r*Math.cos(c),g=r*Math.sin(c)*Math.sin(p);n.push([v,f,g]);let b=x.fromValues(v,f,g);x.normalize(b,b),o.push(Array.from(b)),s.push([m,u])}}for(let l=0;l<i;++l)for(let u=0;u<t;++u){let c=l*(t+1)+u,h=c+t+1;a.push(c,c+1,h),a.push(c+1,h+1,h)}super(n,o,s,a)}};d(ls,"SpherePrimitive");var $e=ls;var cs=class cs extends Z{constructor(){let r=[[0,1,0],[-1,-1,0],[1,-1,0]],t=[[0,0,1],[0,0,1],[0,0,1]],i=[[.5,1],[0,0],[1,0]],n=[0,1,2];super(r,t,i,n)}};d(cs,"TrianglePrimitive");var mn=cs;var fn=class fn extends Z{static instanciate(r,t,i,n){return new fn}constructor(r=1){r=Math.max(1,Math.floor(r));let i=r/2,n=1,o=[],s=[],a=[],l=[];for(let u=0;u<=r;u++)for(let c=0;c<=r;c++){let h=-i+c*n,m=-i+u*n;o.push(x.fromValues(h,0,m)),s.push(x.fromValues(0,1,0)),a.push(he.fromValues(c/r,u/r))}for(let u=0;u<r;u++)for(let c=0;c<r;c++){let h=u*(r+1)+c;l.push(h,h+(r+1),h+(r+1)+1),l.push(h,h+(r+1)+1,h+1)}super(o,s,a,l)}};d(fn,"PlanePrimitive");var pn=fn;var vn=class vn extends Ye{static instanciate(r){return new vn(r)}constructor(r){super(r),this._className="SkyboxRenderer",this.createDefaultSkybox()}async createDefaultSkybox(){this.mesh.meshData=new be;let r=new Sr;this.shader=new Lt(this._gl,r),this.renderLayer=5,r.mainTex=await H.for(this._gl).getWhiteCubemap()}initialize(){return this.transform&&(this.transform.setLocalPosition(0,0,0),this.transform.setLocalScale(1e3,1e3,1e3)),super.initialize()}get material(){return this.shader?.material}setGlSettings(){this._gl.cullFace(this._gl.FRONT),this._gl.depthFunc(this._gl.LEQUAL)}setCameraMatrices(){if(!this.shader?._shaderProgram)return;let r=se.mainCamera,t=E.clone(r.viewMatrix);t[12]=0,t[13]=0,t[14]=0;let i=E.create();this.transform.updateMatrices(),E.multiply(i,r.projectionMatrix,t),E.multiply(i,i,this.parent.transform.modelMatrix),this.shader.setMat4("u_mvpMatrix",i)}draw(){this.shader?._shaderProgram&&(this.setGlSettings(),this.setCameraMatrices(),this.setShaderVariables(),super.draw(),this.shader?.release())}setShaderVariables(){this.shader?._shaderProgram&&(super.setShaderVariables(),this.setGlSettings(),this.setCameraMatrices())}};d(vn,"SkyboxRenderer");var tt=vn;var Zr=class Zr extends fe{constructor(){super();this.moveSpeed=20;this.rotationSpeed=5;this.rotationDampening=.2;this.moveDampening=.15;this.scrollSpeed=1;this.boostMultiplier=4;this.moveKeys={forward:"w",back:"s",left:"a",right:"d",up:"q",down:"e",boost:"shift"};this.lookMouseButtons={pan:1,look:2};this._acceleration=4;this._forwardVelocity=0;this._strafeVelocity=0;this._upVelocity=0;this._currentYaw=0;this._currentPitch=0;this._className="CameraFlyBehaviour"}static instanciate(){return new Zr}initialize(){let t=this.transform.forward,i=180/Math.PI;return this._currentPitch=Math.asin(Math.max(-1,Math.min(1,-t[1])))*i,this._currentYaw=Math.atan2(t[0],t[2])*i,super.initialize()}update(t){this.updateInput(t)}updateMoveVelocity(t){let i=this._acceleration*t,n=pe.keyDown[this.moveKeys.boost]?this.moveSpeed*this.boostMultiplier:this.moveSpeed,o=.1;this.updateForwardVelocity(i,n,o),this.updateStrafeVelocity(i,n,o),this.updateUpVelocity(i,n,o)}updateForwardVelocity(t,i,n){pe.keyDown[this.moveKeys.forward]?this._forwardVelocity=Math.min(this._forwardVelocity+t,i):pe.keyDown[this.moveKeys.back]?this._forwardVelocity=Math.max(this._forwardVelocity-t,-i):(this._forwardVelocity*=1-this.moveDampening,Math.abs(this._forwardVelocity)<n&&(this._forwardVelocity=0))}updateStrafeVelocity(t,i,n){pe.keyDown[this.moveKeys.left]?this._strafeVelocity=Math.min(this._strafeVelocity+t,i):pe.keyDown[this.moveKeys.right]?this._strafeVelocity=Math.max(this._strafeVelocity-t,-i):(this._strafeVelocity*=1-this.moveDampening,Math.abs(this._strafeVelocity)<n&&(this._strafeVelocity=0))}updateUpVelocity(t,i,n){pe.keyDown[this.moveKeys.up]?this._upVelocity=Math.max(this._upVelocity-t,-i):pe.keyDown[this.moveKeys.down]?this._upVelocity=Math.min(this._upVelocity+t,i):(this._upVelocity*=1-this.moveDampening,Math.abs(this._upVelocity)<n&&(this._upVelocity=0))}updatePanVelocity(t){ne.mouseButtonDown[this.lookMouseButtons.pan]&&(this._upVelocity+=ne.mouseMovement.y*this.moveSpeed*t/2,this._strafeVelocity+=ne.mouseMovement.x*this.moveSpeed*t/2)}updateScrollVelocity(t){this._forwardVelocity-=ne.wheelY*this._acceleration*this.moveDampening*this.scrollSpeed*t}applyMovementVelocity(t,i){let n=x.create();if(this.parent instanceof se&&this.parent.cameraType===1){let s=this.parent;Math.abs(this._forwardVelocity)>0&&(s.orthoSize-=this._forwardVelocity*i,s.orthoSize=Math.max(.1,s.orthoSize),s.updateProjectionMatrix());let a=s.orthoSize/10;Math.abs(this._strafeVelocity)>0&&x.scaleAndAdd(n,n,t.right,this._strafeVelocity*a),Math.abs(this._upVelocity)>0&&x.scaleAndAdd(n,n,t.up,this._upVelocity*a)}else Math.abs(this._forwardVelocity)>0&&x.scaleAndAdd(n,n,t.forward,this._forwardVelocity),Math.abs(this._strafeVelocity)>0&&x.scaleAndAdd(n,n,t.right,this._strafeVelocity),Math.abs(this._upVelocity)>0&&x.scaleAndAdd(n,n,t.up,this._upVelocity);t.translate(n[0]*i,n[1]*i,n[2]*i)}applyRotationVelocity(t,i){ne.mouseButtonDown[this.lookMouseButtons.look]&&(!1||(this._currentYaw+=-ne.mouseMovement.x*this.rotationSpeed*i,this._currentPitch+=ne.mouseMovement.y*this.rotationSpeed*i)),this._currentPitch=Math.max(-90,Math.min(90,this._currentPitch));let o=B.create();B.fromEuler(o,0,this._currentYaw,0);let s=B.create();B.fromEuler(s,this._currentPitch,0,0);let a=B.create();B.multiply(a,o,s);let l=B.create();B.slerp(l,t.localRotationQuat,a,this.rotationDampening),t.worldRotationQuat=l}updateInput(t){if(!this._initialized||!this.parent?.transform)return;let i=this.parent.transform;this.updateMoveVelocity(t),this.updateScrollVelocity(t),this.updatePanVelocity(t),this.applyMovementVelocity(i,t),this.applyRotationVelocity(i,t)}clone(){let t=new Zr;return t.fromJson(this.toJsonObject()),t}};d(Zr,"CameraFlyBehaviour");var gn=Zr;var Qt=d(e=>{let r=Math.max(0,Math.min(1,e));return r*r*(3-2*r)},"smoothstep"),xn=class xn extends fe{constructor(){super(...arguments);this._className="SunBehaviour";this.dayCycleSettings={speed:new K(0,0,100,1),timeOfDay:new K(11,0,24.01,.5)};this.hours={sunrise:6,noon:12,sunset:18.5,night:20};this.lighColor={sunriseColor:new y(255/255,190/255,120/255,1),noonColor:new y(255/255,250/255,245/255,1),sunsetColor:new y(255/255,150/255,80/255,1),nightColor:new y(30/255,40/255,60/255,1)};this.dayPhaseColors={sunriseSkyColor:new y(.43,.47,.57,1),sunriseHorizonColor:new y(.34,.35,.35,1),noonSkyColor:new y(.53,.81,.92,1),noonHorizonColor:new y(.86,.92,.98,1),sunsetSkyColor:new y(.19,.21,.34,1),sunsetHorizonColor:new y(.32,.29,.28,1),nightSkyColor:new y(.04,.06,.12,1),nightHorizonColor:new y(.08,.12,.2,1)};this.sun={show:!0,sunHeight:new K(.725,0,.9,.015),sunSize:new K(.999,.8,1.04,1e-8),sunFalloff:new K(.01,1e-5,.2,1e-6)};this.moon={show:!0,phaseSpeed:5e-4,color:new y(.85,.9,.95,1),phase:new K(0,0,1.01,.01),useDirectionalLight:!1,earthshine:new K(.02,0,.4,.001),terminatorSoftness:new K(.5,.01,1,.01),enableRotation:!0,rotationSpeed:new K(.05,0,.5,.001)};this.shadows={nightStrength:new K(.2,0,1,.01),dayStrength:new K(.75,0,1,.01),fadeDuration:new K(1.2,0,2,.1)};this.clouds={show:!0,speed:new K(.01,.001,.5,1e-6),tiling:new K(.05,1e-4,2,1e-6),sparsity:new K(.01,0,1,1e-6),weather:new K(.4,0,1,1e-6),repetition:new K(1,0,10,1)};this.stars={show:!0,intensity:new K(3,0,20,.1),scale:new K(200,10,500,1),sparsity:new K(34,10,100,1),speed:new K(4e-4,0,.02,1e-4)}}static instanciate(){return new xn}initialize(){return this.parent?.scene?(this._serializationIgnoreKeys.push("moonLight"),this._skyboxRenderer=this.parent.getBehaviour(tt),this._skyboxRenderer||(this._skyboxRenderer=this.parent.scene?.objects.find(t=>t.getBehaviour(tt))?.getBehaviour(tt)),this.update(0),super.initialize()):!1}update(t){if(!this.parent?.scene)return;super.update(t),this.updateTime(t);let i=this.parent.scene.lights.find(n=>n.entityType===1);i&&(this.updateOrCreateMoonLinght(),this.updateSunPosition(i,this.moonLight),this.updateLightColor(i,this.moonLight))}creaMoonLight(t){return t=new Ct("MoonLight"),t.tag="MoonLight",t.transform.setParent(this.transform),this.parent.scene.addEntity(t),this.moonLight=t,t}updateOrCreateMoonLinght(){if(this.moonLight=this.moonLight||this.parent.scene.lights.find(t=>t.tag==="MoonLight"),this.moon.useDirectionalLight){if(!this.parent.scene.isRunning)return;this.moonLight||(this.moonLight=this.creaMoonLight(this.moonLight)),this.moonLight.active=!0,this.moonLight.color=this.lighColor.nightColor}else this.moonLight&&(this.moonLight.active=!1)}updateTime(t){this.parent?.scene?.isRunning&&(this.dayCycleSettings.timeOfDay.value+=t*this.dayCycleSettings.speed.value*.01,this.dayCycleSettings.timeOfDay.value>=24&&(this.dayCycleSettings.timeOfDay.value-=24),this.dayCycleSettings.timeOfDay.value<0&&(this.dayCycleSettings.timeOfDay.value+=24)),this.moon.show&&(this.moon.phase.value+=t*this.moon.phaseSpeed*.01,this.moon.phase.value>1&&(this.moon.phase.value-=1),this.moon.phase.value<0&&(this.moon.phase.value+=1))}updateSunPosition(t,i){if(!t)return;let n=1,o=Math.acos(this.sun.sunHeight.value),s=(this.dayCycleSettings.timeOfDay.value/24-.25)*Math.PI*2,a=Math.cos(s)*n,l=Math.sin(s)*n,u=a,c=l*Math.cos(o),h=-l*Math.sin(o);t.transform.setWorldPosition(u,c,h),t.transform.lookAt(new Fe(0,0,0)),i&&(i.transform.setWorldPosition(-u,-c,-h),i.transform.lookAt(new Fe(0,0,0)))}getInterpolationData(){let t=this.dayCycleSettings.timeOfDay.value,{sunrise:i,noon:n,sunset:o,night:s}=this.hours,{sunriseColor:a,noonColor:l,sunsetColor:u,nightColor:c}=this.lighColor,{sunriseSkyColor:h,sunriseHorizonColor:m,noonSkyColor:p,noonHorizonColor:v,sunsetSkyColor:f,sunsetHorizonColor:g,nightSkyColor:b,nightHorizonColor:M}=this.dayPhaseColors;if(t>=i&&t<n)return{fromLightColor:a,toLightColor:l,fromSkyColor:h,toSkyColor:p,fromHorizonColor:m,toHorizonColor:v,delta:(t-i)/(n-i)};if(t>=n&&t<o)return{fromLightColor:l,toLightColor:u,fromSkyColor:p,toSkyColor:f,fromHorizonColor:v,toHorizonColor:g,delta:(t-n)/(o-n)};if(t>=o&&t<s)return{fromLightColor:u,toLightColor:c,fromSkyColor:f,toSkyColor:b,fromHorizonColor:g,toHorizonColor:M,delta:(t-o)/(s-o)};{let _=24-s+i,w=t>=s?t-s:24-s+t;return{fromLightColor:c,toLightColor:a,fromSkyColor:b,toSkyColor:h,fromHorizonColor:M,toHorizonColor:m,delta:w/_}}}updateLightColor(t,i){if(!t)return;let n=this.dayCycleSettings.timeOfDay.value,{sunrise:o,sunset:s,night:a}=this.hours,{fromLightColor:l,toLightColor:u,fromSkyColor:c,toSkyColor:h,fromHorizonColor:m,toHorizonColor:p,delta:v}=this.getInterpolationData(),f=Math.max(0,Math.min(1,v));t.color=y.lerp(l,u,f);let g=.5,b=1;if(n>=s-g&&n<=s){let _=(n-(s-g))/g;b=1-Qt(_)}else if(n>=o-g&&n<=o){let _=(n-(o-g))/g;b=Qt(_)}else(n>s||n<o-g)&&(b=.1);if(i){i.color=this.lighColor.nightColor.clone();let _=Qt(f);n>=o&&n<s?(t.color.a=b,i.color.a=.05):n>=s&&n<a-g?(t.color.a=b,i.color.a=_*this.lighColor.nightColor.a):(t.color.a=b,i.color.a=(1-_)*this.lighColor.nightColor.a)}else t.color.a=b;t.shadowStrength=this._calculateShadowStrength(n,this.shadows.dayStrength.value),this.updateSceneColors(t.color),n>this.hours.night-.5&&n<this.hours.night;let M=n<this.hours.sunrise||n>this.hours.sunset;this.updateSkybox(t,c,h,m,p,f,M)}_calculateShadowStrength(t,i){let n=0,o=i,s=this.shadows.nightStrength.value,a=this.shadows.fadeDuration.value,l=this.hours.sunset-a,u=this.hours.sunset+a,c=this.hours.sunrise-a,h=this.hours.sunrise+a;if(t>=h&&t<l)n=o;else if(t>=l&&t<this.hours.sunset){let m=(t-l)/(this.hours.sunset-l);n=(1-Qt(m))*o}else if(t>=this.hours.sunset&&t<u){let m=(t-this.hours.sunset)/(u-this.hours.sunset);n=Qt(m)*s}else if(t>=c&&t<this.hours.sunrise){let m=(t-c)/(this.hours.sunrise-c);n=(1-Qt(m))*s}else if(t>=this.hours.sunrise&&t<h){let m=(t-this.hours.sunrise)/(h-this.hours.sunrise);n=Qt(m)*o}else n=s;return Math.max(0,n)}updateSceneColors(t){let i=this.parent.scene;i&&(i.clearColor=t,i.sceneFog.color=t)}updateSkybox(t,i,n,o,s,a,l){let u=this.parent.scene;!u||!t||(this._skyboxRenderer||(this._skyboxRenderer=u.objects.find(c=>c.getBehaviour(tt))?.getBehaviour(tt)),this._skyboxRenderer?.shader instanceof Lt&&this._updateSkyboxShaderVariables(this._skyboxRenderer,t,i,n,o,s,a,l))}_updateSkyboxShaderVariables(t,i,n,o,s,a,l,u){let c=t.shader;c.material.color=y.lerp(n,o,l),c.material.horizonColor=y.lerp(s,a,l),this.parent.scene.sceneFog.color=c.material.horizonColor,c.sun.useSun=this.sun.show,c.moon.useMoon=this.moon.show,c.sun.sunSize=this.sun.sunSize.value,c.sun.sunFalloff=this.sun.sunFalloff.value;let h=x.normalize(x.create(),this.transform.worldPosition);c.sun.sunDirection.set(h[0],h[1],h[2]),c.sun.sunColor=i.color,this.moon.show&&(c.moon.moonDirection.set(-h[0],-h[1],-h[2]),c.moon.moonPhase=this.moon.phase.value,c.moon.moonColor=y.lerp(this.moon.color,i.color,.4),c.moon.moonEarthshine=this.moon.earthshine.value,c.moon.moonTerminatorSoftness=this.moon.terminatorSoftness.value,c.moon.moonEnableRotation=this.moon.enableRotation?1:0,c.moon.moonRotationSpeed=this.moon.rotationSpeed.value),c.clouds.useClouds=this.clouds.show,this.clouds.show&&(c.clouds.cloudSpeed=this.clouds.speed.value,c.clouds.cloudTiling=this.clouds.tiling.value,c.clouds.cloudSparsity=this.clouds.sparsity.value,c.clouds.cloudRepetition=this.clouds.repetition.value,c.clouds.wheatherCondition=this.clouds.weather.value),c.stars.useStars=this.stars.show,this.stars.show&&(c.stars.starIntensity=this.stars.intensity.value,c.stars.starScale=this.stars.scale.value,c.stars.starSparsity=this.stars.sparsity.value,c.stars.starSpeed=this.stars.speed.value)}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(xn,"SunBehaviour");var bn=xn;var _n=class _n extends fe{constructor(){super(...arguments);this._className="RotateBehaviour";this.rotationAngle=new Fe(0,1,0);this.speed=.005}static instanciate(){return new _n}update(t){let i=this.speed*t;this.transform.rotate(this.rotationAngle.x*i,this.rotationAngle.y*i,this.rotationAngle.z*i)}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(_n,"RotateBehaviour");var yn=_n;var us=class us{constructor(r,t){this.onPointerDown=d(r=>{this.canvas.setPointerCapture?.(r.pointerId),jt._down(r.pointerId,r.pointerType,...this.pointerXY(r),r.timeStamp)},"onPointerDown");this.onPointerMove=d(r=>{if(!jt.active.has(r.pointerId))return;let t=r.getCoalescedEvents?.()??[];for(let i of t.length?t:[r])jt._move(r.pointerId,...this.pointerXY(i),i.timeStamp)},"onPointerMove");this.onPointerUp=d(r=>{jt._up(r.pointerId,...this.pointerXY(r),r.timeStamp)},"onPointerUp");this.onEngineContextMenu=d(r=>{r.preventDefault()},"onEngineContextMenu");this.onEngineKeyDown=d(r=>{pe.keyDown[r.key.toLowerCase()]=!0},"onEngineKeyDown");this.onEngineKeyUp=d(r=>{pe.keyDown[r.key.toLowerCase()]&&(pe.keyUp[r.key.toLowerCase()]=!0,pe.keyPress[r.key.toLowerCase()]=!0),pe.keyDown[r.key.toLowerCase()]=!1},"onEngineKeyUp");this.onEngineMouseMove=d(r=>{let t=this.canvas.getBoundingClientRect();ne.mousePosition.x=Math.max(r.clientX-t.x,0),ne.mousePosition.y=Math.max(r.clientY-t.y,0),ne.mouseMovement.x=r.movementX,ne.mouseMovement.y=r.movementY},"onEngineMouseMove");this.onEngineMouseDown=d(r=>{this.engine.isFocused&&r.preventDefault(),ne.mouseButtonDown[r.button]=!0},"onEngineMouseDown");this.onEngineMouseUp=d(r=>{ne.mouseButtonDown[r.button]=!1},"onEngineMouseUp");this.onEngineMouseLeave=d(()=>{for(let r in ne.mouseButtonDown)ne.mouseButtonDown[r]&&(ne.mouseButtonDown[r]=!1)},"onEngineMouseLeave");this.onEngineFocus=d(()=>{this.engine.isFocused=!0},"onEngineFocus");this.onEngineBlur=d(()=>{this.engine.isFocused=!1},"onEngineBlur");this.onEngineMouseScroll=d(r=>{this.engine.isFocused&&(ne.wheelY=r.deltaY,ne.wheelX=r.deltaX)},"onEngineMouseScroll");this.onEngineVisibilityChange=d(()=>{this.engine.isTabActive=!document.hidden},"onEngineVisibilityChange");this.onEngineWindowFocus=d(()=>{this.engine.isWindowFocused=!0},"onEngineWindowFocus");this.onEngineWindowBlur=d(()=>{this.engine.isWindowFocused=!1},"onEngineWindowBlur");this.engine=r,this.canvas=t}initialize(){this.canvas.tabIndex=0,this.canvas.addEventListener("contextmenu",this.onEngineContextMenu),this.canvas.addEventListener("keydown",this.onEngineKeyDown),this.canvas.addEventListener("keyup",this.onEngineKeyUp),this.canvas.addEventListener("mousemove",this.onEngineMouseMove),this.canvas.addEventListener("mousedown",this.onEngineMouseDown),this.canvas.addEventListener("mouseup",this.onEngineMouseUp),this.canvas.addEventListener("mouseleave",this.onEngineMouseLeave),this.canvas.addEventListener("focus",this.onEngineFocus),this.canvas.addEventListener("blur",this.onEngineBlur),this.canvas.addEventListener("wheel",this.onEngineMouseScroll),this.canvas.style.touchAction="none",this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerUp),document.addEventListener("visibilitychange",this.onEngineVisibilityChange),window.addEventListener("focus",this.onEngineWindowFocus),window.addEventListener("blur",this.onEngineWindowBlur)}pointerXY(r){let t=this.canvas.getBoundingClientRect();return[r.clientX-t.left,r.clientY-t.top]}update(){ne.mouseMovement.x=0,ne.mouseMovement.y=0,ne.wheelX=0,ne.wheelY=0,pe.keyUp={},pe.keyPress={},Si.update()}};d(us,"EngineEventManager");var wn=us;function vl(e){let r=e.interpolation==="CUBICSPLINE"?3:0;return e.values.subarray(r,r+3)}d(vl,"firstKey");function ds(e){return e.replace(/:/g,"_")}d(ds,"boneAlias");var hs=class hs{constructor(){this.listeners=[]}subscribe(r){return this.listeners.push(r),()=>{this.listeners=this.listeners.filter(t=>t!==r)}}emit(r){for(let t of[...this.listeners])t(r)}};d(hs,"AnimationEvent");var Mn=hs,Tn=class Tn extends fe{constructor(){super();this._className="Animator";this.clipUris=[];this.defaultClip="";this.playOnStart=!0;this.speed=1;this.loop=!0;this.playInEditor=!1;this.inPlace=!1;this.onFinished=new Mn;this.onLoop=new Mn;this.clips=[];this.codeClips=[];this.current=null;this.previous=null;this.fadeDuration=0;this.fadeTime=0;this.bonesByName=new Map;this.loading=null;this.value=new Float32Array(4);this.blendA=new Float32Array(4);this.q1=B.create();this.q2=B.create();this._serializationIgnoreKeys.push("onFinished","onLoop","clips","codeClips","current","previous","fadeDuration","fadeTime","bonesByName","loading","value","blendA","q1","q2")}static instanciate(){return new Tn}get clipList(){return this.clips}get currentClip(){return this.current?.clip??null}get time(){return this.current?.time??0}set time(t){this.current&&(this.current.time=t,this.current.finished=!1,this.apply())}whenLoaded(){return this.loading??Promise.resolve()}initialize(){let t=super.initialize();return this.playInEditor&&this.parent&&(this.parent.updateInEditor=!0),this.loading=this.loadClips().catch(i=>console.error("Animator: cannot load clips",i)),t}async loadClips(){let t=[];for(let i of this.clipUris){let n=Tt(i);if(n?.kind!=="anim"){console.warn(`Animator: "${i}" is not <model>#anim/<n>`);continue}let s=(await H.for().getModel(n.modelUri)).clips[n.index];s&&t.push(s)}this.clips=[...t,...this.codeClips],this.playOnStart&&t.length&&!this.current&&this.play(this.defaultClip||t[0].name)}addClip(t){this.codeClips.push(t),this.clips.push(t)}getClip(t){return typeof t=="number"?this.clips[t]:this.clips.find(i=>i.name===t)}play(t,i={}){let n=this.getClip(t);return n?(this.current=this.stateFor(n,i.loop??this.loop),this.previous=null,this.fadeDuration=0,this.apply(),!0):(console.warn(`Animator: no clip "${t}"`),!1)}crossFade(t,i=.25,n={}){let o=this.getClip(t);return o?!this.current||i<=0?this.play(t,n):(this.current.clip===o&&!this.previous||(this.previous=this.current,this.current=this.stateFor(o,n.loop??this.loop),this.fadeDuration=i,this.fadeTime=0),!0):(console.warn(`Animator: no clip "${t}"`),!1)}stop(){this.current=null,this.previous=null}isPlaying(t){return!this.current||this.current.finished?!1:!t||this.current.clip.name===t}update(t){!this.parent?.scene?.isRunning&&!this.playInEditor||this.advance(t)}advance(t){if(this.current){for(let i of[this.current,this.previous])i&&this.step(i,t*this.speed);if(this.previous){this.fadeTime+=Math.abs(t*this.speed);let i=Math.min(1,this.fadeTime/this.fadeDuration);this.current.weight=i,i>=1&&(this.previous=null)}this.apply()}}step(t,i){if(t.finished)return;let n=t.clip.duration;t.time+=i,!(n<=0)&&(t.loop?(t.time>=n||t.time<0)&&(t.time=(t.time%n+n)%n,t===this.current&&this.onLoop.emit(t.clip)):(t.time>=n||t.time<=0)&&(t.time=Math.min(Math.max(t.time,0),n),t.finished=!0,t===this.current&&this.onFinished.emit(t.clip)))}stateFor(t,i){this.bonesByName.size||this.collectBones();let n=t.channels.map(a=>this.bonesByName.get(a.target)??this.bonesByName.get(ds(a.target))??null);n.some(a=>!a)&&(this.collectBones(),n=t.channels.map(a=>this.bonesByName.get(a.target)??this.bonesByName.get(ds(a.target))??null));let o=d(a=>{let l=0;for(let u=a;u&&u!==this.parent?.transform;u=u.parent)l++;return a?l:1/0},"depth"),s=-1;return t.channels.forEach((a,l)=>{a.property==="translation"&&n[l]&&(s<0||o(n[l])<o(n[s]))&&(s=l)}),{clip:t,time:this.speed<0?t.duration:0,weight:1,hints:t.channels.map(()=>0),targets:n,loop:i,finished:!1,rootChannel:s}}collectBones(){this.bonesByName.clear();let t=d(i=>{let n=i.parentEntity;n&&!this.bonesByName.has(n.name)&&this.bonesByName.set(n.name,i);let o=n?ds(n.name):"";n&&!this.bonesByName.has(o)&&this.bonesByName.set(o,i);for(let s of i.children)t(s)},"visit");this.parent&&t(this.parent.transform)}apply(){let t=this.current;if(!t)return;let i=this.previous,n=new Map;i&&t.weight<1&&i.clip.channels.forEach((o,s)=>{let a=i.targets[s];if(!a)return;if(i.hints[s]=Uo(o,i.time,this.blendA,i.hints[s]),this.inPlace&&s===i.rootChannel){let u=vl(o);this.blendA[0]=u[0],this.blendA[2]=u[2]}let l=n.get(a);l||n.set(a,l=new Map),l.set(o.property,Float32Array.from(this.blendA))}),t.clip.channels.forEach((o,s)=>{let a=t.targets[s];if(!a)return;if(t.hints[s]=Uo(o,t.time,this.value,t.hints[s]),this.inPlace&&s===t.rootChannel){let u=vl(o);this.value[0]=u[0],this.value[2]=u[2]}let l=n.get(a)?.get(o.property);l&&this.mix(o,l,this.value,t.weight),this.write(a,o,this.value)})}mix(t,i,n,o){if(t.property==="rotation")B.set(this.q1,i[0],i[1],i[2],i[3]),B.set(this.q2,n[0],n[1],n[2],n[3]),B.slerp(this.q1,this.q1,this.q2,o),n.set(this.q1);else for(let s=0;s<3;s++)n[s]=i[s]+(n[s]-i[s])*o}write(t,i,n){i.property==="translation"?t.setLocalPosition(n[0],n[1],n[2]):i.property==="scale"?t.setLocalScale(n[0],n[1],n[2]):t.setLocalRotationQuat(B.set(this.q1,n[0],n[1],n[2],n[3]))}toJsonObject(){return{...super.toJsonObject(),clipUris:[...this.clipUris],defaultClip:this.defaultClip,playOnStart:this.playOnStart,speed:this.speed,loop:this.loop,playInEditor:this.playInEditor,inPlace:this.inPlace}}fromJson(t){super.fromJson(t),this.clipUris=[...t.clipUris??[]],this.defaultClip=t.defaultClip??"",this.playOnStart=t.playOnStart??!0,this.speed=t.speed??1,this.loop=t.loop??!0,this.playInEditor=t.playInEditor??!1,this.inPlace=t.inPlace??!1}};d(Tn,"Animator");var Zt=Tn;var ms=class ms{registerDependencies(){G.addDependency("SceneEntity",(r,t)=>new _e(r,t),{name:"SceneEntity",type:"Entity",path:"Entities",description:"Base Entity for all entities in the scene."}),G.addDependency("Camera",se.instanciate,{name:"Camera",type:"Entity",path:"Entities",description:"Represents a camera in the 3D scene, generating view and projection matrices."}),G.addDependency("Light",Be.instanciate,{name:"Light",type:"Light",path:"Entities/Light",description:"Ambient light source providing general illumination to the scene without a specific direction or position."}),G.addDependency("PointLight",Ji.instanciate,{name:"PointLight",type:"Light",path:"Entities/Light",description:"A light source that emits light in all directions from a single point."}),G.addDependency("SpotLight",Yi.instanciate,{name:"SpotLight",type:"Light",path:"Entities/Light",description:"A light source that casts a cone of light in a specific direction."}),G.addDependency("DirectionalLight",Ct.instanciate,{name:"DirectionalLight",type:"Light",path:"Entities/Light",description:"A directional light source simulating light from a distant source like the sun."}),G.addDependency("Color",()=>new y),G.addDependency("Transform",()=>new Je,{name:"Transform",type:"Transform",path:"Core",description:"Represents the position, rotation, and scale of an object in 3D space."}),G.addDependency("MeshData",Z.instanciate,{name:"MeshData",type:"Mesh",path:"Geometry",description:"Base class for geometric mesh data holding vertices, normals, and UVs."}),G.addDependency("CubePrimitive",be.instanciate,{name:"CubePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 3D cube."}),G.addDependency("PlanePrimitive",pn.instanciate,{name:"PlanePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A flat square grid on the XZ plane."}),G.addDependency("QuadPrimitive",un.instanciate,{name:"QuadPrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 2D quad/plane."}),G.addDependency("SpherePrimitive",$e.instanciate,{name:"SpherePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a 3D sphere."}),G.addDependency("SkyboxPrimitive",dn.instanciate,{name:"SkyboxPrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh specifically structured for skyboxes."}),G.addDependency("TrianglePrimitive",mn.instanciate,{name:"TrianglePrimitive",type:"Mesh",path:"Geometry/Primitives",description:"A primitive mesh representing a simple 2D triangle."}),G.addDependency("Shader",Ne.instanciate,{name:"Shader",type:"Shader",path:"Shaders",description:"Base class managing the creation and compilation of WebGL shader programs."}),G.addDependency("SkyboxShader",Lt.instanciate,{name:"SkyboxShader",type:"Shader",path:"Shaders",description:"A specialized shader for rendering cubemap skyboxes."}),G.addDependency("UnlitShader",Zi.instanciate,{name:"UnlitShader",type:"Shader",path:"Shaders",description:"A shader for rendering unlit materials not affected by scene lights."}),G.addDependency("LitShader",mt.instanciate,{name:"LitShader",type:"Shader",path:"Shaders",description:"A shader for rendering objects with lighting and normal mapping, implementing the Phong lighting model."}),G.addDependency("EntityBehaviour",fe.instanciate,{name:"EntityBehaviour",type:"EntityBehaviour",path:"Behaviours",description:"Base class for all entity behaviours."}),G.addDependency("RendererBehaviour",Te.instanciate,{name:"RendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Base class for all rendering behaviours."}),G.addDependency("MeshRendererBehaviour",Ye.instanciate,{name:"MeshRendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Renders 3D meshes using the assigned material and shader."}),G.addDependency("SkinnedMeshRendererBehaviour",Qr.instanciate,{name:"SkinnedMeshRendererBehaviour",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"Renders a mesh from a model file, deformed by its bone entities."}),G.addDependency("SunBehaviour",bn.instanciate,{name:"SunBehaviour",type:"EntityBehaviour",path:"Behaviours/SunBehaviour",description:"Moves the sun through a day/night cycle and drives the skybox: sky colours, clouds, stars and an optional moon."}),G.addDependency("RotateBehaviour",yn.instanciate,{name:"RotateBehaviour",type:"EntityBehaviour",path:"Behaviours/RotateBehaviour",description:"Continuously rotates the entity along its axis over time."}),G.addDependency("Animator",Zt.instanciate,{name:"Animator",type:"EntityBehaviour",path:"Behaviours/Animation",description:"Plays animation clips from model files on the bones under its entity."}),G.addDependency("SkyboxRenderer",tt.instanciate,{name:"SkyboxRenderer",type:"RenderBehaviour",path:"Behaviours/Renderers",description:"A specialized renderer for drawing a skybox background."}),G.addDependency("ColorMaterial",Xt.instanciate,{name:"ColorMaterial",type:"Material",path:"Materials",description:"A basic material representing a solid color."}),G.addDependency("UnlitMaterial",Mr.instanciate,{name:"UnlitMaterial",type:"Material",path:"Materials",description:"A material used for unlit shaders, ignoring scene lighting."}),G.addDependency("LitMaterial",Kt.instanciate,{name:"LitMaterial",type:"Material",path:"Materials/Lit",description:"A material supporting physical lighting properties like roughness, specular strength, and normal mapping."}),G.addDependency("CubemapMaterial",Tr.instanciate,{name:"CubemapMaterial",type:"Material",path:"Materials",description:"A material used specifically for skyboxes and reflections, mapping a cubemap texture."}),G.addDependency("SkyboxMaterial",()=>new Sr,{name:"SkyboxMaterial",type:"Material",path:"Materials",description:"A specialized skybox material used specifically within the editor environment."}),G.addDependency("CameraFlyBehaviour",gn.instanciate,{name:"CameraFlyBehaviour",type:"EntityBehaviour",path:"Behaviours/Camera",description:"A free-look camera controller allowing movement and rotation via keyboard and mouse."}),Ne.preFetchFunctionsGlsl()}};d(ms,"DependencyManager");var Er=ms;var ps=class ps{constructor(){this.isFocused=!1;this.isTabActive=!0;this.isWindowFocused=!0;this.dependencyManager=new Er}get currentScene(){return this.scene}initialize(r){this.eventManager=new wn(this,r),this.eventManager.initialize()}registerDependencies(){this.dependencyManager.registerDependencies()}loadScene(r){this.scene=r,this.scene.initialize()}update(r){this.scene?.update(r)}render(){this.scene?.draw()}destroy(){this.scene?.destroy()}handleFocusChange(r){this.isFocused=r,this.isTabActive=document.visibilityState==="visible",this.isWindowFocused=r}};d(ps,"Engine");var Sn=ps;var An=class An extends fe{constructor(){super();this._className="RigidBodyBehaviour";this.bodyType="dynamic";this.mass=0;this.linearDamping=0;this.angularDamping=.05;this.ccd=!1;this.gravityScale=1;this.canSleep=!0;this.world=null;this._handle=-1;this._position=x.create();this._rotation=B.create();this._prevPosition=x.create();this._prevRotation=B.create();this._serializationIgnoreKeys.push("world","_handle","_position","_rotation","_prevPosition","_prevRotation")}static instanciate(){return new An}initialize(){return this.world??(this.world=ei.main),this.world||console.warn("RigidBodyBehaviour: no PhysicsWorld; create one before adding bodies."),this.world?._addBody(this),super.initialize()}destroy(){this.world?._removeBody(this)}get created(){return this._handle>=0}get isSleeping(){return this.backend()?this.backend().isSleeping(this._handle):!1}wakeUp(){this.backend()?.wakeUp(this._handle)}getLinearVelocity(t=x.create()){return this.backend()?.getLinearVelocity(this._handle,t)??x.zero(t)}setLinearVelocity(t){this.backend()?.setLinearVelocity(this._handle,t)}getAngularVelocity(t=x.create()){return this.backend()?.getAngularVelocity(this._handle,t)??x.zero(t)}setAngularVelocity(t){this.backend()?.setAngularVelocity(this._handle,t)}applyImpulse(t,i){this.backend()?.applyImpulse(this._handle,t,i)}applyTorqueImpulse(t){this.backend()?.applyTorqueImpulse(this._handle,t)}addForce(t){this.backend()?.addForce(this._handle,t)}resetForces(){this.backend()?.resetForces(this._handle)}teleport(t,i=this.transform.worldRotationQuat){this.transform.worldPosition=t,this.transform.worldRotationQuat=i;let n=this.backend();n&&(n.setBodyPose(this._handle,t,i),this._resetPose(t,i))}_resetPose(t,i){x.copy(this._position,t),x.copy(this._prevPosition,t),B.copy(this._rotation,i),B.copy(this._prevRotation,i)}backend(){return this.world?(this._handle<0&&this.world.flush(),this._handle>=0?this.world._backendWorld():null):null}toJsonObject(){return this.serializeAutomatically()}fromJson(t){super.fromJson(t),this.deserializeAutomatically(t)}};d(An,"RigidBodyBehaviour");var En=An;var pt=class pt extends fe{constructor(t,i={}){super();this._className="PhysicsWorld";this.timeScale=1;this.paused=!1;this.accumulator=0;this.bodies=new Set;this.pendingBodies=new Set;this.pendingColliders=new Set;this.colliders=new Map;this.contactListeners=new Set;this.forceListeners=new Set;this.stepListeners=new Set;this.backend=t,this._gravity=x.fromValues(...i.gravity??[0,-9.81,0]),this.fixedTimeStep=i.fixedTimeStep??1/60,this.maxSubSteps=i.maxSubSteps??5,this.interpolate=i.interpolate??!0,this.world=t.createWorld(this._gravity),pt.main??(pt.main=this),this._serializationIgnoreKeys.push("backend","world","bodies","pendingBodies","pendingColliders","colliders","contactListeners","forceListeners","stepListeners","accumulator")}get gravity(){return x.clone(this._gravity)}set gravity(t){x.copy(this._gravity,t),this.world.setGravity(this._gravity)}onContact(t){return this.contactListeners.add(t),()=>this.contactListeners.delete(t)}onContactForce(t){return this.forceListeners.add(t),()=>this.forceListeners.delete(t)}onBeforeStep(t){return this.stepListeners.add(t),()=>this.stepListeners.delete(t)}step(t){let i=this.fixedTimeStep;this.accumulator+=Math.max(0,t)*this.timeScale;let n=0;for(;this.accumulator>=i-1e-9&&n<this.maxSubSteps;)this.stepOnce(),this.accumulator=Math.max(0,this.accumulator-i),n++;n===this.maxSubSteps&&(this.accumulator=Math.min(this.accumulator,i)),this.writeTransforms(this.interpolate?this.accumulator/i:1)}stepOnce(){this.flush();for(let t of this.stepListeners)t(this.fixedTimeStep);for(let t of this.bodies)t.bodyType==="kinematic"&&t.transform&&this.world.setKinematicTarget(t._handle,t.transform.worldPosition,t.transform.worldRotationQuat);this.world.step(this.fixedTimeStep);for(let t of this.bodies)t.bodyType==="dynamic"&&(x.copy(t._prevPosition,t._position),B.copy(t._prevRotation,t._rotation),this.world.getBodyPose(t._handle,t._position,t._rotation));this.dispatchEvents(),this.writeTransforms(1)}flush(){for(let i of this.pendingBodies)this.createBody(i);if(this.pendingBodies.clear(),!this.pendingColliders.size)return;let t=new Map;for(let i of this.pendingColliders){let n=tp(i.parent),o=n&&n._handle>=0?n:null;t.has(o)||t.set(o,[]),t.get(o).push(i)}this.pendingColliders.clear();for(let[i,n]of t)for(let o of n)this.createCollider(o,i,i&&i.mass>0?i.mass/n.length:0)}raycast(t,i,n=1e3,o=!0){let s=this.world.raycast(t,i,n,o),a=s&&this.colliders.get(s.collider);return!s||!a?null:{collider:a,entity:a.parent,distance:s.distance,point:s.point,normal:s.normal}}beforeUpdate(t){this.paused||this.step(t)}afterUpdate(){}beforeDraw(){}afterDraw(){}destroy(){for(let t of this.bodies)t._handle=-1;for(let t of this.colliders.values())t._handle=-1;this.bodies.clear(),this.colliders.clear(),this.pendingBodies.clear(),this.pendingColliders.clear(),this.world.destroy(),pt.main===this&&(pt.main=null)}_backendWorld(){return this.world}_addBody(t){t._handle<0&&this.pendingBodies.add(t)}_removeBody(t){if(this.pendingBodies.delete(t),!(t._handle<0)){for(let[i,n]of this.colliders)n._body===t&&(this.colliders.delete(i),n._handle=-1,n._body=null);this.world.removeBody(t._handle),this.bodies.delete(t),t._handle=-1}}_addCollider(t){t._handle<0&&this.pendingColliders.add(t)}_removeCollider(t){this.pendingColliders.delete(t),!(t._handle<0)&&(this.world.removeCollider(t._handle),this.colliders.delete(t._handle),t._handle=-1,t._body=null)}createBody(t){let i=t.transform;if(!i)return;let n=i.worldPosition,o=i.worldRotationQuat;t._handle=this.world.createBody({type:t.bodyType,position:n,rotation:o,linearDamping:t.linearDamping,angularDamping:t.angularDamping,ccd:t.ccd,gravityScale:t.gravityScale,canSleep:t.canSleep}),t._resetPose(n,o),this.bodies.add(t)}createCollider(t,i,n){let o=t.transform;if(!o)return;let s=o.worldScale,a=o.worldRotationQuat,l=x.transformQuat(x.create(),x.mul(x.create(),x.fromValues(t.offset[0],t.offset[1],t.offset[2]),s),a),u=x.add(x.create(),o.worldPosition,l),c=u,h=a;if(i){let p=B.invert(B.create(),i._rotation);c=x.transformQuat(x.create(),x.sub(x.create(),u,i._position),p),h=B.mul(B.create(),p,a)}let m={shape:rp(t.shape,s),position:c,rotation:h,friction:t.friction,restitution:t.restitution,density:t.density,mass:t.mass>0?t.mass:n,sensor:t.sensor,contactEvents:t.contactEvents,contactForceThreshold:t.contactForceThreshold};t._handle=this.world.createCollider(m,i?i._handle:null),t._body=i,this.colliders.set(t._handle,t)}writeTransforms(t){let i=x.create(),n=B.create();for(let o of this.bodies)o.bodyType!=="dynamic"||!o.transform||(t>=1?(x.copy(i,o._position),B.copy(n,o._rotation)):(x.lerp(i,o._prevPosition,o._position,t),B.slerp(n,o._prevRotation,o._rotation,t)),o.transform.worldPosition=i,o.transform.worldRotationQuat=n)}dispatchEvents(){this.world.drainEvents((t,i,n)=>{let o=this.colliders.get(t),s=this.colliders.get(i);if(!o||!s)return;let a={a:o,b:s,started:n};o.onContact?.(a,s),s.onContact?.(a,o);for(let l of this.contactListeners)l(a)},(t,i,n)=>{let o=this.colliders.get(t),s=this.colliders.get(i);if(!o||!s)return;let a={a:o,b:s,force:n};for(let l of this.forceListeners)l(a)})}};d(pt,"PhysicsWorld"),pt.main=null;var ei=pt;function tp(e){for(let r=e?.transform;r;r=r.parent??void 0){let t=r.parentEntity?.getBehaviour(En);if(t)return t}return null}d(tp,"findBody");function rp(e,r){let t=Math.abs(r[0]),i=Math.abs(r[1]),n=Math.abs(r[2]);switch(e.type){case"sphere":return{type:"sphere",radius:e.radius*Math.max(t,i,n)};case"box":return{type:"box",halfExtents:[e.halfExtents[0]*t,e.halfExtents[1]*i,e.halfExtents[2]*n]};case"capsule":case"cylinder":return{type:e.type,halfHeight:e.halfHeight*i,radius:e.radius*Math.max(t,n)};case"convexHull":return{type:"convexHull",points:e.points.map((o,s)=>o*[t,i,n][s%3])};case"trimesh":return{type:"trimesh",vertices:e.vertices.map((o,s)=>o*[t,i,n][s%3]),indices:e.indices}}}d(rp,"scaleShape");var ip={".":"empty"," ":"empty","#":"ground",X:"block",B:"brick","?":"bonus","!":"power","*":"star","^":"spikes",G:"gate"},Rn={start:"S",goal:"F"},bl={o:"coin",$:"big",g:"walker",k:"shell",v:"flyer",C:"checkpoint",M:"boss",H:"backGate"},rt={move:"=",fall:"~",trackX:"-",trackY:"|"},np={empty:!1,ground:!0,block:!0,brick:!0,bonus:!0,power:!0,star:!0,used:!0,spikes:!1,gate:!0};function op(e){return np[e]}d(op,"isSolid");function xl(e){let r=e.rows.length,t=Math.max(...e.rows.map(u=>u.length)),i=Array.from({length:t},()=>Array(r).fill("empty")),n=null,o=null,s=[],a=[],l=d((u,c)=>e.rows[c]?.[u]??".","at");if(e.rows.forEach((u,c)=>{let h=r-1-c;for(let m=0;m<u.length;m++){let p=u[m];if(p===rt.trackX||p===rt.trackY)continue;if(p===rt.move||p===rt.fall){if(l(m-1,c)===p)continue;let f=1;for(;l(m+f,c)===p;)f++;let g=null;if(p===rt.move){let b=m,M=m+f;for(;l(b-1,c)===rt.trackX;)b--;for(;l(M,c)===rt.trackX;)M++;if(b<m||M>m+f)g={axis:"x",from:b,to:M-f};else{let _=c,w=c;for(let S=m;S<m+f;S++){let T=c,C=c;for(;l(S,T-1)===rt.trackY;)T--;for(;l(S,C+1)===rt.trackY;)C++;_=Math.min(_,T),w=Math.max(w,C)}(_<c||w>c)&&(g={axis:"y",from:r-1-w,to:r-1-_})}}a.push({kind:p===rt.move?"move":"fall",x:m,y:h,w:f,track:g});continue}if(p===Rn.start){n={x:m+.5,y:h};continue}if(p===Rn.goal){o={x:m+.5,y:h};continue}if(bl[p]){s.push({kind:bl[p],x:m+.5,y:h});continue}let v=ip[p];if(!v)throw new Error(`${e.name}: unknown tile '${p}' at row ${c}, column ${m}`);i[m][h]=v}}),!n)throw new Error(`${e.name}: no start (${Rn.start})`);if(!o)throw new Error(`${e.name}: no goal (${Rn.goal})`);return{name:e.name,width:t,height:r,tiles:i,start:n,goal:o,things:s,platforms:a,theme:e.theme??"meadow"}}d(xl,"parseLevel");function je(e,r,t){return r<0?"block":r>=e.width||t<0||t>=e.height?"empty":e.tiles[r][t]}d(je,"tileAt");function ft(e,r,t){return op(je(e,r,t))}d(ft,"solidAt");var le=1/120,ti=1e-6,sp=.22;function vt(e,r,t,i,n){for(let o=Math.floor(r);o<=Math.floor(i-ti);o++)for(let s=Math.floor(t);s<=Math.floor(n-ti);s++)if(ft(e,o,s))return!0;return!1}d(vt,"overlapsSolid");function ri(e,r,t,i,n){return vt(e,r-i/2,t,r+i/2,t+n)}d(ri,"boxBlocked");function gt(e,r,t=le){let i={wallLeft:!1,wallRight:!1,landed:!1,bumped:null},n=r.w/2,o=r.x+r.vx*t;if(r.vx>0&&vt(e,o-n,r.y,o+n,r.y+r.h)){for(o=Math.floor(o+n-ti)-n;vt(e,o-n,r.y,o+n,r.y+r.h);)o-=1;r.vx=0,i.wallRight=!0}else if(r.vx<0&&vt(e,o-n,r.y,o+n,r.y+r.h)){for(o=Math.floor(o-n)+1+n;vt(e,o-n,r.y,o+n,r.y+r.h);)o+=1;r.vx=0,i.wallLeft=!0}r.x=o;let s=r.onGround,a=r.y+r.vy*t;if(r.onGround=!1,r.vy<=0)vt(e,r.x-n,a,r.x+n,a+r.h)?(a=Math.floor(a)+1,r.vy=0,r.onGround=!0,i.landed=!s):r.vy===0&&vt(e,r.x-n,a-.02,r.x+n,a)&&(r.onGround=!0);else if(vt(e,r.x-n,a,r.x+n,a+r.h)){let l=Math.floor(a+r.h-ti),u=Math.floor(r.x-n),c=Math.floor(r.x+n-ti),h=ft(e,u,l),m=ft(e,c,l);if(h!==m){let f=h?u+1-(r.x-n):c-(r.x+n);if(Math.abs(f)<=sp&&!vt(e,r.x+f-n,a,r.x+f+n,a+r.h))return r.x+=f,r.y=a,i}a=l-r.h,r.vy=0;let p=Math.floor(r.x),v=ft(e,p,l)?p:h?u:c;i.bumped={x:v,y:l}}return r.y=a,i}d(gt,"moveBody");var ue={width:.7,height:.9,walk:6,run:9.5,accel:32,airAccel:22,decel:38,turn:60,jump:18.3,jumpFromSpeed:.12,gravityHeld:40,gravityCut:120,gravityFall:75,maxFall:22,coyote:.1,buffer:.12},_l={left:!1,right:!1,jump:!1,jumpPressed:!1,run:!1};function wl(e,r){return{body:{x:e,y:r,w:ue.width,h:ue.height,vx:0,vy:0,onGround:!0},facing:1,airTime:0,bufferTime:1/0,jumping:!1,contacts:{wallLeft:!1,wallRight:!1,landed:!1,bumped:null},jumped:!1,riding:-1}}d(wl,"makeHero");function yl(e,r,t,i){return e<r?Math.min(r,e+t*i):Math.max(r,e-t*i)}d(yl,"approach");function Ml(e,r,t,i=le){let n=e.body,o=(r.right?1:0)-(r.left?1:0),s=r.run?ue.run:ue.walk;if(o!==0){e.facing=o;let l=n.vx*o<0,u=n.onGround?l?ue.turn:ue.accel:ue.airAccel,c=Math.abs(n.vx)>s&&n.vx*o>0?ue.decel*.5:u;n.vx=yl(n.vx,o*s,c,i)}else n.vx=yl(n.vx,0,n.onGround?ue.decel:ue.airAccel*.5,i);e.airTime=n.onGround?0:e.airTime+i,e.bufferTime=r.jumpPressed?0:e.bufferTime+i,e.jumped=!1,e.bufferTime<=ue.buffer&&e.airTime<=ue.coyote&&!e.jumping&&(n.vy=ue.jump+ue.jumpFromSpeed*Math.abs(n.vx),n.onGround=!1,e.jumping=!0,e.jumped=!0,e.airTime=ue.coyote+i,e.bufferTime=1/0);let a=n.vy>0?e.jumping&&r.jump?ue.gravityHeld:ue.gravityCut:ue.gravityFall;n.vy=Math.max(-ue.maxFall,n.vy-a*i),n.vy<=0&&(e.jumping=!1),e.contacts=gt(t,n,i),e.contacts.bumped&&(e.jumping=!1)}d(Ml,"stepHero");function Tl(e){return e.body.y<-3}d(Tl,"fellOut");var Ar={speed:2.4,thick:.45,fallDelay:.45,fallGravity:28};function Sl(e){return e.map(r=>{let t=0,i=0;if(r.track&&r.track.to!==r.track.from){let n=r.track.to-r.track.from,o=r.track.axis==="x"?r.x:r.y,s=Math.min(1,Math.max(0,(o-r.track.from)/n));t=Math.acos(1-2*s),i=Math.PI*Math.abs(n)/Ar.speed}return{spec:r,x:r.x,y:r.y,w:r.w,dx:0,dy:0,state:"still",time:0,vy:0,phase:t,period:i}})}d(Sl,"makePlatforms");function ap(e,r=le){for(let t of e.platforms){let i=t.x,n=t.y;t.time+=r;let o=t.spec.track;if(t.state==="shake"&&t.time>=Ar.fallDelay&&(t.state="fall",t.time=0),t.state==="fall")t.vy-=Ar.fallGravity*r,t.y+=t.vy*r,t.y<-5&&(t.state="gone");else if(o&&t.period>0){let s=o.from+(o.to-o.from)*(1-Math.cos(t.phase+2*Math.PI*e.elapsed/t.period))/2;o.axis==="x"?t.x=s:t.y=s}t.dx=t.x-i,t.dy=t.y-n}}d(ap,"movePlatforms");var lp=d((e,r,t)=>e+r/2>t.x+.04&&e-r/2<t.x+t.w-.04,"overPlatform");function er(e,r,t,i=le){let n=r.body,o=e.platforms.map(m=>m.y+1);e.elapsed+=i,ap(e,i);let s=r.riding>=0?e.platforms[r.riding]:null;s&&(s.state==="gone"?r.riding=-1:(ri(e.level,n.x+s.dx,n.y,n.w,n.h)||(n.x+=s.dx),ri(e.level,n.x,s.y+1,n.w,n.h)?r.riding=-1:n.y=s.y+1));let a=r.riding,l=n.y;if(Ml(r,t,e.level,i),r.riding=-1,n.vy>0)return!1;let u=-1,c=-1/0;if(e.platforms.forEach((m,p)=>{if(m.state==="gone"||!lp(n.x,n.w,m))return;let v=m.y+1;l>=Math.min(o[p],v)-.02&&n.y<=v+1e-6&&v>c&&(u=p,c=v)}),u<0||n.onGround&&n.y>c)return!1;let h=e.platforms[u];return n.y=c,n.vy=0,n.onGround=!0,r.jumping=!1,r.riding=u,h.spec.kind==="fall"&&h.state==="still"&&(h.state="shake",h.time=0),a!==u}d(er,"stepHeroOnStage");function Cn(e){return{level:e.level,platforms:e.platforms.map(r=>({...r})),elapsed:e.elapsed}}d(Cn,"cloneStage");var Cl={meadow:"king",caves:"golem",clouds:"drone"},Ll={king:"Rei Bolota",golem:"Geodo",drone:"Turbina"},ae={hp:3,hurtTime:1.3,wakeAfter:1.5,gravity:40,points:{hit:1e3,down:5e3},bounce:13,bounceHeld:17,king:{w:2.2,h:1.9,walk:2.4,faster:.8,walkTime:2.2,crouch:.5,leapVy:15,leapVx:6},golem:{w:2,h:2.3,walk:1.6,walkTime:2,aim:.6,shotSpeed:7.5,shotGap:.5,low:.15,high:1.2},drone:{w:2.2,h:1.1,fly:3,hover:5.6,dropEvery:2.4,swoopEvery:5.5,dive:8,rest:1.5,rise:4},shot:{w:.55,h:.35,life:6},bolt:{w:.4,h:.4,gravity:24}};function Xl(e,r,t){let i=ae[e],n=t,o=e==="drone"?n+ae.drone.hover:n;return{kind:e,hp:ae.hp,state:"idle",time:0,clock:0,dir:-1,hurt:0,floor:n,fired:0,lastDrop:0,lastSwoop:0,shots:[],body:{x:r,y:o,w:i.w,h:i.h,vx:0,vy:0,onGround:e!=="drone"}}}d(Xl,"makeBoss");var Pl=d(e=>({...e,body:{...e.body},shots:e.shots.map(r=>({...r,body:{...r.body}}))}),"cloneBoss"),cp=d(e=>1+.25*(ae.hp-e.hp),"pace");function De(e,r){e.state=r,e.time=0}d(De,"setState");function El(e,r,t,i,n,o,s){e.shots.push({body:{x:r,y:t,w:s.w,h:s.h,vx:i,vy:n,onGround:!1},gravity:o,time:0,gone:!1})}d(El,"fire");var Al=d((e,r)=>{for(let t=Math.floor(r.x-r.w/2);t<=Math.floor(r.x+r.w/2-1e-6);t++)for(let i=Math.floor(r.y);i<=Math.floor(r.y+r.h-1e-6);i++){let n=e.tiles[t]?.[i];if(n&&n!=="empty"&&n!=="spikes")return!0}return!1},"overlapsSolid");function Ln(e,r,t,i=le){let n=[];e.time+=i,e.hurt=Math.max(0,e.hurt-i);let o=e.body,s=r.x<o.x?-1:1;for(let l of e.shots)l.gone||(l.time+=i,l.body.vy-=l.gravity*i,l.body.x+=l.body.vx*i,l.body.y+=l.body.vy*i,(l.time>ae.shot.life||l.body.y<-2||Al(t,l.body))&&(l.gone=!0));if(e.shots=e.shots.filter(l=>!l.gone),e.state==="gone")return n;if(e.state==="down")return o.vy-=ae.gravity*i,o.y+=o.vy*i,e.time>2.5&&De(e,"gone"),n;if(e.state==="idle")return n;e.clock+=i;let a=cp(e);if(e.kind==="king"){let l=ae.king;e.state==="walk"?(e.time<i*1.5&&(e.dir=s),o.vx=e.dir*(l.walk+l.faster*(ae.hp-e.hp)),e.time>l.walkTime/a&&(De(e,"crouch"),o.vx=0)):e.state==="crouch"&&(o.vx=0,e.time>l.crouch/a&&(De(e,"leap"),o.vy=l.leapVy,o.vx=Math.max(-l.leapVx,Math.min(l.leapVx,(r.x-o.x)/1.1)),o.onGround=!1)),o.vy=Math.max(-25,o.vy-ae.gravity*i);let u=gt(t,o,i);(u.wallLeft||u.wallRight)&&(e.dir=-e.dir),e.state==="leap"&&u.landed&&(De(e,"walk"),n.push("thud"))}else if(e.kind==="golem"){let l=ae.golem;if(e.state==="walk")e.time<i*1.5&&(e.dir=s),o.vx=e.dir*l.walk*a,e.time>l.walkTime&&(De(e,"aim"),o.vx=0,e.dir=s);else if(e.state==="aim")o.vx=0,e.dir=s,e.time>l.aim/a&&(De(e,"shoot"),e.fired=0);else if(e.state==="shoot"){o.vx=0;let c=1+ae.hp-e.hp;if(e.time>=e.fired*l.shotGap&&e.fired<c){let h=e.fired%2===1;El(e,o.x+e.dir*(o.w/2+.3),e.floor+(h?l.high:l.low),e.dir*l.shotSpeed,0,0,ae.shot),e.fired++,n.push("shoot")}e.fired>=c&&e.time>e.fired*l.shotGap+.3&&De(e,"walk")}o.vy=Math.max(-25,o.vy-ae.gravity*i);let u=gt(t,o,i);(u.wallLeft||u.wallRight)&&(e.dir=-e.dir)}else{let l=ae.drone,u=e.floor+l.hover;e.state==="fly"?(o.vx=e.dir*l.fly*a,o.vy=0,o.y=u+Math.sin(e.clock*3)*.25,e.clock-e.lastDrop>l.dropEvery/a&&(e.lastDrop=e.clock,El(e,o.x,o.y-.1,0,0,ae.bolt.gravity,ae.bolt),n.push("drop")),e.clock-e.lastSwoop>l.swoopEvery&&(e.lastSwoop=e.clock,De(e,"swoop"),e.dir=s)):e.state==="swoop"?(o.vy=-l.dive,o.vx=Math.max(-l.dive,Math.min(l.dive,(r.x-o.x)*2.5)),o.y<=e.floor+.05&&(o.y=e.floor,o.vy=0,o.vx=0,De(e,"rest"),n.push("thud"))):e.state==="rest"?(o.vx=0,o.vy=0,e.time>l.rest/a&&De(e,"rise")):e.state==="rise"&&(o.vx=0,o.vy=l.rise,o.y>=u&&(o.y=u,De(e,"fly"),e.lastDrop=e.clock));let c=o.x+o.vx*i;Al(t,{...o,x:c})?(e.dir=-e.dir,o.vx=0):o.x=c,e.state!=="fly"&&(o.y=Math.max(e.floor,o.y+o.vy*i))}return n}d(Ln,"stepBoss");function Bl(e){e.state==="idle"&&(De(e,e.kind==="king"||e.kind==="golem"?"walk":"fly"),e.clock=0)}d(Bl,"wakeBoss");var Rl=d((e,r)=>Math.abs(e.x-r.x)<(e.w+r.w)/2&&e.y<r.y+r.h&&r.y<e.y+e.h,"overlap");function Xn(e,r,t,i=!1){if(e.state==="down"||e.state==="gone")return null;for(let s of e.shots)if(!s.gone&&Rl(r,s.body))return s.gone=!0,i?null:"hurt";if(!Rl(r,e.body))return null;let n=e.body.y+e.body.h,o=r.vy<=0&&t>=n-Math.min(.6,e.body.h*.4);return(o||i)&&e.hurt<=0?(e.hp--,e.hurt=ae.hurtTime,e.hp<=0?(De(e,"down"),e.body.vy=8,e.shots=[],"down"):(e.kind==="drone"&&(e.state==="rest"||e.state==="swoop")&&De(e,"rise"),"stomp")):o?"bounce":e.hurt>0||i?null:"hurt"}d(Xn,"bossContact");var Re={lives:3,time:300,coinsForLife:100,points:{coin:200,stomp:100,kick:400,timeLeft:10,big:2e3},bounce:10,bounceHeld:15,wakeAhead:2},de={big:{w:.95,h:1.5},hurtTime:2,starTime:8,rise:.6,battery:{speed:3},star:{speed:4,bounce:13},item:{w:.7,h:.7,gravity:40},spark:{w:.3,h:.3,speed:12,bounce:7,gravity:50,max:2,life:2.5},points:{item:1e3,brick:50,spark:200},flag:[[7.5,5e3],[6,2e3],[4,800],[2,400],[0,100]]},ke={walker:{w:.8,h:.75,speed:2},shell:{w:.8,h:.9,speed:1.6,shellH:.6,slide:11},flyer:{w:.8,h:.7,bob:1.5,period:2.6},gravity:60,maxFall:20,kickGrace:.25},xs=3;function ni(e,r){let t=xl(e),i=r?.checkpoint??t.start,n=[],o=[],s=[],a=null,l=[],u=[];for(let c of t.things)if(c.kind==="coin")o.push({x:c.x,y:c.y+.5,taken:!1});else if(c.kind==="big")s.push({x:c.x,y:c.y+.5,taken:!1});else if(c.kind==="boss")a=Xl(Cl[t.theme],c.x,c.y);else if(c.kind==="backGate")l.push({x:Math.floor(c.x),y:c.y});else if(c.kind==="checkpoint")u.push({x:c.x,y:c.y});else{let h=ke[c.kind];n.push({id:n.length,kind:c.kind,dir:-1,state:"asleep",time:0,home:{x:c.x,y:c.y},grace:0,body:{x:c.x,y:c.y,w:h.w,h:h.h,vx:0,vy:0,onGround:!1}})}return s.sort((c,h)=>c.x-h.x),s.forEach((c,h)=>{c.taken=!!r?.bigTaken?.[h]}),{spec:e,level:t,hero:wl(i.x,i.y),enemies:n,coins:o,bigCoins:s,platforms:Sl(t.platforms),boss:a,backGates:l,elapsed:0,checkpoints:u,checkpoint:r?.checkpoint??null,lives:r?.lives??Re.lives,coinCount:r?.coinCount??0,score:r?.score??0,time:Re.time,chain:0,power:"small",growing:!1,hurt:0,star:0,items:[],sparks:[],runHeld:!1,flag:null,dead:!1,cleared:!1,events:[]}}d(ni,"makeWorld");function ys(e){return e.lives<=0?null:ni(e.spec,{lives:e.lives,coinCount:e.coinCount,score:e.score,checkpoint:e.checkpoint,bigTaken:e.bigCoins.map(r=>r.taken)})}d(ys,"nextTry");var Pn=d((e,r)=>Math.abs(e.x-r.x)<(e.w+r.w)/2&&e.y<r.y+r.h&&r.y<e.y+e.h,"overlap");function fs(e,r){for(let t=0;t<r;t++)e.coinCount++,e.score+=Re.points.coin,e.coinCount%Re.coinsForLife===0&&(e.lives++,e.events.push({type:"oneUp",x:e.hero.body.x,y:e.hero.body.y}))}d(fs,"addCoins");function bs(e){e.dead||(e.dead=!0,e.lives--,e.events.push({type:"die",x:e.hero.body.x,y:e.hero.body.y}))}d(bs,"die");function vs(e){let r=Math.min(1e3,Re.points.stomp*2**e.chain);return e.chain++,r}d(vs,"chainPoints");function ii(e,r,t){r.state="out",r.time=0,r.body.vy=9,r.body.vx=r.dir*1.5,e.score+=t,e.events.push({type:"knock",x:r.body.x,y:r.body.y,points:t,enemy:r.id})}d(ii,"knock");function up(e,r){e.body.h=r?ke.shell.shellH:ke.shell.h}d(up,"setShellSize");function dp(e,r,t){r.time+=t,r.grace=Math.max(0,r.grace-t);let i=r.body;if(r.state==="squashed"){r.time>.5&&(r.state="gone");return}if(r.state==="out"){i.vy-=ke.gravity*t,i.x+=i.vx*t,i.y+=i.vy*t,i.y<-6&&(r.state="gone");return}if(r.kind==="flyer"){i.y=r.home.y+1+Math.sin(r.time/ke.flyer.period*Math.PI*2)*ke.flyer.bob,r.dir=e.hero.body.x<i.x?-1:1;return}let n=r.state==="slide"?ke.shell.slide:r.state==="shell"?0:ke[r.kind].speed;i.vx=r.dir*n,i.vy=Math.max(-ke.maxFall,i.vy-ke.gravity*t);let o=gt(e.level,i,t);(o.wallLeft||o.wallRight)&&(r.dir=-r.dir,r.state==="slide"&&e.events.push({type:"wall",x:i.x,y:i.y})),i.y<-3&&(r.state="gone")}d(dp,"stepEnemy");function _s(e){let r=e.hero.body,t=e.power!=="small";if(t&&r.h<de.big.h){if(ri(e.level,r.x,r.y,de.big.w,de.big.h)){e.growing=!0;return}r.w=de.big.w,r.h=de.big.h,e.growing=!1,e.events.push({type:"grow",x:r.x,y:r.y})}else t||(r.w=ue.width,r.h=ue.height,e.growing=!1)}d(_s,"fitHero");function gs(e){if(!(e.star>0||e.hurt>0||e.dead)){if(e.power==="small"){bs(e);return}e.power="small",e.hurt=de.hurtTime,_s(e),e.events.push({type:"shrink",x:e.hero.body.x,y:e.hero.body.y})}}d(gs,"hurtHero");function hp(e,r){r.state="gone",r.kind==="battery"?e.power==="small"&&(e.power="big"):r.kind==="thruster"?e.power="spark":e.star=de.starTime,_s(e),e.score+=de.points.item,e.events.push({type:"power",x:r.body.x,y:r.body.y,kind:r.kind,points:de.points.item})}d(hp,"takeItem");function mp(e,r,t){r.time+=t;let i=r.body;if(r.state==="rise"){i.y=r.fromY+Math.min(1,r.time/de.rise),r.time>=de.rise&&(r.state="move",r.time=0);return}if(r.kind==="thruster")return;i.vx=r.dir*(r.kind==="star"?de.star.speed:de.battery.speed),i.vy=Math.max(-ke.maxFall,i.vy-de.item.gravity*t);let n=gt(e.level,i,t);(n.wallLeft||n.wallRight)&&(r.dir=-r.dir),r.kind==="star"&&n.landed&&(i.vy=de.star.bounce),i.y<-3&&(r.state="gone")}d(mp,"stepItem");function pp(e){let r=e.hero.body;if(e.sparks.filter(n=>!n.gone).length>=de.spark.max)return;let t=de.spark,i=e.hero.facing;e.sparks.push({dir:i,time:0,gone:!1,body:{x:r.x+i*(r.w/2),y:r.y+r.h*.45,w:t.w,h:t.h,vx:i*t.speed,vy:-2,onGround:!1}}),e.events.push({type:"shoot",x:r.x,y:r.y+r.h*.45})}d(pp,"shoot");function fp(e,r,t,i){let n=de.spark,o=r.body;r.time+=i,o.vx=r.dir*n.speed,o.vy=Math.max(-ke.maxFall,o.vy-n.gravity*i);let s=gt(e.level,o,i);if(s.landed&&(o.vy=n.bounce),s.wallLeft||s.wallRight||r.time>n.life||o.y<-2||o.x>t+1){r.gone=!0,(s.wallLeft||s.wallRight)&&e.events.push({type:"fizzle",x:o.x,y:o.y});return}for(let a of e.enemies)if(!(a.state!=="walk"&&a.state!=="shell"&&a.state!=="slide")&&Pn(o,a.body)){a.dir=r.dir,ii(e,a,de.points.spark),r.gone=!0;return}}d(fp,"stepSpark");var vp=d((e,r,t)=>Math.abs(e.y-(t+1))<.05&&e.x+e.w/2>r&&e.x-e.w/2<r+1,"standsOn");function ws(e,r,t,i=le){if(e.events=[],e.dead||e.cleared)return;let n=e.hero,o=n.body,s=o.y;if(e.time-=i,e.time<=0){e.time=0,bs(e);return}e.hurt=Math.max(0,e.hurt-i),e.star=Math.max(0,e.star-i);let a=er(e,n,r,i);e.growing&&_s(e),e.power==="spark"&&r.run&&!e.runHeld&&pp(e),e.runHeld=r.run,n.jumped&&e.events.push({type:"jump",x:o.x,y:o.y}),(n.contacts.landed||a)&&e.events.push({type:"land",x:o.x,y:o.y}),o.onGround&&(e.chain=0);let l=n.contacts.bumped;if(l){let c=je(e.level,l.x,l.y);if(e.events.push({type:"bump",x:l.x,y:l.y,tile:c}),c==="bonus")e.level.tiles[l.x][l.y]="used",fs(e,1),e.events.push({type:"coin",x:l.x+.5,y:l.y+1,fromBlock:!0});else if(c==="power"||c==="star"){e.level.tiles[l.x][l.y]="used";let h=c==="star"?"star":e.power==="small"?"battery":"thruster",m=e.items.length,p=de.item;e.items.push({id:m,kind:h,dir:1,state:"rise",time:0,fromY:l.y,body:{x:l.x+.5,y:l.y,w:p.w,h:p.h,vx:0,vy:0,onGround:!1}}),e.events.push({type:"item",x:l.x+.5,y:l.y+1,kind:h,id:m})}else c==="brick"&&e.power!=="small"&&(e.level.tiles[l.x][l.y]="empty",e.score+=de.points.brick,e.events.push({type:"break",x:l.x,y:l.y,points:de.points.brick}));if(c==="bonus"||c==="brick"||c==="used"||c==="power"||c==="star"){for(let h of e.enemies)(h.state==="walk"||h.state==="shell")&&vp(h.body,l.x,l.y)&&ii(e,h,Re.points.stomp);for(let h of e.coins)!h.taken&&Math.floor(h.x)===l.x&&Math.floor(h.y)===l.y+1&&(h.taken=!0,fs(e,1),e.events.push({type:"coin",x:h.x,y:h.y,fromBlock:!0}))}}for(let c of e.coins)c.taken||Math.abs(c.x-o.x)<o.w/2+.3&&c.y>o.y-.3&&c.y<o.y+o.h+.3&&(c.taken=!0,fs(e,1),e.events.push({type:"coin",x:c.x,y:c.y,fromBlock:!1}));e.bigCoins.forEach((c,h)=>{c.taken||Math.abs(c.x-o.x)<o.w/2+.5&&c.y>o.y-.5&&c.y<o.y+o.h+.5&&(c.taken=!0,e.score+=Re.points.big,e.events.push({type:"big",x:c.x,y:c.y,index:h,points:Re.points.big}))});for(let c of e.items){if(c.state==="gone")continue;mp(e,c,i);let h=c.state;h!=="gone"&&(h==="move"||c.time>de.rise*.5)&&Pn(o,c.body)&&hp(e,c)}for(let c of e.sparks)c.gone||fp(e,c,t,i);e.sparks=e.sparks.filter(c=>!c.gone);for(let c=Math.floor(o.x-o.w/2);c<=Math.floor(o.x+o.w/2-1e-6);c++)for(let h=Math.floor(o.y);h<=Math.floor(o.y+o.h-1e-6);h++)if(je(e.level,c,h)==="spikes"&&o.y<h+.55&&(gs(e),e.dead))return;for(let c of e.enemies){if(c.state==="asleep")if(c.body.x-c.body.w/2<t+Re.wakeAhead)c.state="walk",c.time=0;else continue;c.state!=="gone"&&dp(e,c,i)}for(let c of e.enemies)if(c.state==="slide")for(let h of e.enemies)h===c||h.state!=="walk"&&h.state!=="shell"&&h.state!=="slide"||Pn(c.body,h.body)&&(h.dir=c.dir,ii(e,h,vs(e)));for(let c of e.enemies){if(c.state!=="walk"&&c.state!=="shell"&&c.state!=="slide"||!Pn(o,c.body))continue;if(e.star>0){c.dir=o.x<c.body.x?1:-1,ii(e,c,vs(e));continue}if(o.vy<=0&&s>=c.body.y+c.body.h*.45){let m=c.state==="shell"?Re.points.kick:vs(e);c.kind==="walker"?(c.state="squashed",c.time=0):c.kind==="flyer"?ii(e,c,0):c.state==="walk"||c.state==="slide"?(c.state="shell",c.time=0,up(c,!0)):(c.state="slide",c.dir=o.x<c.body.x?1:-1,c.grace=ke.kickGrace),o.y=Math.max(o.y,c.body.y+c.body.h),o.vy=r.jump?Re.bounceHeld:Re.bounce,n.jumping=r.jump,e.score+=m,e.events.push({type:c.state==="slide"?"kick":"stomp",x:c.body.x,y:c.body.y+c.body.h,points:m,enemy:c.id});continue}if(c.state==="shell"){c.state="slide",c.dir=o.x<c.body.x?1:-1,c.grace=ke.kickGrace,e.score+=Re.points.kick,e.events.push({type:"kick",x:c.body.x,y:c.body.y,points:Re.points.kick,enemy:c.id});continue}if(!(c.grace>0)&&(gs(e),e.dead))return}let u=e.boss;if(u){if(u.state==="idle"&&e.backGates.length&&o.x>e.backGates[0].x+1+ae.wakeAfter){for(let h of e.backGates)e.level.tiles[h.x][h.y]="gate";Bl(u),e.events.push({type:"bossWake",x:u.body.x,y:u.body.y,points:0})}for(let h of Ln(u,o,e.level,i))e.events.push({type:"boss",what:h,x:u.body.x,y:u.body.y});let c=Xn(u,o,s,e.star>0);if(c==="stomp"||c==="down"||c==="bounce"){if(s>=u.body.y+u.body.h*.5&&(o.y=Math.max(o.y,u.body.y+u.body.h),o.vy=r.jump?ae.bounceHeld:ae.bounce,n.jumping=r.jump),c!=="bounce"){let h=c==="down"?ae.points.hit+ae.points.down:ae.points.hit;e.score+=h,e.events.push({type:c==="down"?"bossDown":"bossHit",x:u.body.x,y:u.body.y+u.body.h,points:h})}if(c==="down")for(let h=0;h<e.level.width;h++)for(let m=0;m<e.level.height;m++)e.level.tiles[h][m]==="gate"&&(e.level.tiles[h][m]="empty")}else if(c==="hurt"&&(gs(e),e.dead))return}for(let c of e.checkpoints)o.x>=c.x&&(!e.checkpoint||e.checkpoint.x<c.x)&&(e.checkpoint=c,e.events.push({type:"checkpoint",x:c.x,y:c.y}));if(Tl(n)){bs(e);return}if(o.x+o.w/2>=e.level.goal.x-.5){e.cleared=!0;let c=Math.max(0,o.y-e.level.goal.y),h=de.flag.find(([m])=>c>=m)[1];e.flag={height:c,points:h},e.score+=h+Math.ceil(e.time)*Re.points.timeLeft,e.events.push({type:"clear",x:o.x,y:o.y,height:c,points:h})}}d(ws,"stepWorld");function Rr(){return{held:-1,run:!0,hold:.5,dir:1,think:0}}d(Rr,"makeBot");var Dl=[-1,0,1].flatMap(e=>[-1,.2,.5].map(r=>({dir:e,hold:r})));function gp(e,r,t){let i=Cn(e),n=Ms(e.hero),o=Pl(e.boss),s=1.1;for(let u=0;u*le<s;u++){let c=u*le,h=n.body.y;er(i,n,{left:r<0,right:r>0,run:!0,jump:t>=0&&c<t,jumpPressed:t>=0&&u===0},le),Ln(o,n.body,i.level,le);let m=Xn(o,n.body,h,e.star>0);if(m==="stomp"||m==="down")return 1e3-c*100;if(m==="bounce"&&(n.body.vy=ae.bounce,n.body.y=Math.max(n.body.y,o.body.y+o.body.h)),m==="hurt")return-1e3+c*100;if(n.body.y<-1)return-2e3}let a=Math.abs(n.body.x-o.body.x)-(o.body.w+n.body.w)/2,l=o.shots.reduce((u,c)=>Math.min(u,Math.hypot(c.body.x-n.body.x,c.body.y-n.body.y)),9);return-Math.abs(a-2.5)-(l<2?2-l:0)-(t>=0?.2:0)}d(gp,"fightScore");function bp(e,r,t){let i=r.hero.body,n=!1;if(i.onGround&&e.held<0&&--e.think<=0){let s=Dl[0],a=-1/0;for(let l of Dl){let u=gp(r,l.dir,l.hold);u>a&&(a=u,s=l)}e.dir=s.dir,e.think=6,s.hold>=0&&(n=!0,e.held=0,e.hold=s.hold)}else e.held>=0&&(e.held+=t);let o=e.held>=0&&e.held<e.hold;return(e.held>.5||e.held>.05&&i.vy<=0&&i.onGround)&&(e.held=-1,e.think=0),{left:e.dir<0,right:e.dir>0,run:!0,jump:o,jumpPressed:n}}d(bp,"fightInput");var xp=[{run:!0,hold:.5},{run:!1,hold:.5},{run:!0,hold:.2},{run:!1,hold:.2}],kl={run:!1,hold:-1},Ms=d(e=>({...e,body:{...e.body},contacts:{...e.contacts}}),"copyHero");function oi(e,r,t){let i=Math.floor(t+.01),n=Math.floor(r);for(let o of[i,i-1,i-2]){if(je(e.level,n,o)==="spikes")return!1;if(o<i&&ft(e.level,n,o))return!0}return e.platforms.some(o=>o.state!=="gone"&&o.state!=="fall"&&r>o.x&&r<o.x+o.w&&o.y+1<=t+.1&&o.y+1>=t-2)}d(oi,"groundAt");function Fl(e,r){let t=r.body;if(Bn(e,r))return!1;if(r.riding>=0&&e.platforms[r.riding].spec.kind==="fall")return!0;let i=t.y;for(let n=0;n<90;n++)if(er(e,r,_l,le),t.y<i-.5||Bn(e,r))return!1;return oi(e,t.x,t.y)}d(Fl,"safeLanding");function Bn(e,r){let t=r.body;for(let i=Math.floor(t.x-t.w/2);i<=Math.floor(t.x+t.w/2-1e-6);i++)for(let n=Math.floor(t.y);n<=Math.floor(t.y+t.h-1e-6);n++)if(je(e.level,i,n)==="spikes"&&t.y<n+.55)return!0;return!1}d(Bn,"onSpikes");function Il(e,r,t){let i=Cn(e),n=Ms(e.hero);for(let o=0;o<360;o++){let s=o*le;if(er(i,n,{left:!1,right:!0,run:r,jump:s<t,jumpPressed:t>=0&&o===0},le),n.body.y<-1||Bn(i,n))return!1;if(o>2&&n.body.onGround)return Fl(i,n)}return!0}d(Il,"safeJump");function yp(e){let r=Cn(e),t=Ms(e.hero),i=-1;for(let n=0;n<480;n++){let o=t.body,s=i<0&&o.onGround&&!oi(r,o.x+o.w/2+.3,o.y);s&&(i=n);let a=i>=0&&(n-i)*le<.5;if(er(r,t,{left:!1,right:!0,run:!0,jump:a,jumpPressed:s},le),o.y<-1||Bn(r,t))return!1;if(i>=0&&n-i>2&&o.onGround)return Fl(r,t)}return!0}d(yp,"safeRunUp");function Nl(e,r,t){let i=r.boss;if(i&&i.state!=="idle"&&i.state!=="down"&&i.state!=="gone")return bp(e,r,t);let n=r.hero.body,o=n.x+n.w/2,s=Math.floor(n.y+.01),a=!1,l=!1;if(n.onGround){for(let p=.05;p<=1.5&&!a;p+=.25){let v=Math.floor(o+p);(ft(r.level,v,s)||ft(r.level,v,s+1))&&(a=!0),p<1&&je(r.level,v,s)==="spikes"&&(a=!0)}oi(r,o+(Math.abs(n.vx)<1?.8:.3),n.y)||(a=!0),r.hero.riding>=0&&r.platforms[r.hero.riding].spec.kind==="fall"&&(a=!0),l=a;for(let p of r.enemies){if(p.state!=="walk"&&p.state!=="slide"&&p.state!=="shell")continue;let v=p.body.x-p.body.w/2-o;v>0&&v<2.4&&p.body.y<n.y+n.h+.5&&p.body.y+p.body.h>n.y-.2&&(a=!0)}}let u=!1,c=!1;if(a&&e.held<0){let p=xp.find(v=>Il(r,v.run,v.hold));p?(u=!0,e.run=p.run,e.hold=p.hold):Il(r,kl.run,kl.hold)&&(e.run=!1,c=!0)}let h=!1;if(n.onGround&&!u&&e.held<0)if(e.run=!0,c)e.run=!1;else if(l)h=!0;else{let p=n.vx*n.vx/(2*ue.decel)+.6;for(let v=.3;v<=p&&!h&&(oi(r,o+v,n.y)||(h=!yp(r)),!!oi(r,o+v,n.y));v+=.25);}u?e.held=0:e.held>=0&&(e.held+=t);let m=e.held>=0&&e.held<e.hold;return(e.held>.5||e.held>.05&&n.vy<=0&&n.onGround)&&(e.held=-1),{left:!1,right:!h,run:e.run,jump:m,jumpPressed:u}}d(Nl,"botInput");var Ce={deadZone:1.2,lead:3,leadSpeed:9.5,above:2.4,followX:6,followY:3,climb:0,bandY:3.5,ahead:3.25,aheadShare:1.3,deadZoneShare:.3};function _p(e){return Math.min(Ce.ahead,e*Ce.aheadShare)}d(_p,"aheadFor");function Ul(e,r,t){let i=Math.max(e,t);return{x:i,y:r+Ce.above,lead:0,minX:i,goalY:r+Ce.above}}d(Ul,"makeCamera");function Ts(e,r,t,i,n,o=-1/0,s=1/0,a=.9,l=!1){let u=Math.max(-1,Math.min(1,r.vx/Ce.leadSpeed))*Ce.lead;e.lead+=(u-e.lead)*(1-Math.exp(-n*2));let c=r.x+e.lead,h=Math.min(Ce.deadZone,t*Ce.deadZoneShare),m=e.x;c>e.x+h?m=c-h:c<e.x-h&&(m=c+h),e.x+=(m-e.x)*(1-Math.exp(-n*Ce.followX)),e.x=Math.max(e.x,r.x+_p(t)-t);let p=Math.max(t,i-t);l&&(e.minX=Math.min(e.minX,e.x)),e.minX=Math.max(e.minX,Math.min(e.x,p)),e.x=Math.min(p,Math.max(e.minX,t,e.x));let v=Math.max(o,r.y+Ce.climb);(r.onGround||Math.abs(v-e.goalY)>Ce.bandY)&&(e.goalY=v),e.y+=(e.goalY-e.y)*(1-Math.exp(-n*Ce.followY));let f=r.y+a-(e.y+s);f>0&&(e.y+=f,e.goalY=Math.max(e.goalY,e.y))}d(Ts,"followHero");var Ol={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",Space:"jump",ArrowUp:"jump",KeyW:"jump",KeyK:"jump",ShiftLeft:"run",ShiftRight:"run",KeyJ:"run"},Ss=class Ss{constructor(r=()=>{}){this.onAnyInput=r;this.keys=new Set;this.touch=new Map;this.pressed=!1;this.override=null;window.addEventListener("keydown",t=>{let i=Ol[t.code];i&&(t.preventDefault(),this.onAnyInput(),i==="jump"&&!t.repeat&&!this.held("jump")&&(this.pressed=!0),this.keys.add(t.code))}),window.addEventListener("keyup",t=>this.keys.delete(t.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.touch.clear()})}bindTouch(r,t,i){let n=d(c=>{let h=r.getBoundingClientRect();return c.clientX<h.left+h.width/2?"left":"right"},"padSide");r.addEventListener("pointerdown",c=>{c.preventDefault(),r.setPointerCapture(c.pointerId),this.onAnyInput();let h=n(c);r.dataset.side=h,this.touch.set(c.pointerId,[h])}),r.addEventListener("pointermove",c=>{if(!this.touch.has(c.pointerId))return;let h=n(c);r.dataset.side=h,this.touch.set(c.pointerId,[h])});let o=d(c=>{this.touch.delete(c.pointerId),delete r.dataset.side},"padUp");r.addEventListener("pointerup",o),r.addEventListener("pointercancel",o);let s=10,a=d(c=>{for(let[h,m]of[[t,"jump"],[i,"run"]]){let p=h.getBoundingClientRect();if(c.clientX>=p.left-s&&c.clientX<=p.right+s&&c.clientY>=p.top-s&&c.clientY<=p.bottom+s)return m}return null},"over"),l=new Map,u=d(c=>{let h=a(c),m=this.touch.get(c.pointerId)??[],p=[];(h==="run"||l.get(c.pointerId))&&p.push("run"),h==="jump"&&(!m.includes("jump")&&!this.held("jump")&&(this.pressed=!0),p.push("jump")),this.touch.set(c.pointerId,p),this.showButtons(t,i)},"update");for(let c of[t,i]){c.addEventListener("pointerdown",m=>{m.preventDefault(),c.setPointerCapture(m.pointerId),this.onAnyInput(),l.set(m.pointerId,c===i),u(m)}),c.addEventListener("pointermove",m=>{this.touch.has(m.pointerId)&&u(m)});let h=d(m=>{this.touch.delete(m.pointerId),l.delete(m.pointerId),this.showButtons(t,i)},"up");c.addEventListener("pointerup",h),c.addEventListener("pointercancel",h)}}showButtons(r,t){r.classList.toggle("down",this.held("jump")),t.classList.toggle("down",this.held("run"))}held(r){for(let t of this.keys)if(Ol[t]===r)return!0;for(let t of this.touch.values())if(t.includes(r))return!0;return!1}read(){if(this.override){let t={...this.override};return this.override.jumpPressed=!1,t}let r={left:this.held("left"),right:this.held("right"),jump:this.held("jump")||this.pressed,jumpPressed:this.pressed,run:this.held("run")};return this.pressed=!1,r}clear(){this.keys.clear(),this.touch.clear(),this.pressed=!1}};d(Ss,"Controls");var Dn=Ss;var Es=16;function bt(e,r,...t){let i=Array(Es).fill("");for(let n of t){let o=n.split(`
`).map(l=>l.trim()).filter(l=>l.length);if(o.length>Es)throw new Error(`${e}: a piece is ${o.length} rows high`);let s=Math.max(...o.map(l=>l.length));[...Array(Es-o.length).fill(""),...o].map(l=>l.padEnd(s,".")).forEach((l,u)=>{i[u]+=l})}return{name:e,theme:r,rows:i}}d(bt,"level");var Cr=`
  ..........XX
  .........XXX
  ........XXXX
  .......XXXXX
  ......XXXXXX
  .....XXXXXXX........F.....
  ##########################
  ##########################`,As=d((e,r=!1)=>{let t=["H.....................GG...................","H.....................GG...................","H.....................GG.........XX........","H.....................GG........XXX........","H.....................GG.......XXXX........","H............M........GG......XXXXX.....F..","###########################################","###########################################"];return[...r?[...Array(3).fill("X".repeat(t[0].length)),...Array(3).fill(".".repeat(t[0].length))]:[],...t].map(n=>n.replace(/#/g,e)).join(`
`)},"arena"),wp=bt("Prado 1 \xB7 Primeiros passos","meadow",`
  ..........B!B?B...
  ..................
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  .............oooo.......X......
  ........................X......
  ...........X..........X.X......
  .......X...X.....g....X.X...g..
  ###############################
  ###############################`,`
  .......$.............
  .....................
  .....................
  .....................
  ......===............
  ..............o.o.o..
  ##..........#########
  ##..........#########`,`
  ...........B?B?B.........
  .........................
  .........................
  .......................XX
  .......k..............XXX
  ######################XXX
  ######################XXX`,`
  ..................oooo.........
  .....----===----...............
  ......................C........
  ##.................############
  ##.................############`,`
  ..BB$BB.................................
  ..BBBBB.................................
  ........................................
  ........................................
  ...B?B!B................X...............
  ........................X......X........
  ..................g..g..X......X.oooo...
  ########################################
  ########################################`,`
  ........ooo........
  .......~~~~~.......
  ...................
  ...................
  ...................
  ##.................##
  ##.................##`,`
  ...........$.....
  .........XXXXX...
  .................
  .................
  .................
  .....XX.....g....
  #################
  #################`,Cr),Mp=bt("Prado 2 \xB7 Colinas","meadow",`
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  ..............ooo.........
  .............XXXXX........
  ...........XXXXXXXXX......
  .........XXXXXXXXXXXXX....
  ..g.....XXXXXXXXXXXXXXX...
  ##########################
  ##########################`,`
  .....oo.....oo.....oo.....
  ....~~~~...~~~~...~~~~....
  ..........................
  ##......................##
  ##......................##`,`
  ..........$...........
  ..........X...........
  ......................
  ......................
  .......B!B?B..........
  ......................
  ......................
  ...k..........g...g...
  ######################
  ######################`,`
  .........oooo...........
  ......----====----......
  ........................
  ##....................##
  ##....................##`,`
  ...........................
  ........XXX......XXX.......
  .....C..XXX^^^^^^XXX...v...
  ###########################
  ###########################`,`
  .$..........................
  .~~~........................
  ............................
  ............................
  ......~~~....~~~....~~~.....
  ............................
  ##........................##
  ##........................##`,`
  ...........................
  ....BBBBBBB................
  ...........................
  ...........................
  ....B?B*B?B................
  ...........................
  ...........................
  ........g..g..g.......k....
  ###########################
  ###########################`,`
  ........$......
  ....|..XXX.....
  ....|..........
  ....|..........
  ....|..........
  ....|..........
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ....|.XXXXXXXX.
  ###===XXXXXXXX#
  ###...XXXXXXXX#`,`
  ..........
  ##########
  ##########`,Cr),Tp=bt("Prado 3 \xB7 Rio das Pedras","meadow",`
  .........?............
  ......................
  ......................
  ...S.............k....
  ######################
  ######################`,`
  .................oo............
  ...oo..........----====-----...
  ..----====---..................
  ...............................
  ##.............................
  ##.............................`,`
  ............................
  ............................
  ............................
  ...........B!B..............
  ............................
  ............................
  ..........g...g....g........
  ############################
  ############################`,`
  ........$............
  ......XXXXX..........
  .....................
  .....................
  ...~~~..~~~..~~~.....
  .....................
  ##.................##
  ##.................##`,`
  .......XX....XX....XX.........
  .....C.XX^^^^XX^^^^XX...k.....
  ##############################
  ##############################`,`
  .........oooo........
  ....|...XXXXXX.......
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ....|................
  ##.===.............##
  ##.................##`,`
  .................................
  .........BB$BB...................
  .........BBBBB...................
  .................................
  .................................
  .........B?B?B......X............
  ....................X............
  ..............v.....X.....g......
  #################################
  #################################`,`
  ..........ooo..........
  .....----=====-------..
  .......................
  ##.....................##
  ##.....................##`,`
  .......$...........
  ......XXX..........
  ...................
  ...................
  .............g.....
  ###################
  ###################`,As("#")),me=d(e=>Array.from({length:3},()=>"X".repeat(e)).join(`
`),"roof"),Sp=bt("Cavernas 1 \xB7 Entrada","caves",`
  ${me(20)}
  ....................
  ....................
  ....................
  ....................
  ....................
  .........?.B!B......
  ....................
  ....................
  ...S................
  ####################
  ####################`,`
  ${me(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  .........X........X.....$X....
  ....g....X...^^...X.....XX....
  ##############################
  ##############################`,`
  ${me(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........oooo............
  ..........................
  ......~~~......~~~........
  ..........................
  ##......................##
  ##......................##`,`
  ${me(28)}
  ............................
  ............................
  ............................
  ............................
  ............................
  ........BBBBB...............
  ........B?B?B...............
  ............................
  ...C..k........g..........g.
  ############################
  ############################`,`
  ${me(24)}
  ........................
  ........................
  .........$..............
  ........................
  ........................
  ........................
  ......-----===----......
  ........................
  ........................
  ##....................##
  ##....................##`,`
  ${me(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ...................$..........
  .....XX....XX....XX...........
  .....XX....XX....XX...........
  .....XX^^^^XX^^^^XX...........
  ##############################
  ##############################`,Cr),Ep=bt("Cavernas 2 \xB7 Po\xE7o de Ametista","caves",`
  ${me(18)}
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ..................
  ...S..............
  ##################
  ##################`,`
  ${me(22)}
  ......................
  ......................
  ...........$..........
  ......|....XXXXXXXXX..
  ......|...............
  ......|...............
  ......|...............
  ......|...............
  ......|...............
  ##...===...###########
  ##.........###########`,`
  ${me(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ...........oooo.........
  ........................
  ......................g.
  ########################
  ########################`,`
  ${me(28)}
  ............................
  ............................
  ............................
  ............................
  ............................
  ............................
  ............................
  ....~~~...~~~...~~~...~~~...
  ............................
  ##........................##
  ##........................##`,`
  ${me(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  .......B!B?B..............
  ..........................
  ..........................
  ...C.....k.......g...g....
  ##########################
  ##########################`,`
  ${me(24)}
  ........................
  ........................
  ........................
  ...........$............
  .........XXXXX..........
  ........................
  ........................
  ........................
  ....XXX^^^XXX^^^XXX.....
  ########################
  ########################`,`
  ${me(26)}
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ..........................
  ......-----=====-----.....
  ..........................
  ##......................##
  ##......................##`,`
  ${me(26)}
  ..........................
  ..........................
  ..........................
  .......BB$BB..............
  .......BBBBB..............
  ..........................
  .......B?B?B..............
  ..........................
  .....................g....
  ##########################
  ##########################`,Cr),Ap=bt("Cavernas 3 \xB7 Cora\xE7\xE3o de Cristal","caves",`
  ${me(20)}
  ....................
  ....................
  ....................
  ....................
  ....................
  ......B!B...........
  ....................
  ....................
  ...S................
  ####################
  ####################`,`
  ${me(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ........................
  ..~~~..~~~..~~~..~~~....
  ........................
  ##....................##
  ##....................##`,`
  ${me(30)}
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  ..............................
  .......XX.........XX..........
  .......XX.........XX..........
  ...g...XX..^^^^...XX...k......
  ##############################
  ##############################`,`
  ${me(26)}
  ..........................
  ..........................
  ..........................
  .........$................
  ........XXX...............
  ..........................
  ..........................
  ....----===----------.....
  ..........................
  ##......................##
  ##......................##`,`
  ${me(24)}
  ........................
  ........................
  ........................
  ........................
  ......B?B*B?B...........
  ........................
  ........................
  ........................
  ...C..g..g......g.......
  ########################
  ########################`,`
  ${me(22)}
  ......................
  ......................
  ...........$..........
  .....|..XXXXXXXXXXX...
  .....|..X.............
  .....|..X.............
  .....|..X.............
  .....|..X.............
  .....|..X.............
  ##..===.X...........##
  ##......X...........##`,`
  ${me(22)}
  ......................
  ......................
  ......................
  ......................
  ...........$..........
  ......................
  ......................
  ..~~~...~~~...~~~.....
  ......................
  ##..................##
  ##..................##`,`
  ${me(24)}
  ........................
  ........................
  ........................
  ........................
  ........................
  ......ooo...............
  .....XXXXX..............
  ........................
  ..........g.......g.....
  ########################
  ########################`,As("#",!0)),Rp=bt("Nuvens 1 \xB7 Cais A\xE9reo","clouds",`
  ...................
  ..........B!B?B....
  ...................
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  ...oooo..................
  .----====--------........
  .........................
  ...................XXXXXX
  ...................XXXXXX`,`
  ......$..................
  .........................
  .........................
  ......XX.................
  .........................
  ...g.........g..........k
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...........................
  ....~~~....~~~....~~~......
  ...........................
  XX.......................XX
  XX.......................XX`,`
  .........................
  .........................
  .........................
  .......B?B?B.............
  .........................
  .........................
  ..C..v.........g.....g...
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,`
  .......................
  ..........$............
  ......|..XXXXXXXXXXXXXX
  ......|................
  ......|................
  ......|................
  ......|................
  ......|................
  ....===................
  .......................`,`
  ......................
  ...BBBBB..............
  ...BB$BB..............
  ......................
  ...B?B?B..............
  ......................
  ......................
  .............g........
  XXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXX`,Cr.replace(/#/g,"X")),Cp=bt("Nuvens 2 \xB7 Linha de Montagem","clouds",`
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  .oo...................oo.......
  ..................-------===...
  .===----------.................
  ...............................
  ...............................
  ...............................`,`
  ..........................
  ......B!B?B...............
  ..........................
  ..........................
  ..........................
  ..k........g.....g........
  XXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ............$...............
  ...........XXX..............
  ............................
  ............................
  ...~~...~~...~~...~~..~~....
  ............................
  ............................
  ............................`,`
  ........................
  ..C.......X^^^X...g.....
  XXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXX`,`
  .......................
  ...........$...........
  ....|..XXXXXXXXXX......
  ....|..................
  ....|..................
  ....|..................
  ....|..................
  ....|..................
  ...===.................
  .......................`,`
  .............................
  .......B?B*B?B...............
  .............................
  .............................
  .............................
  ................g.........g..
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...............ooo........
  ..-------=====---------...
  ..........................
  ....................$.....
  ...................XXX....`,Cr.replace(/#/g,"X")),Lp=bt("Nuvens 3 \xB7 Torre do Vento","clouds",`
  ...................
  ........B!B........
  ...................
  ...................
  ...................
  ...S...............
  XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXX`,`
  ...........................
  ..~~..~~..~~..~~..~~..~~...
  ...........................
  ...........................
  ...........................`,`
  ..........................
  ..........................
  ........g.....v.......g...
  XXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ...$.....................
  ..XXX....................
  .........................
  .........................
  ..----===-------------...
  .........................
  .........................
  .........................`,`
  ............................
  ......B?B*B?B...............
  ............................
  ............................
  ............................
  ..C....g..g.........X^^X....
  XXXXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXXXX`,`
  ............................
  ...........$................
  ......|..XXXXXXXXXXXXX......
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.....................
  ......|.................XXXX
  ......|.................XXXX
  ....===.................XXXX
  ........................XXXX`,`
  ........................
  ..~~~...~~~...~~~...~~~.
  ........................
  ........................
  ........................`,`
  .........................
  ..BBBBB..................
  ..BB$BB..................
  .........................
  ..B?B?B..................
  .........................
  .........................
  .........g.....g.........
  XXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXX`,As("X")),Rs=[{name:"Prado Verde",theme:"meadow",levels:[wp,Mp,Tp]},{name:"Cavernas de Cristal",theme:"caves",levels:[Sp,Ep,Ap]},{name:"F\xE1brica nas Nuvens",theme:"clouds",levels:[Rp,Cp,Lp]}],it=Rs.flatMap(e=>e.levels);var tr={meadow:{sky:["#3d8ff0","#9fd2ff","#e4f4ff"],clear:[.6,.82,1],top:["#5fbf3c","#74d24c","#4aa22e"],earth:["#7a5130","#8c6038","#69452a"],deep:[.36,.23,.14],block:["#8f96a8","#b4bccd","#656b7a","#7d8496"],blockMark:null,ambient:[.55,.58,.66],sun:[1,.96,.88],scenery:"hills",far:[.48,.72,.62],near:[.36,.7,.38],mover:[.95,.75,.2],faller:[.78,.5,.3],page:"#9fd2ff"},caves:{sky:["#000000","#04020b","#0c0619"],clear:[.08,.05,.15],top:["#3fd6c8","#8ff5ea","#259a92"],earth:["#3b2f55","#4a3c69","#2c2340"],deep:[.16,.12,.24],block:["#6a4fa3","#957ad0","#432f6e","#5a4290"],blockMark:"#c9a8ff",ambient:[.42,.36,.6],sun:[.7,.75,1],scenery:"crystals",far:[.42,.22,.75],near:[.16,.7,.68],mover:[.35,.9,.85],faller:[.62,.42,.85],page:"#1f1238"},clouds:{sky:["#ff7e6b","#ffb88a","#ffe9c7"],clear:[1,.8,.65],top:["#9aa6ba","#c3ccdb","#6e7a8e"],earth:["#59637a","#6a758e","#475066"],deep:[.95,.9,.92],block:["#8e9bb3","#c0cadb","#5d6880","#f2b134"],blockMark:"#3a4152",ambient:[.66,.58,.6],sun:[1,.86,.72],scenery:"clouds",far:[.98,.93,.95],near:[1,1,1],mover:[.95,.6,.2],faller:[.85,.85,.9],page:"#ffb88a"}};var Wl=[{name:"Hips",parent:null,offset:[0,.2,0]},{name:"Body",parent:"Hips",offset:[0,0,0]},{name:"Antenna",parent:"Body",offset:[0,.64,0]},{name:"ArmR",parent:"Body",offset:[.4,.25,0]},{name:"HandR",parent:"ArmR",offset:[0,-.2,0]},{name:"ArmL",parent:"Body",offset:[-.4,.25,0]},{name:"HandL",parent:"ArmL",offset:[0,-.2,0]},{name:"LegR",parent:"Hips",offset:[.14,0,0]},{name:"FootR",parent:"LegR",offset:[0,-.15,0]},{name:"LegL",parent:"Hips",offset:[-.14,0,0]},{name:"FootL",parent:"LegL",offset:[0,-.15,0]}],In={Idle:!0,Run:!0,Jump:!1,Fall:!1,Die:!1,Victory:!0},Xp=6;function Hl(e="Bit"){let r=new _e(e),t=new Map;for(let n of Wl){let o=new _e(n.name);o.transform.setParent((n.parent?t.get(n.parent):r).transform),o.transform.setLocalPosition(n.offset[0],n.offset[1],n.offset[2]),t.set(n.name,o)}let i=new Zt;i.playOnStart=!1,r.addBehaviour(i);for(let n of Np())i.addClip(n);return{root:r,bones:t,animator:i}}d(Hl,"buildBit");var kn={ArmR:[0,0,.35],ArmL:[0,0,-.35]},Pp=[{t:0,hips:[0,.2,0],rot:{...kn,Antenna:[0,0,.08]}},{t:.8,hips:[0,.185,0],rot:{ArmR:[0,0,.45],ArmL:[0,0,-.45],Body:[.03,0,0],Antenna:[0,0,-.08]}},{t:1.6,hips:[0,.2,0],rot:{...kn,Antenna:[0,0,.08]}}],Cs=d((e,r)=>({t:r,hips:[0,.2,0],rot:{Body:[.18,0,0],Antenna:[.35,0,0],LegR:[-.85*e,0,0],FootR:[.3*e,0,0],LegL:[.85*e,0,0],FootL:[-.3*e,0,0],ArmR:[.9*e,0,.4],ArmL:[-.9*e,0,-.4]}}),"stride"),Gl=d(e=>({t:e,hips:[0,.25,0],rot:{Body:[.16,0,0],Antenna:[.25,0,0],LegR:[0,0,0],FootR:[.4,0,0],LegL:[0,0,0],FootL:[.4,0,0],ArmR:[0,0,.4],ArmL:[0,0,-.4]}}),"passing"),Bp=[Cs(1,0),Gl(.125),Cs(-1,.25),Gl(.375),Cs(1,.5)],Jl={Body:[-.1,0,0],Antenna:[-.4,0,0],ArmR:[-.3,0,2.3],ArmL:[-.3,0,-2.3],HandR:[0,0,.3],HandL:[0,0,-.3],LegR:[-.7,0,0],FootR:[1.1,0,0],LegL:[-.3,0,0],FootL:[.8,0,0]},Dp=[{t:0,hips:[0,.2,0],rot:kn},{t:.15,hips:[0,.22,0],rot:Jl}],kp=[{t:0,hips:[0,.22,0],rot:Jl},{t:.3,hips:[0,.2,0],rot:{Body:[.05,0,0],Antenna:[-.6,0,0],ArmR:[0,0,1.35],ArmL:[0,0,-1.35],HandR:[0,0,-.4],HandL:[0,0,.4],LegR:[.2,0,.12],LegL:[-.2,0,-.12],FootR:[-.2,0,0],FootL:[.2,0,0]}}],Ip=[{t:0,hips:[0,.2,0],rot:kn},{t:.2,hips:[0,.2,0],rot:{Body:[-.25,0,0],Antenna:[-.8,0,.5],ArmR:[0,0,2.8],ArmL:[0,0,-2.8],LegR:[0,0,.4],LegL:[0,0,-.4]}}],Ls=d((e,r)=>({t:e,hips:[0,r?.32:.2,0],rot:{Body:[-.08,0,0],Antenna:[r?-.3:.2,0,0],ArmR:[0,0,r?2.9:2.4],HandR:[0,0,r?.5:-.4],ArmL:[0,0,-.3],LegR:r?[-.5,0,0]:[0,0,0],FootR:r?[.7,0,0]:[0,0,0],LegL:r?[-.5,0,0]:[0,0,0],FootL:r?[.7,0,0]:[0,0,0]}}),"wave"),Fp=[Ls(0,!1),Ls(.3,!0),Ls(.6,!1)];function zl(e,r,t){let i=0;for(;i<e.length-2&&e[i+1].t<=r;)i++;let n=e.length-1,o=e[i],s=e[Math.min(i+1,n)],a=i>0?e[i-1]:t?{t:o.t-(e[n].t-e[n-1].t),v:e[n-1].v}:o,l=i+2<=n?e[i+2]:t?{t:s.t+(e[1].t-e[0].t),v:e[1].v}:s,u=s.t>o.t?Math.min(1,Math.max(0,(r-o.t)/(s.t-o.t))):0,c=u*u,h=c*u;return o.v.map((m,p)=>{let v=a.v[p],f=s.v[p],g=l.v[p],b=s.t>a.t?(f-v)/(s.t-a.t)*(s.t-o.t):0,M=l.t>o.t?(g-m)/(l.t-o.t)*(s.t-o.t):0;return(2*h-3*c+1)*m+(h-2*c+u)*b+(-2*h+3*c)*f+(h-c)*M})}d(zl,"spline");var Vl=30;function Lr(e,r){let t=In[e],i=r[r.length-1].t,n=Math.round(i*Vl)+1,o=new Float32Array(n);for(let h=0;h<n;h++)o[h]=Math.min(i,h/Vl);let s=[],a=B.create(),l=180/Math.PI;for(let h of Wl){let m=r.map(v=>({t:v.t,v:v.rot[h.name]??[0,0,0]})),p=new Float32Array(n*4);for(let v=0;v<n;v++){let[f,g,b]=zl(m,o[v],t);B.fromEuler(a,f*l,g*l,b*l),p.set(a,v*4)}s.push({target:h.name,property:"rotation",times:o,values:p,interpolation:"LINEAR"})}let u=r.map(h=>({t:h.t,v:h.hips})),c=new Float32Array(n*3);for(let h=0;h<n;h++)c.set(zl(u,o[h],t),h*3);return s.unshift({target:"Hips",property:"translation",times:o,values:c,interpolation:"LINEAR"}),new St(e,s,i)}d(Lr,"clipFrom");function Np(){return[Lr("Idle",Pp),Lr("Run",Bp),Lr("Jump",Dp),Lr("Fall",kp),Lr("Die",Ip),Lr("Victory",Fp)]}d(Np,"bitClips");function ql(e){if(e.dead)return{clip:"Die",speed:1};if(e.won)return{clip:"Victory",speed:1};if(!e.onGround)return{clip:e.vy>0?"Jump":"Fall",speed:1};let r=Math.abs(e.vx);return r>.3?{clip:"Run",speed:Math.max(.6,r/Xp)}:{clip:"Idle",speed:1}}d(ql,"clipFor");var Xs=16,Fn={front:1.2,back:2.4};async function Le(e,r,t){let i=document.createElement("canvas");return i.width=r,i.height=r,t(i.getContext("2d"),r),H.for(e).getTexture(i.toDataURL("image/png"))}d(Le,"canvasTexture");async function F(e,r,t={}){let i=new Kt;return i.color=new y(r[0],r[1],r[2],1),i.mainTex=t.tex??await H.for(e).getTexture("builtin://white"),t.glow&&(i.emissiveTex=t.glow),i.specularStrength=t.specular??.08,i.roughness=t.roughness??.8,i}d(F,"material");function Q(e,r,t){let i=new _e(r);return t&&i.transform.setParent(t.transform),e.addEntity(i),i}d(Q,"makeEntity");function ce(e,r,t,i){let n=new Ut;n.meshData=t;let o=new Ye(e);o.mesh=n,o.shader=new mt(e,i),r.addBehaviour(o)}d(ce,"render");function Bt(e,r){let t=[],i=[],n=[],o=[];for(let{at:a,scale:l}of r){let u=t.length;e.vertices.forEach((c,h)=>{t.push([c[0]*l[0]+a[0],c[1]*l[1]+a[1],c[2]*l[2]+a[2]]);let m=e.normals[h]??[0,1,0],p=m[0]/l[0],v=m[1]/l[1],f=m[2]/l[2],g=Math.hypot(p,v,f)||1;i.push([p/g,v/g,f/g]),n.push(e.uvs[h]??[0,0])});for(let c of e.indices)o.push(u+c)}let s=new Z(t,i,n,o);return s.providedNormals=!0,s}d(Bt,"merge");function Up(e,r,t,i,n){let o=new Z([[e,r,n],[t,r,n],[t,i,n],[e,i,n]],[[0,0,1],[0,0,1],[0,0,1],[0,0,1]],[[0,1],[1,1],[1,0],[0,0]],[0,1,2,0,2,3]);return o.providedNormals=!0,o}d(Up,"quad");function Op(e,r,t){let i=je(e,r,t);return i==="ground"?je(e,r,t+1)==="ground"?"earth":"grass":i==="block"||i==="spikes"?i:null}d(Op,"partOf");async function Gp(e,r){let t=tr[r],i=await Le(e,64,(l,u)=>{l.fillStyle=t.top[0],l.fillRect(0,0,u,u),l.fillStyle=t.top[1];for(let c=0;c<10;c++)l.fillRect(c*23%60,c*13%60,6,3);l.fillStyle=t.top[2],l.fillRect(0,u-8,u,8)}),n=await Le(e,64,(l,u)=>{l.fillStyle=t.earth[0],l.fillRect(0,0,u,u),l.fillStyle=t.earth[1];for(let c=0;c<9;c++)l.fillRect(c*29%58,c*19%58,7,4);l.fillStyle=t.earth[2];for(let c=0;c<6;c++)l.fillRect((c*37+11)%58,(c*23+7)%58,5,3)}),o=await Le(e,64,(l,u)=>{let[c,h,m,p]=t.block;if(l.fillStyle=c,l.fillRect(0,0,u,u),l.fillStyle=h,l.fillRect(0,0,u,6),l.fillRect(0,0,6,u),l.fillStyle=m,l.fillRect(0,u-6,u,6),l.fillRect(u-6,0,6,u),l.fillStyle=p,l.fillRect(20,20,24,24),t.blockMark&&r==="caves")l.fillStyle=t.blockMark,l.beginPath(),l.moveTo(32,14),l.lineTo(42,32),l.lineTo(32,50),l.lineTo(22,32),l.closePath(),l.fill();else if(t.blockMark){l.fillStyle=t.blockMark;for(let[v,f]of[[11,11],[53,11],[11,53],[53,53]])l.beginPath(),l.arc(v,f,3,0,Math.PI*2),l.fill()}}),s=r==="caves"?await Le(e,64,(l,u)=>{l.fillStyle="#000",l.fillRect(0,0,u,u),l.fillStyle="#3a2a66",l.beginPath(),l.moveTo(32,14),l.lineTo(42,32),l.lineTo(32,50),l.lineTo(22,32),l.closePath(),l.fill()}):void 0,a=r==="caves"?await Le(e,4,(l,u)=>{l.fillStyle="#0d4a44",l.fillRect(0,0,u,u)}):void 0;return{grass:await F(e,[1,1,1],{tex:i,glow:a,specular:r==="caves"?.6:.08,roughness:r==="caves"?.3:.8}),earth:await F(e,[1,1,1],{tex:n}),deep:await F(e,t.deep,{specular:0}),block:await F(e,[1,1,1],{tex:o,glow:s,specular:r==="clouds"?.5:.2,roughness:r==="clouds"?.35:.8}),spikes:await F(e,[.78,.8,.86],{specular:.7,roughness:.25})}}d(Gp,"tileMaterials");async function Yl(e){let r=await Le(e,64,(s,a)=>{s.fillStyle="#c4643c",s.fillRect(0,0,a,a),s.strokeStyle="#8a3f22",s.lineWidth=4,s.strokeRect(2,2,a-4,a-4),s.beginPath(),s.moveTo(0,a/2),s.lineTo(a,a/2),s.moveTo(a/2,0),s.lineTo(a/2,a/2),s.moveTo(a/4,a/2),s.lineTo(a/4,a),s.moveTo(3*a/4,a/2),s.lineTo(3*a/4,a),s.stroke()}),t=d((s,a,l)=>{s.fillStyle=l?"#000":"#e8a91c",s.fillRect(0,0,a,a),l||(s.fillStyle="#ffd55a",s.fillRect(0,0,a,5),s.fillRect(0,0,5,a),s.fillStyle="#a86f0c",s.fillRect(0,a-5,a,5),s.fillRect(a-5,0,5,a)),s.fillStyle=l?"#7a5a10":"#fff3c4",s.beginPath(),s.moveTo(a/2,14),s.lineTo(a-16,a/2),s.lineTo(a/2,a-14),s.lineTo(16,a/2),s.closePath(),s.fill()},"bonusDraw"),i=await Le(e,64,(s,a)=>t(s,a,!1)),n=await Le(e,64,(s,a)=>t(s,a,!0)),o=await Le(e,64,(s,a)=>{s.fillStyle="#8a6a3e",s.fillRect(0,0,a,a),s.fillStyle="#a3825a",s.fillRect(0,0,a,5),s.fillRect(0,0,5,a),s.fillStyle="#65492a",s.fillRect(0,a-5,a,5),s.fillRect(a-5,0,5,a),s.fillStyle="#6f5432";for(let[l,u]of[[12,12],[46,12],[12,46],[46,46]])s.fillRect(l,u,6,6)});return{brick:await F(e,[1,1,1],{tex:r}),bonus:await F(e,[1,1,1],{tex:i,glow:n,specular:.4,roughness:.4}),used:await F(e,[1,1,1],{tex:o})}}d(Yl,"blockMaterials");function Ps(e=!1){let r=zp();if(!e)return r;let t=new Z(r.vertices.map(i=>[i[0],-i[1],i[2]]),r.normals.map(i=>[i[0],-i[1],i[2]]),r.uvs,r.indices.map((i,n,o)=>o[n-n%3+(2-n%3)]));return t.providedNormals=!0,t}d(Ps,"pyramid");function zp(){let e=[],r=[],t=[],i=[],n=[[-.5,.5],[.5,.5],[.5,-.5],[-.5,-.5]];for(let s=0;s<4;s++){let[a,l]=n[s],[u,c]=n[(s+1)%4],h=(a+u)/2,m=(l+c)/2,p=Math.hypot(h,.5,m),v=e.length;e.push([a,0,l],[u,0,c],[0,1,0]);for(let f=0;f<3;f++)r.push([h/p,.5/p,m/p]);t.push([0,1],[1,1],[.5,0]),i.push(v,v+1,v+2)}let o=new Z(e,r,t,i);return o.providedNormals=!0,o}d(zp,"pyramidUp");async function $l(e,r,t){let i=await Gp(e,t.theme),n=new be(1),o=Ps(),s=[];for(let l=0;l<t.width;l+=Xs){let u={grass:[],earth:[],deep:[],block:[],spikes:[]};for(let h=l;h<Math.min(t.width,l+Xs);h++)for(let m=0;m<t.height;m++){let p=Op(t,h,m);if(p)if(p==="grass"||p==="earth"){let v=Fn.front+Fn.back,f=(Fn.front-Fn.back)/2;u.earth.push({at:[h+.5,m+.5,f],scale:[1,1,v]}),p==="grass"&&u.grass.push({at:[h+.5,m+.88,f],scale:[1,.26,v+.06]}),m===0&&u.deep.push({at:[h+.5,-5,f],scale:[1,10,v]})}else if(p==="spikes")for(let v of[.18,.5,.82])for(let f of[-.25,.25])u.spikes.push({at:[h+v,m,f],scale:[.3,.6,.3]});else u[p].push({at:[h+.5,m+.5,0],scale:[1,1,1]})}let c=[];for(let h of Object.keys(u)){if(!u[h].length)continue;let m=Q(r,`${t.name} ${h} ${l}`);ce(e,m,Bt(h==="spikes"?o:n,u[h]),i[h]),c.push(m)}s.push({x0:l,parts:c})}let a=[];for(let l of t.platforms)l.track&&(l.track.axis==="x"?a.push({at:[(l.track.from+l.track.to+l.w)/2,l.y+.78,-.75],scale:[l.track.to-l.track.from+l.w,.08,.08]}):a.push({at:[l.x+l.w/2,(l.track.from+l.track.to)/2+.78,-.75],scale:[.08,l.track.to-l.track.from+.4,.08]}));return a.length&&ce(e,Q(r,"Rails"),Bt(n,a),await F(e,[.35,.36,.42],{specular:.6,roughness:.3})),{showAround(l,u){for(let c of s){let h=c.x0+Xs>l-u-2&&c.x0<l+u+2;for(let m of c.parts)m.show=h}},hide(){for(let l of s)for(let u of l.parts)u.show=!1}}}d($l,"dressLevel");function Pt(e,r){let t=Math.sin(e*12.9898+r*78.233)*43758.5453;return t-Math.floor(t)}d(Pt,"hash");async function jl(e,r,t,i="meadow"){let n=tr[i],o=await Le(e,128,(m,p)=>{let v=m.createLinearGradient(0,0,0,p);v.addColorStop(0,n.sky[0]),v.addColorStop(.65,n.sky[1]),v.addColorStop(1,n.sky[2]),m.fillStyle=v,m.fillRect(0,0,p,p)}),s=await Le(e,4,(m,p)=>{m.fillStyle="#000",m.fillRect(0,0,p,p)}),a=await F(e,[0,0,0],{tex:s,glow:o,specular:0});ce(e,Q(r,"Sky"),Up(-60,-30,t+60,60,-60),a);let l=d(async(m,p)=>Le(e,4,(v,f)=>{v.fillStyle=`rgb(${m.map(g=>Math.round(g*255*p)).join(",")})`,v.fillRect(0,0,f,f)}),"glowOf"),u=new $e(1,24,12);if(n.scenery==="hills"){let m=await F(e,n.far,{specular:0}),p=await F(e,n.near,{specular:0}),v=d((f,g,b,M)=>{let _=[];for(let w=-20,S=0;w<t+40;w+=g,S++){let T=b*(.7+.6*Pt(S,M));_.push({at:[w,-T*.35,f],scale:[T*1.6,T,T]})}return Bt(u,_)},"hills");ce(e,Q(r,"Far hills"),v(-40,26,14,1),m),ce(e,Q(r,"Near hills"),v(-18,15,6,7),p)}else if(n.scenery==="crystals"){let m=Ps(),p=await F(e,n.far,{glow:await l(n.far,.22),specular:.9,roughness:.15}),v=await F(e,n.near,{glow:await l(n.near,.2),specular:.9,roughness:.15}),f=await F(e,[.2,.15,.3],{specular:.1}),g=d((M,_,w,S)=>{let T=[];for(let C=-20,I=0;C<t+40;C+=_,I++)for(let k=0;k<3;k++){let D=w*(.5+Pt(I*3+k,S));T.push({at:[C+(k-1)*w*.35,-.5,M+k*.5],scale:[D*.28,D,D*.28]})}return Bt(m,T)},"cluster");ce(e,Q(r,"Far crystals"),g(-30,17,9,2),p),ce(e,Q(r,"Near crystals"),g(-12,11,3.5,5),v);let b=[];for(let M=-20,_=0;M<t+40;M+=4,_++){let w=2+5*Pt(_,9);b.push({at:[M,22,-24-6*Pt(_,3)],scale:[w*.35,w,w*.35]})}ce(e,Q(r,"Stalactites"),Bt(Ps(!0),b),f)}else{let m=await F(e,n.far,{glow:await l([1,.75,.7],.35),specular:0}),p=await F(e,n.near,{glow:await l([1,.9,.85],.3),specular:0}),v=d((_,w,S,T,C,I)=>{let k=[];for(let D=-30,V=0;D<t+50;D+=w,V++){let $=T+C*Pt(V,I);for(let J=0;J<4;J++){let N=S*(.55+.45*Pt(V*4+J,I+1));k.push({at:[D+(J-1.5)*S*.8,$+J%2*S*.25,_],scale:[N*1.3,N*.8,N]})}}return Bt(u,k)},"puffs");ce(e,Q(r,"Far clouds"),v(-45,30,7,4,16,1),m),ce(e,Q(r,"Cloud sea"),v(-8,6,3,-4.5,1.2,4),p),ce(e,Q(r,"Near clouds"),v(-16,22,3.5,9,6,7),p);let f=await F(e,[.62,.52,.6],{glow:await l([.9,.62,.6],.35),specular:.2}),g=await F(e,[1,.8,.4],{glow:await l([1,.75,.3],1),specular:0}),b=[],M=[];for(let _=0,w=0;_<t+40;_+=34,w++){let S=10+10*Pt(w,11),T=3+2*Pt(w,12);b.push({at:[_,S/2-8,-52],scale:[T,S,T]}),b.push({at:[_+T*.25,S-8+3,-52],scale:[.7,6,.7]});for(let C=0;C<3;C++)M.push({at:[_-T*.3+C*T*.3,S-8-1.5-C*2.5,-52+T/2+.05],scale:[.5,.5,.1]})}ce(e,Q(r,"Towers"),Bt(new be(1),b),f),ce(e,Q(r,"Tower lamps"),Bt(new be(1),M),g)}let c=new Be("Ambient light");c.color=new y(n.ambient[0],n.ambient[1],n.ambient[2],1),r.addEntity(c);let h=new Ct("Sun");h.color=new y(n.sun[0],n.sun[1],n.sun[2],1),h.transform.rotate(50,30,0),h.castShadows=!0,r.addEntity(h)}d(jl,"dressWorld");var Nn=7.3,si=1.2;async function Kl(e,r,t,i){let n=Q(r,"Goal");n.transform.setLocalPosition(t,i,0);let o=Q(r,"Pole",n);o.transform.setLocalPosition(0,4,0),o.transform.setLocalScale(.08,8,.08),ce(e,o,new be(1),await F(e,[.9,.92,.95],{specular:.5,roughness:.3}));let s=Q(r,"Pole top",n);s.transform.setLocalPosition(0,8.2,0),s.transform.setLocalScale(.25,.25,.25),ce(e,s,new $e(1,16,10),await F(e,[1,.8,.2],{specular:.6,roughness:.3}));let a=Q(r,"Flag",n);a.transform.setLocalPosition(-.7,Nn,0),a.transform.setLocalScale(1.3,.9,.05),ce(e,a,new be(1),await F(e,[.15,.85,.75]));let l=Q(r,"Pole base",n);return l.transform.setLocalPosition(0,.5,0),ce(e,l,new be(1),await F(e,[.56,.6,.68])),{setFlag(u){a.transform.setLocalPosition(-.7,si+(Nn-si)*u,0)}}}d(Kl,"dressGoal");async function Ql(e,r){let t=Q(r,"Hero"),i=Hl("Bit");i.root.transform.setParent(t.transform),r.addEntity(i.root);for(let w of i.bones.values())r.addEntity(w);let n=d(w=>i.bones.get(w),"bone"),o=new $e(1,24,14),s=[],a=d((w,S,T,C,I,k)=>{let D=Q(r,w,S);return D.transform.setLocalPosition(T[0],T[1],T[2]),D.transform.setLocalScale(C[0],C[1],C[2]),ce(e,D,I,k),s.push(D),D},"part"),l=await F(e,[.95,.96,1],{specular:.6,roughness:.25}),u=await F(e,[.15,.85,.75],{specular:.3}),c=await F(e,[.06,.08,.14],{specular:.9,roughness:.1}),h=await Le(e,4,(w,S)=>{w.fillStyle="#5ff",w.fillRect(0,0,S,S)}),m=await F(e,[.4,1,1],{glow:h,specular:0}),p=await F(e,[.6,.62,.7],{specular:.4}),v=await F(e,[1,.3,.45],{glow:h,specular:0}),f=await F(e,[.25,.27,.35],{specular:.3}),g=n("Body");a("Shell",g,[0,.27,0],[.4,.4,.4],o,l),a("Band",g,[0,.2,0],[.42,.06,.42],o,u),a("Visor",g,[0,.35,.22],[.27,.16,.2],o,c);for(let w of[-1,1])a("Eye",g,[w*.09,.37,.39],[.04,.06,.03],o,m);a("Antenna stalk",n("Antenna"),[0,.12,0],[.025,.12,.025],new be(2),p),a("Antenna tip",n("Antenna"),[0,.26,0],[.06,.06,.06],o,v);for(let w of["R","L"])a("Arm",n(`Arm${w}`),[0,-.09,0],[.05,.12,.05],o,p),a("Hand",n(`Hand${w}`),[0,-.03,0],[.095,.095,.095],o,l),a("Leg",n(`Leg${w}`),[0,-.07,0],[.04,.08,.04],o,p),a("Foot",n(`Foot${w}`),[0,0,.04],[.12,.065,.16],o,f);let b="",M=[.15,.85,.75],_=[1,.5,.12];return{place(w,S,T,C,I){t.transform.setLocalPosition(w,S,0),t.transform.setLocalRotation(0,T,0);let k=I/Math.sqrt(C);t.transform.setLocalScale(k,I*C,k)},animate(w,S){i.animator.speed=S,w!==b&&(b?i.animator.crossFade(w,.12,{loop:In[w]}):i.animator.play(w,{loop:In[w]}),b=w)},tint(w,S,T){let C=w==="spark"?_:M;if(u.color.r=C[0],u.color.g=C[1],u.color.b=C[2],S>0){let I=T*(S<2?2:5)%1,k=d(D=>.55+.45*Math.cos(2*Math.PI*(I+D)),"c");l.color.r=k(0),l.color.g=k(1/3),l.color.b=k(2/3)}else l.color.r=.95,l.color.g=.96,l.color.b=1},setVisible(w){for(let S of s)S.show=w}}}d(Ql,"dressHero");function Dt(e,r){let t=Q(e,r),i=[];return{root:t,parts:i,add(n,o,s,a,l,u=t){let c=Q(e,`${r} part`,u);return c.transform.setLocalPosition(a[0],a[1],a[2]),c.transform.setLocalScale(l[0],l[1],l[2]),ce(n,c,o,s),i.push({e:c,at:a,scale:l}),c},show(n){for(let o of i)o.e.show=n}}}d(Dt,"group");function Zl(e=.35){let r=[],t=[],i=[],n=[],o=[];for(let a=0;a<10;a++){let l=Math.PI/2+a*Math.PI/5,u=a%2?.22:.5;o.push([Math.cos(l)*u,Math.sin(l)*u])}for(let a of[1,-1]){let l=r.length;r.push([0,0,a*e/2]),t.push([0,0,a]),i.push([.5,.5]);for(let[u,c]of o)r.push([u,c,a*e/2]),t.push([0,0,a]),i.push([u+.5,.5-c]);for(let u=0;u<10;u++){let c=l+1+u,h=l+1+(u+1)%10;a>0?n.push(l,c,h):n.push(l,h,c)}}for(let a=0;a<10;a++){let[l,u]=o[a],[c,h]=o[(a+1)%10],m=h-u,p=-(c-l),v=Math.hypot(m,p),f=r.length;for(let[g,b,M]of[[l,u,e/2],[c,h,e/2],[c,h,-e/2],[l,u,-e/2]])r.push([g,b,M]),t.push([m/v,p/v,0]),i.push([0,0]);n.push(f,f+2,f+1,f,f+3,f+2)}let s=new Z(r,t,i,n);return s.providedNormals=!0,s}d(Zl,"starMesh");async function ec(e,r,t){let i=t.level,n=new be(1),o=new $e(1,20,12),s=await Yl(e),a=d(async A=>Le(e,4,(P,L)=>{P.fillStyle=A,P.fillRect(0,0,L,L)}),"glow"),l=new Map;for(let A=0;A<i.width;A++)for(let P=0;P<i.height;P++){let L=i.tiles[A][P];if(L!=="brick"&&L!=="bonus"&&L!=="power"&&L!=="star")continue;let O={};for(let R of L==="brick"?["brick"]:["bonus","used"]){let X=Q(r,`${R} ${A},${P}`);X.transform.setLocalPosition(A+.5,P+.5,0),ce(e,X,n,s[R]),O[R]=X}l.set(`${A},${P}`,{x:A,y:P,looks:O,hop:0})}let u=await F(e,[1,.78,.18],{glow:await a("#5a3f00"),specular:.9,roughness:.2}),c=new $e(1,18,10),h=d(A=>{let P=Q(r,A);return ce(e,P,c,u),P.transform.setLocalScale(.32,.32,.07),P},"coinLook"),m=t.coins.map((A,P)=>h(`Coin ${P}`)),p=[],v=Array.from({length:4},(A,P)=>h(`Coin pop ${P}`));for(let A of v)A.show=!1;let f=await F(e,[1,.72,.12],{glow:await a("#6a4400"),specular:1,roughness:.15}),g=await F(e,[1,.95,.6],{glow:await a("#a08020"),specular:.6,roughness:.2}),b=Zl(.06),M=t.bigCoins.map((A,P)=>{let L=Dt(r,`Big coin ${P}`),O=Q(r,"Big coin spin",L.root);L.add(e,c,f,[0,0,0],[.46,.46,.1],O);for(let R of[.08,-.08])L.add(e,b,g,[0,0,R],[.5,.5,1],O);return{g:L,spin:O}}),_=tr[i.theme],w=await F(e,_.mover,{specular:.6,roughness:.3}),S=await F(e,_.faller,{specular:.2}),T=await F(e,[.25,.26,.32],{specular:.5,roughness:.3}),C=await F(e,[.2,.14,.12],{specular:0}),I=t.platforms.map((A,P)=>{let L=Dt(r,`Platform ${P}`),O=Ar.thick,R=A.spec.kind==="fall";L.add(e,n,R?S:w,[0,0,0],[A.w-.04,O,1.3]);for(let X of[-1,1])L.add(e,n,T,[X*(A.w/2-.08),0,0],[.14,O+.04,1.34]);if(R)for(let X=1;X<A.w;X++)L.add(e,n,C,[-A.w/2+X+.1*(X%2?1:-1),0,.66],[.05,O*.8,.02]);return L}),k=await F(e,[1,.3,.6],{glow:await a("#a01450"),specular:.6,roughness:.3}),D=await F(e,[.3,.3,.38],{specular:.6,roughness:.3}),V=[...t.backGates];for(let A=0;A<i.width;A++)for(let P=0;P<i.height;P++)i.tiles[A][P]==="gate"&&V.push({x:A,y:P});let $=V.map((A,P)=>{let L=Dt(r,`Gate ${P}`);L.root.transform.setLocalPosition(A.x+.5,A.y,0);for(let O of[-.3,0,.3])L.add(e,n,k,[O,.5,0],[.09,1,.09]);return L.add(e,n,D,[0,.03,0],[1,.06,.4]),L.show(!1),{look:L,...A}}),J=t.boss?await Vp(e,r,t.boss,n,o,a):null,N=await F(e,[.62,.32,.9],{specular:.5,roughness:.35}),xe=await F(e,[1,1,1],{specular:.2}),Ge=await F(e,[.05,.05,.08],{specular:.6,roughness:.2}),It=await F(e,[.95,.38,.18],{specular:.7,roughness:.25}),pi=await F(e,[1,.85,.35],{specular:.3}),Ft=await F(e,[.18,.15,.2],{specular:.3}),yc=await F(e,[1,.82,.15],{specular:.5,roughness:.3}),_c=await F(e,[.75,.92,1],{glow:await a("#2a4a5a"),specular:.9,roughness:.1}),Ys=t.enemies.map(A=>{let P=Dt(r,`${A.kind} ${A.id}`),L=Q(r,`${A.kind} ${A.id} body`,P.root),O=[],R=[];if(A.kind==="walker"){P.add(e,o,N,[0,.36,0],[.42,.36,.4],L);for(let X of[-1,1])P.add(e,o,xe,[X*.13,.46,.33],[.1,.12,.06],L),P.add(e,o,Ge,[X*.12,.45,.38],[.05,.07,.03],L),P.add(e,n,Ge,[X*.13,.6,.35],[.16,.035,.03],L).transform.setLocalRotation(0,0,X*-18),O.push(P.add(e,o,Ft,[X*.2,.05,.05],[.12,.06,.16],L))}else if(A.kind==="shell"){P.add(e,o,It,[0,.38,0],[.42,.34,.38],L);for(let[W,Ie]of[[-.18,.55],[.15,.6],[0,.42],[.25,.4],[-.27,.36]])P.add(e,o,pi,[W,Ie,.3],[.07,.07,.05],L);P.add(e,n,Ft,[0,.1,0],[.7,.08,.6],L);let X=P.add(e,o,Ft,[.42,.32,.08],[.18,.16,.16],L);O.push(X);for(let W of[-1,1]){O.push(P.add(e,o,xe,[.52,.38,.08+W*.08],[.05,.06,.04],L));for(let Ie of[-.18,.18])O.push(P.add(e,n,Ft,[W*.2,.05,Ie],[.06,.12,.06],L))}}else{P.add(e,o,yc,[0,.35,0],[.34,.3,.3],L),P.add(e,o,Ge,[0,.35,0],[.345,.08,.305],L),P.add(e,o,Ge,[0,.18,0],[.2,.08,.2],L);for(let X of[-1,1])P.add(e,o,xe,[X*.11,.45,.24],[.08,.1,.05],L),P.add(e,o,Ge,[X*.11,.45,.28],[.04,.05,.025],L);for(let X of[-1,1]){let W=Q(r,"wing pivot",L);W.transform.setLocalPosition(X*.12,.62,-.05),P.add(e,o,_c,[X*.2,.12,0],[.24,.12,.03],W),R.push(W)}}return{g:P,body:L,extra:O,wings:R}}),$s=await F(e,[.85,.87,.9],{specular:.5}),wc=await F(e,[.55,.57,.62]),Mc=await F(e,[.15,.85,.75],{glow:await a("#0a4a40")}),js=t.checkpoints.map((A,P)=>{let L=Dt(r,`Checkpoint ${P}`);L.root.transform.setLocalPosition(A.x,A.y,-.6),L.add(e,n,$s,[0,1.1,0],[.08,2.2,.08]),L.add(e,o,$s,[0,2.25,0],[.1,.1,.1]);let O=L.add(e,n,wc,[.35,1.9,0],[.6,.4,.04]),R=L.add(e,n,Mc,[.35,1.9,0],[.6,.4,.04]);return{g:L,cp:A,off:O,on:R}}),Tc=await a("#0b5a50"),Sc=await F(e,[.15,.85,.75],{glow:Tc,specular:.6,roughness:.3}),fi=await F(e,[.82,.85,.9],{specular:.8,roughness:.25}),Ec=await F(e,[1,.9,.3],{glow:await a("#806000"),specular:.2}),Ac=await F(e,[1,.45,.15],{specular:.7,roughness:.25}),Ks=await F(e,[1,.85,.3],{glow:await a("#ff9a20"),specular:0}),Rc=await F(e,[1,.88,.25],{glow:await a("#7a5a00"),specular:.9,roughness:.2}),Cc=Zl(),Jn=d((A,P)=>{let L=Dt(r,`${A} ${P}`),O=Q(r,`${A} spin`,L.root),R;if(A==="battery")L.add(e,n,Sc,[0,.33,0],[.38,.5,.38],O),L.add(e,n,fi,[0,.62,0],[.18,.08,.18],O),L.add(e,n,fi,[0,.09,0],[.4,.04,.4],O),L.add(e,n,Ec,[0,.36,.2],[.08,.28,.02],O).transform.setLocalRotation(0,0,20);else if(A==="thruster"){L.add(e,o,Ac,[0,.42,0],[.18,.3,.18],O),L.add(e,o,fi,[0,.62,0],[.1,.12,.1],O);for(let X of[-1,1])L.add(e,n,fi,[X*.17,.2,0],[.12,.2,.04],O);R=L.add(e,o,Ks,[0,.08,0],[.1,.16,.1],O)}else{L.add(e,Cc,Rc,[0,.38,0],[.75,.75,.75],O);for(let X of[-1,1])L.add(e,o,Ge,[X*.07,.42,.13],[.03,.06,.02],O)}return L.show(!1),{g:L,spin:O,flame:R}},"itemLook"),Dr={battery:[0,1,2].map(A=>Jn("battery",A)),thruster:[0,1,2].map(A=>Jn("thruster",A)),star:[0,1].map(A=>Jn("star",A))},Lc=await F(e,[1,.75,.25],{glow:await a("#ffb040"),specular:0}),Qs=Array.from({length:2},(A,P)=>{let L=Dt(r,`Spark ${P}`);return L.add(e,o,Lc,[0,0,0],[.16,.16,.16]),L.add(e,o,Ks,[0,0,0],[.26,.08,.08]),L.show(!1),L}),Zs=Array.from({length:12},(A,P)=>{let L=Q(r,`Brick bit ${P}`);return ce(e,L,n,s.brick),L.transform.setLocalScale(.4,.4,.4),L.show=!1,L}),Nt=[],ze=0,kr=d((A,P)=>A>P.left-2&&A<P.right+2,"near"),Xc=d((A,P)=>{let L=P.body,O=P.state!=="gone"&&P.state!=="asleep";if(A.g.show(O),!O)return;A.g.root.transform.setLocalPosition(L.x,L.y,0);let R=P.dir<0?-55:55,X=1,W=0,Ie=0;P.state==="squashed"&&(X=.25),P.state==="out"&&(W=180,Ie=L.h),P.kind==="walker"&&P.state==="walk"&&(X=1+Math.sin(P.time*14)*.06),A.g.root.transform.setLocalRotation(0,R,W),A.body.transform.setLocalPosition(0,Ie,0),A.body.transform.setLocalScale(1/Math.sqrt(X),X,1);let _t=P.kind==="shell"&&(P.state==="shell"||P.state==="slide");for(let ar of A.extra)ar.show=!_t;P.kind==="shell"&&P.state==="slide"&&A.g.root.transform.setLocalRotation(0,ze*900,0);for(let[ar,Pc]of A.wings.entries())Pc.transform.setLocalRotation(0,0,(ar?-1:1)*Math.sin(ze*50)*35)},"placeEnemy");return{sync(A,P,L){ze+=P;for(let R of l.values()){let X=A.level.tiles[R.x][R.y];R.hop=Math.max(0,R.hop-P);let W=Math.sin(R.hop/.18*Math.PI)*.3*(R.hop>0?1:0),Ie=kr(R.x,L);for(let[_t,ar]of Object.entries(R.looks))ar.show=Ie&&_t===(X==="power"||X==="star"?"bonus":X),ar.transform.setLocalPosition(R.x+.5,R.y+.5+W,0)}A.coins.forEach((R,X)=>{let W=m[X];W.show=!R.taken&&kr(R.x,L),W.show&&(W.transform.setLocalPosition(R.x,R.y+Math.sin(ze*3+R.x)*.05,0),W.transform.setLocalRotation(0,ze*180+R.x*40,0))});for(let R=p.length-1;R>=0;R--){let X=p[R];X.t+=P;let W=X.t/.45;if(W>=1){X.e.show=!1,p.splice(R,1);continue}X.e.transform.setLocalPosition(X.x,X.y+Math.sin(W*Math.PI)*1.8,.1),X.e.transform.setLocalRotation(0,X.t*1400,0)}A.enemies.forEach((R,X)=>Xc(Ys[X],R)),A.bigCoins.forEach((R,X)=>{let{g:W,spin:Ie}=M[X],_t=!R.taken&&kr(R.x,L);W.show(_t),_t&&(W.root.transform.setLocalPosition(R.x,R.y+Math.sin(ze*2.5+R.x)*.08,0),Ie.transform.setLocalRotation(0,ze*120,0))});for(let R of $)R.look.show(A.level.tiles[R.x][R.y]==="gate"&&kr(R.x,L));J&&A.boss&&J.place(A.boss,ze),A.platforms.forEach((R,X)=>{let W=I[X],Ie=R.state!=="gone"&&R.x+R.w>L.left-2&&R.x<L.right+2;if(W.show(Ie),!Ie)return;let _t=R.state==="shake"?Math.sin(R.time*70)*.06:0;W.root.transform.setLocalPosition(R.x+R.w/2+_t,R.y+1-Ar.thick/2,0)});let O={battery:0,thruster:0,star:0};for(let R of A.items){if(R.state==="gone")continue;let X=Dr[R.kind][O[R.kind]++];X&&(X.g.show(!0),X.g.root.transform.setLocalPosition(R.body.x,R.body.y,R.state==="rise"?-.05:0),X.spin.transform.setLocalRotation(0,R.kind==="star"?Math.sin(ze*4)*25:ze*120,0),X.flame&&X.flame.transform.setLocalScale(.1,.16*(1+.3*Math.sin(ze*40)),.1))}for(let R of Object.keys(Dr))for(let X=O[R];X<Dr[R].length;X++)Dr[R][X].g.show(!1);Qs.forEach((R,X)=>{let W=A.sparks[X];R.show(!!W),W&&(R.root.transform.setLocalPosition(W.body.x,W.body.y+W.body.h/2,.2),R.root.transform.setLocalRotation(0,0,ze*720*-W.dir))});for(let R=Nt.length-1;R>=0;R--){let X=Nt[R];if(X.t+=P,X.vy-=40*P,X.x+=X.vx*P,X.y+=X.vy*P,X.y<-3||X.t>1.5){X.e.show=!1,Nt.splice(R,1);continue}X.e.transform.setLocalPosition(X.x,X.y,.3),X.e.transform.setLocalRotation(X.t*500,X.t*300*Math.sign(X.vx),0)}for(let R of js){let X=!!A.checkpoint&&A.checkpoint.x>=R.cp.x,W=kr(R.cp.x,L);R.g.show(W),R.on.show=W&&X,R.off.show=W&&!X}},bump(A,P,L){let O=l.get(`${A},${P}`);if(O&&(O.hop=.18),L){let R=v.find(X=>!p.some(W=>W.e===X))??v[0];R.show=!0,p.push({e:R,x:A+.5,y:P+1,t:0})}},breakAt(A,P){for(let[L,O]of[[-3,12],[3,12],[-2.5,8],[2.5,8]]){let R=Zs.find(X=>!Nt.some(W=>W.e===X))??Zs[0];R.show=!0,Nt.push({e:R,x:A+.5+Math.sign(L)*.2,y:P+.5+(O>10?.2:-.2),vx:L,vy:O,t:0})}},hide(){for(let A of Object.values(Dr).flat())A.g.show(!1);for(let A of Qs)A.show(!1);for(let A of Nt)A.e.show=!1;Nt.length=0;for(let A of l.values())for(let P of Object.values(A.looks))P.show=!1;for(let A of[...m,...v])A.show=!1;for(let A of Ys)A.g.show(!1);for(let A of js)A.g.show(!1);for(let A of M)A.g.show(!1);for(let A of I)A.show(!1);for(let A of $)A.look.show(!1);J?.hide()}}}d(ec,"dressThings");async function Vp(e,r,t,i,n,o){let s=Dt(r,`Boss ${t.kind}`),a=Q(r,"Boss body",s.root),l=await F(e,[1,1,1],{specular:.2}),u=await F(e,[.05,.05,.08],{specular:.6,roughness:.2}),c=[],h=d((f,g,b,M,_)=>{let w=s.add(e,f,g,b,M,a);return _&&w.transform.setLocalRotation(_[0],_[1],_[2]),w},"add");if(t.kind==="king"){let f=await F(e,[.6,.28,.92],{specular:.6,roughness:.3}),g=await F(e,[1,.78,.2],{glow:await o("#5a3a00"),specular:.9,roughness:.2});h(n,f,[0,.95,0],[1.15,.95,1]),h(i,g,[0,1.85,0],[.9,.22,.75]);for(let b of[-.32,0,.32])h(i,g,[b,2.02,0],[.18,.18,.18],[0,0,45]);for(let b of[-1,1])h(n,l,[b*.32,1.2,.85],[.22,.26,.12]),h(n,u,[b*.3,1.17,.95],[.1,.13,.06]),h(i,u,[b*.33,1.52,.88],[.4,.07,.05],[0,0,b*-20]),h(n,u,[b*.55,.08,.2],[.3,.12,.35])}else if(t.kind==="golem"){let f=await F(e,[.42,.38,.5],{specular:.15}),g=await F(e,[.28,.25,.35],{specular:.15}),b=await F(e,[.25,.95,.9],{glow:await o("#0d6a64"),specular:.9,roughness:.15}),M=await F(e,[1,.6,.2],{glow:await o("#ff8a20"),specular:0});h(i,f,[0,1,0],[1.7,1.3,1.2]),h(i,f,[0,1.95,.05],[1,.7,.9]);for(let _ of[-1,1])h(i,g,[_*1,1,0],[.4,1.1,.5]),h(i,g,[_*.45,.18,0],[.5,.36,.6]),h(i,M,[_*.22,2,.5],[.18,.1,.05]);for(let[_,w,S]of[[-.5,1.75,25],[0,2,0],[.5,1.75,-25],[-.3,1.4,35],[.35,1.45,-30]])h(i,b,[_,w+.3,-.5],[.22,.8,.22],[0,45,S])}else{let f=await F(e,[.75,.78,.85],{specular:.9,roughness:.2}),g=await F(e,[1,.5,.15],{specular:.6,roughness:.3}),b=await F(e,[1,.2,.25],{glow:await o("#ff2030"),specular:0});h(n,f,[0,.4,0],[1.15,.35,.9]),h(n,g,[0,.62,0],[.55,.38,.5]),h(n,u,[0,.42,.75],[.32,.2,.15]),h(n,b,[0,.42,.85],[.15,.12,.08]);for(let M of[-1,1]){h(i,f,[M*.75,.9,0],[.08,.5,.08]);let _=Q(r,"Rotor",a);_.transform.setLocalPosition(M*.75,1.17,0),s.add(e,i,u,[0,0,0],[1.1,.04,.16],_),c.push(_),h(n,f,[M*1.05,.25,0],[.18,.18,.18])}}let m=await F(e,[.3,1,.95],{glow:await o("#20b0a8"),specular:.9,roughness:.1}),p=await F(e,[1,.85,.2],{glow:await o("#ffb020"),specular:.2}),v=Array.from({length:6},(f,g)=>{let b=Q(r,`Boss shot ${g}`);return t.kind==="drone"?(ce(e,b,n,p),b.transform.setLocalScale(.24,.24,.24)):(ce(e,b,i,m),b.transform.setLocalScale(.6,.2,.2)),b.show=!1,b});return{place(f,g){let b=f.state!=="gone"&&!(f.hurt>0&&Math.floor(f.hurt/.08)%2===0);s.show(b);let M=f.body;s.root.transform.setLocalPosition(M.x,M.y+(f.state==="down"?M.h:0),0);let _=1;f.state==="crouch"||f.state==="aim"?_=.82:f.state==="leap"?_=1.12:f.kind==="king"&&f.state==="walk"&&(_=1+Math.sin(g*9)*.05),a.transform.setLocalScale(1/Math.sqrt(_),_,1);let w=f.kind==="drone"?0:f.dir<0?-40:40;s.root.transform.setLocalRotation(0,w,f.state==="down"?180:f.kind==="drone"?-f.body.vx*3:0);for(let S of c)S.transform.setLocalRotation(0,g*1500,0);v.forEach((S,T)=>{let C=f.shots[T];S.show=!!C,C&&(S.transform.setLocalPosition(C.body.x,C.body.y+C.body.h/2,0),S.transform.setLocalRotation(f.kind==="drone"?0:g*600,0,0))})},hide(){s.show(!1);for(let f of v)f.show=!1}}}d(Vp,"bossLook");var tc="omega-run-progress";function Wp(e){return Array.from({length:e},()=>({done:!1,big:Array(xs).fill(!1),best:0}))}d(Wp,"emptyProgress");function rc(e,r){let t=Wp(r);try{let i=JSON.parse(e?.getItem(tc)??"null");return Array.isArray(i)?t.map((n,o)=>{let s=i[o];return!s||typeof s!="object"?n:{done:s.done===!0,big:n.big.map((a,l)=>Array.isArray(s.big)&&s.big[l]===!0),best:typeof s.best=="number"&&s.best>0?Math.floor(s.best):0}}):t}catch{return t}}d(rc,"loadProgress");function ic(e,r){try{e?.setItem(tc,JSON.stringify(r))}catch{}}d(ic,"saveProgress");function nc(e,r,t,i){let n=e[r];n.done=!0,n.best=Math.max(n.best,t),i.forEach((o,s)=>{o&&(n.big[s]=!0)})}d(nc,"recordClear");function oc(e,r){return r===0||!!e[r-1]?.done}d(oc,"unlocked");function sc(e){return{done:e.filter(r=>r.done).length,big:e.reduce((r,t)=>r+t.big.filter(Boolean).length,0),bigOf:e.length*xs,score:e.reduce((r,t)=>r+t.best,0)}}d(sc,"totals");var Y=d(e=>document.getElementById(e),"$"),xt=Y("view"),or=Y("banner"),nr=new URLSearchParams(location.search),dc=nr.has("debug"),te="loading",Xr=0,Ue=xt.getContext("webgl2",{antialias:!0});if(!Ue)throw Y("load-text").textContent="Este browser n\xE3o tem WebGL 2.",new Error("No WebGL 2");new Er().registerDependencies();H.setLoader(new ut(async e=>e));H.for(Ue);Ue.clearColor(.6,.82,1,1);var hc=15,Hp=1.6,He=new se;He.name="Side camera";He.fieldOfView=40;He.nearPlane=.1;He.farPlane=200;He.initialize();se.setMainCamera(He);var Gs=0,We=8,Ns=Math.tan(He.fieldOfView*Math.PI/360)*hc,zs=1/0;function mc(){let r=document.getElementById("top").getBoundingClientRect().bottom/Math.max(1,xt.clientHeight)*2*Ns;zs=Ns-Gs-r-.3}d(mc,"measureTop");function Vs(){let e=Math.min(window.devicePixelRatio||1,2),r=Math.max(1,Math.round(xt.clientWidth*e)),t=Math.max(1,Math.round(xt.clientHeight*e));xt.width===r&&xt.height===t||(xt.width=r,xt.height=t,Ue.viewport(0,0,r,t),Ke.rendererWidth=r,Ke.rendererHeight=t,He.aspectRatio=r/t,He.updateProjectionMatrix(),We=Ns*He.aspectRatio,mc())}d(Vs,"resize");window.addEventListener("resize",Vs);Vs();var Br=new Dn,z,Me,pc,di,li,Vn,ac=1.6,Ws=1,Wn=1,ui=1,Jp=7,we={from:0,done:!1,hop:-1,x0:0,y0:0},qp=.45,lc=0,rr={y:0,vy:0},Bs=60,ir=1,Gn=0,kt=nr.has("auto")?Rr():null,Us={pressed:0,jumped:0},fc=(()=>{try{return window.localStorage}catch{return null}})(),sr=rc(fc,it.length),Yp=nr.has("unlock"),Hs=d(e=>Yp||oc(sr,e),"isOpen"),Oe=!1,zn=null,yt=-1,hi=0;function nt(e){te=e,Xr=0,or.hidden=e!=="over"||Oe,Y("map").hidden=e!=="map",Y("pause").hidden=e!=="pause",Y("end").hidden=e!=="end",Y("title").hidden=!Oe||e==="loading"||e==="map";let r=e==="play"||e==="dead"||e==="clear"||e==="over";Y("top").hidden=Oe||!(r||e==="pause"),Y("touch").hidden=!Os||Oe||!r,e==="over"&&!Oe&&(or.innerHTML=`<b>Fim do jogo</b><span>${z.score} pontos</span>
      <div class="actions"><button data-act="retry">Tentar outra vez</button><button data-act="map">Mapa</button></div>`)}d(nt,"setState");var Js=d(e=>e.map(r=>r?"\u25C6":"\u25C7").join(""),"diamonds");function $p(){if(Oe){mi();return}or.hidden=!1;let e=yt===it.length-1,r=z.flag?`<small>Bandeira: +${z.flag.points}</small>`:"",t=z.bigCoins.map(i=>i.taken);or.innerHTML=`<b>N\xEDvel completo!</b><span>${z.score} pontos</span>${r}
    <small class="big">Moedas grandes: <i>${Js(t)}</i></small>
    <div class="actions"><button data-act="${e?"end":"next"}">Continuar</button><button data-act="retry">Repetir</button></div>`,nc(sr,yt,z.score,t),ic(fc,sr)}d($p,"showClearBanner");function cc(){let e=sc(sr);Y("end-stats").innerHTML=`<li><b>${e.done}/${it.length}</b> n\xEDveis</li><li><b>${e.big}/${e.bigOf}</b> moedas grandes</li><li><b>${e.score}</b> pontos (melhores de cada n\xEDvel)</li>`,nt("end")}d(cc,"showEnd");function Un(){te!=="play"||Oe||(Br.clear(),nt("pause"))}d(Un,"pause");function Ds(){te==="pause"&&(Br.clear(),te="play",nt("play"))}d(Ds,"resume");function jp(e){let r=Math.ceil(e);return`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`}d(jp,"formatTime");function vc(){let e=z.boss,r=!!e&&e.state!=="idle"&&e.hp>0;Y("boss-chip").hidden=!r,r&&(Y("boss-chip").innerHTML=`${Ll[e.kind]} <b>${"\u2665".repeat(e.hp)}</b>`),Y("big").textContent=Js(z.bigCoins.map(t=>t.taken)),Y("lives").textContent=String(z.lives),Y("coins").textContent=String(z.coinCount),Y("score").textContent=String(z.score).padStart(6,"0"),Y("time").textContent=jp(z.time),Y("time-chip").classList.toggle("hurry",z.time<60)}d(vc,"showHud");function Hn(e){z=e,Me=Ul(e.hero.body.x,e.hero.body.y,We),Gn=0,Br.clear(),kt&&(kt=Rr()),Ws=Wn=1,ui=1,rr={y:0,vy:0},Vn.setFlag(1),di.hide();let r=[];for(let t=0;t<e.level.width;t++)for(let i=0;i<e.level.height;i++)e.level.tiles[t][i]==="gate"&&r.push(t);zn=e.backGates.length&&r.length?{left:e.backGates[0].x,right:Math.max(...r)+1}:null,nt("play"),vc()}d(Hn,"begin");function mi(){Hn(ni(it[yt]))}d(mi,"restart");async function qs(e){nt("loading");let r=it[e];Y("loading").classList.remove("done"),Y("load-title").textContent=r.name,await ci(.1,"A montar o n\xEDvel\u2026");let t=ni(r),i=tr[t.level.theme];if(yt===e&&z&&Se){Hn(t),Y("loading").classList.add("done");return}Se?.destroy(),Se=new wr,Se.name=r.name,pc=await $l(Ue,Se,t.level),di=await ec(Ue,Se,t),await ci(.5,"A pintar o c\xE9u\u2026"),await jl(Ue,Se,t.level.width,t.level.theme),Vn=await Kl(Ue,Se,t.level.goal.x,t.level.goal.y),await ci(.75,"A acordar o Bit\u2026"),li=await Ql(Ue,Se),Se.setGlRenderingContext(Ue),Pr.loadScene(Se);let n=Se.renderPipeline.settings;n.toneMapping=2,n.applyQuality(xc),Se.isRunning=!0,Ue.clearColor(i.clear[0],i.clear[1],i.clear[2],1),document.body.style.background=i.page,yt=e,Y("level-name").textContent=r.name,Hn(t),await ci(1,"Pronto"),Y("loading").classList.add("done")}d(qs,"loadLevel");function Kp(){let e=Y("worlds");e.innerHTML=Rs.map((r,t)=>`
    <section class="world ${r.theme}">
      <h2>${t+1} \xB7 ${r.name}</h2>
      <ol>${r.levels.map((i,n)=>{let o=t*3+n,s=sr[o],a=i.name.split(" \xB7 ")[1]??i.name,l=!Hs(o);return`<li><button class="node${s.done?" done":""}${l?" locked":""}${o===hi?" picked":""}" data-level="${o}"${l?' aria-disabled="true"':""}>
          <span class="num">${t+1}-${n+1}</span><span class="name">${l?"\u{1F512} ":""}${a}</span>
          <span class="big">${Js(s.big)}</span>${s.best?`<span class="best">${s.best}</span>`:""}</button></li>`}).join("")}</ol>
    </section>`).join(""),e.querySelector(".picked")?.scrollIntoView({block:"nearest",inline:"nearest"}),nt("map")}d(Kp,"showMap");function ai(e){hi=Math.max(0,Math.min(it.length-1,e)),Kp()}d(ai,"pick");function ks(e){Hs(e)&&(hi=e,Oe&&bc(),qs(e).catch(r=>{Y("load-text").textContent=`Erro: ${r?.message??r}`,console.error(r)}))}d(ks,"play");function Qp(){let e=kt?Nl(kt,z,le):Br.read();e.jumpPressed&&(Us.pressed=performance.now()),ws(z,e,Me.x+We);let r=z.hero,t=r.body;for(let a of z.events)a.type==="jump"?(Us.jumped=performance.now(),ir=1.25):a.type==="land"?ir=.75:a.type==="stomp"||a.type==="kick"?ir=1.2:a.type==="bump"?di.bump(a.x,a.y,a.tile==="bonus"):a.type==="break"?di.breakAt(a.x,a.y):(a.type==="grow"||a.type==="shrink")&&(Ws=a.type==="grow"?1:ac,Wn=a.type==="grow"?ac:1,ui=0);if(z.dead){rr={y:0,vy:t.y<-1?0:13},nt("dead");return}let i=Me.x-We+t.w/2;t.x<i&&(t.x=i,t.vx<0&&(t.vx=0));let n=r.riding>=0?z.platforms[r.riding]:null,o=z.boss,s=!!zn&&!!o&&o.state!=="idle"&&o.state!=="down"&&o.state!=="gone";if(Ts(Me,t,We,z.level.width,le,z.level.start.y+Ce.above,zs,t.h,s||!!n&&n.dx<0),s){let a=zn.left+We,l=Math.max(a,zn.right+.5-We);Me.x=Math.min(l,Math.max(a,Me.x)),Me.minX=Math.min(Me.minX,Me.x)}if(z.cleared){let a=z.level.goal.y+1;t.x=z.level.goal.x-(t.y>=a?.06:.52)-t.w/2,we={from:t.y,done:!1,hop:-1,x0:0,y0:0},nt("clear")}}d(Qp,"step");function Zp(e){if(Xr+=e,!z||te==="map"||te==="loading"||te==="end")return;if(te==="play"){Gn+=e;let u=0;for(;Gn>=le&&u++<24&&te==="play";)Qp(),Gn-=le}else if(te==="clear"){let u=z.hero.body,c=z.level.goal.y,h=c+1;if(we.hop<0)u.y=Math.max(Math.min(h,we.from),u.y-Jp*e),Vn.setFlag(Math.min(1,Math.max(0,(u.y-c-si)/(Nn-si)))),u.y<=Math.min(h,we.from)+1e-9&&(we.hop=0,we.x0=u.x,we.y0=u.y,Vn.setFlag(0));else if(we.done)Xr>1.2&&or.hidden&&$p();else{we.hop+=e;let m=Math.min(1,we.hop/qp);u.x=we.x0+(z.level.goal.x+.6+u.w/2-we.x0)*m,u.y=we.y0+(c-we.y0)*m+1.6*Math.sin(Math.PI*m),m>=1&&(we.done=!0,Xr=0,u.onGround=!0,u.vx=0,ir=.75)}Ts(Me,u,We,z.level.width,e,z.level.start.y+Ce.above,zs,u.h)}else if(te==="dead"&&(Xr>.35&&(rr.vy-=40*e,rr.y+=rr.vy*e),Xr>2)){let u=ys(z);u?Hn(u):Oe?mi():nt("over")}vc();let r=z.hero;lc+=e;let t=te==="clear"&&!we.done,i=te==="dead"?0:t?we.hop<0?90:60:te==="clear"?20:r.facing*60;Bs+=(i-Bs)*(1-Math.exp(-e*14)),ir+=(1-ir)*(1-Math.exp(-e*10)),ui+=te==="play"?e:0;let n=ui>=.6||Math.floor(ui/.1)%2?Wn:Ws;li.place(r.body.x,r.body.y+(te==="dead"?rr.y:0),Bs,ir,n);let o=r.body,s=t?{clip:"Jump",speed:1}:ql({onGround:o.onGround,vx:o.vx,vy:o.vy,dead:te==="dead",won:te==="clear"});li.animate(s.clip,s.speed),li.tint(z.power,z.star,lc);let a=te==="play"&&z.hurt>0&&Math.floor(z.hurt/.07)%2===0;li.setVisible(te!=="over"&&r.body.y+rr.y>-4&&!a),pc.showAround(Me.x,We),di.sync(z,te==="play"?e:0,{left:Me.x-We,right:Me.x+We});let l=Me.y-Gs;He.transform.setLocalPosition(Me.x,l+Hp,hc),He.transform.lookAt(x.fromValues(Me.x,l,0))}d(Zp,"update");var Se,Pr,Is=0,On=0,Fs=0;function gc(e){let r=Is?Math.min((e-Is)/1e3,.1):0;Is=e,Vs(),Zp(r),Pr.update(te==="pause"?0:r),Pr.render(),Fs++,On+=r,On>=.5&&(dc&&(Y("stats").textContent=`${Math.round(Fs/On)} fps`),Fs=0,On=0),requestAnimationFrame(gc)}d(gc,"frame");function ci(e,r){return Y("load-bar").style.width=`${Math.round(e*100)}%`,Y("load-text").textContent=r,new Promise(t=>requestAnimationFrame(()=>t()))}d(ci,"loaded");function ef(){let e=sr.findIndex((r,t)=>!r.done&&Hs(t));return e<0?0:e}d(ef,"firstOpen");async function uc(){Oe=!0,kt=Rr(),yt!==0||!z?await qs(0):mi(),nt("play")}d(uc,"enterDemo");function bc(){Oe=!1,kt=nr.has("auto")?Rr():null,Y("title").hidden=!0}d(bc,"leaveDemo");var xc=1,Os=!1;async function tf(){await ci(.3,"A preparar\u2026"),Se=new wr,Se.setGlRenderingContext(Ue),Pr=new Sn,Pr.initialize(xt),Pr.loadScene(Se);let e=nr.get("quality"),r={low:0,medium:1,high:2};xc=e&&e in r?r[e]:$r.suggestedQuality(Ue),Os=nr.has("touch")||matchMedia("(pointer: coarse)").matches,Os&&(Gs=1.4,mc(),document.querySelector("#title .keys").textContent="\u25C0 \u25B6 para andar \xB7 A salta \xB7 B corre \xB7 \u275A\u275A para pausa"),Br.bindTouch(Y("pad"),Y("btn-a"),Y("btn-b"));let t=d(n=>{n==="next"?ai(Math.min(it.length-1,yt+1)):n==="retry"?(or.hidden=!0,mi()):n==="map"?ai(Math.max(0,yt)):n==="end"?cc():n==="resume"?Ds():n==="title"?uc():n==="start"&&(bc(),ai(ef()))},"act");for(let n of["banner","pause","end","title","map-head"])Y(n).addEventListener("click",o=>{let s=o.target.closest("button");s?.dataset.act&&t(s.dataset.act)});document.addEventListener("visibilitychange",()=>{document.hidden&&Un()}),Y("worlds").addEventListener("click",n=>{let o=n.target.closest("button");o?.dataset.level&&ks(Number(o.dataset.level))}),Y("pause-button").addEventListener("click",()=>Un()),window.addEventListener("keydown",n=>{if(te==="map"){let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-3,ArrowDown:3,KeyA:-1,KeyD:1};n.code in o?(n.preventDefault(),ai(hi+o[n.code])):(n.code==="Enter"||n.code==="Space")&&(n.preventDefault(),ks(hi))}else Oe&&(n.code==="Enter"||n.code==="Space")&&te!=="loading"?(n.preventDefault(),t("start")):te==="clear"&&!or.hidden&&n.code==="Enter"?t(yt===it.length-1?"end":"next"):te==="over"&&n.code==="Enter"?t("retry"):te==="play"&&(n.code==="Escape"||n.code==="KeyP")?Un():te==="pause"&&(n.code==="Escape"||n.code==="KeyP"||n.code==="Enter")?Ds():n.code==="Escape"&&(te==="clear"||te==="over"||te==="end")&&t("map")}),Y("stats").hidden=!dc,window.platformer={get state(){return te},get world(){return z},get hero(){return z.hero},get level(){return z.level},get cam(){return Me},get halfWidth(){return We},controls:Br,restart:mi,timing:Us,play:ks,pick:ai,progress:sr,pause:Un,resume:Ds,showEnd:cc,get demo(){return Oe},get autoplay(){return!!kt},set autoplay(n){kt=n?Rr():null}},requestAnimationFrame(gc);let i=nr.get("level");i!==null?await qs(Math.max(0,Math.min(it.length-1,Number(i)||0))):await uc()}d(tf,"start");tf().catch(e=>{Y("load-text").textContent=`Erro: ${e?.message??e}`,console.error(e)});
